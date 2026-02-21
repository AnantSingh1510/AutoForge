import uuid
import asyncio
from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import Column, String, DateTime, JSON, select, func
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from database import engine, Base, AsyncSessionLocal
from models.event import Event
from sqlalchemy import select, func

# ─────────────────────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────────────────────

app = FastAPI(title="DevMate Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

connected: List[WebSocket] = []


# ─────────────────────────────────────────────────────────────
# Startup
# ─────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ─────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────


async def get_stats(session):
    total = await session.scalar(
        select(func.count()).where(Event.type == "message")
    )

    direct = await session.scalar(
        select(func.count()).where(
            Event.type == "file_sent",
            Event.payload["method"].as_string() == "direct"
        )
    )

    drive = await session.scalar(
        select(func.count()).where(
            Event.type == "file_sent",
            Event.payload["method"].as_string() != "direct"
        )
    )

    failed = await session.scalar(
        select(func.count()).where(Event.type == "error")
    )

    return {
        "total": total or 0,
        "direct": direct or 0,
        "drive": drive or 0,
        "failed": failed or 0,
    }


async def broadcast(payload: dict):
    dead = []
    for ws in connected:
        try:
            await ws.send_json(payload)
        except Exception:
            dead.append(ws)

    for ws in dead:
        if ws in connected:
            connected.remove(ws)


# ─────────────────────────────────────────────────────────────
# WebSocket
# ─────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected.append(websocket)

    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Event)
                .order_by(Event.ts.desc())
                .limit(200)
            )
            events = result.scalars().all()
            stats = await get_stats(session)

        await websocket.send_json({
            "type": "init",
            "events": [e.payload for e in reversed(events)],
            "stats": stats,
        })

        while True:
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=25)
            except asyncio.TimeoutError:
                await websocket.send_json({"type": "ping"})

    except (WebSocketDisconnect, Exception):
        if websocket in connected:
            connected.remove(websocket)


# ─────────────────────────────────────────────────────────────
# Event Endpoint
# ─────────────────────────────────────────────────────────────

@app.post("/event")
async def receive_event(request: Request):
    body = await request.json()

    event_id = str(uuid.uuid4())[:8]

    event = {
        **body,
        "id": event_id,
        "ts": datetime.utcnow().isoformat(),
    }

    async with AsyncSessionLocal() as session:
        db_event = Event(
            id=event_id,
            type=event.get("type"),
            payload=event
        )
        session.add(db_event)
        await session.commit()

        stats = await get_stats(session)

    await broadcast({
        "type": "event",
        "data": event,
        "stats": stats
    })

    return {"ok": True}


# ─────────────────────────────────────────────────────────────
# REST Endpoints
# ─────────────────────────────────────────────────────────────

@app.get("/api/stats")
async def api_stats():
    async with AsyncSessionLocal() as session:
        return await get_stats(session)


@app.get("/api/events")
async def api_events():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Event)
            .order_by(Event.ts.desc())
            .limit(50)
        )
        events = result.scalars().all()
        return [e.payload for e in reversed(events)]


@app.get("/")
def root():
    return {
        "status": "running",
        "connected_dashboards": len(connected),
    }