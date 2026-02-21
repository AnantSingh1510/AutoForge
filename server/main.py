from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List
import asyncio
import uuid

app = FastAPI(title="DevMate Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory store ────────────────────────────────────────────────────────
store = {
    "events":        [],
    "conversations": [],
    "files":         [],
    "stats": {
        "total":  0,
        "direct": 0,
        "drive":  0,
        "failed": 0,
    }
}

connected: List[WebSocket] = []


# ── WebSocket ──────────────────────────────────────────────────────────────
@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected.append(websocket)

    try:
        # Send full current state on connect
        await websocket.send_json({"type": "init", **store})

        # Keep alive loop — detect disconnect via receive
        while True:
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=25)
            except asyncio.TimeoutError:
                # Send ping every 25s to keep alive
                await websocket.send_json({"type": "ping"})

    except (WebSocketDisconnect, Exception):
        if websocket in connected:
            connected.remove(websocket)


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


# ── Event receiver ─────────────────────────────────────────────────────────
@app.post("/event")
async def receive_event(request: Request):
    body = await request.json()

    event = {
        **body,
        "id": str(uuid.uuid4())[:8],
        "ts": datetime.utcnow().isoformat(),
    }

    store["events"] = store["events"][-200:] + [event]

    t = event.get("type")

    if t == "message":
        store["conversations"] = store["conversations"][-100:] + [event]
        store["stats"]["total"] += 1

    elif t == "reply":
        store["conversations"] = store["conversations"][-100:] + [event]

    elif t == "file_sent":
        store["files"] = store["files"][-100:] + [event]
        if event.get("method", "direct") == "direct":
            store["stats"]["direct"] += 1
        else:
            store["stats"]["drive"] += 1

    elif t == "error":
        store["stats"]["failed"] += 1

    await broadcast({"type": "event", "data": event, "stats": store["stats"]})
    return {"ok": True}


# ── REST fallbacks ─────────────────────────────────────────────────────────
@app.get("/api/stats")
def get_stats(): return store["stats"]

@app.get("/api/events")
def get_events(): return store["events"][-50:]

@app.get("/api/conversations")
def get_convos(): return store["conversations"][-50:]

@app.get("/api/files")
def get_files(): return store["files"][-50:]

@app.get("/")
def root():
    return {"status": "running", "connected_dashboards": len(connected)}