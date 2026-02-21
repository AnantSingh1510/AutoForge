from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json

router = APIRouter()

_connections: List[WebSocket] = []


@router.websocket("/dashboard")
async def dashboard_ws(websocket: WebSocket):
    await websocket.accept()
    _connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        _connections.remove(websocket)


async def broadcast(event: dict):
    """Send an event to all connected dashboard clients."""
    message = json.dumps(event)
    dead = []
    for ws in _connections:
        try:
            await ws.send_text(message)
        except Exception:
            dead.append(ws)
    for ws in dead:
        _connections.remove(ws)