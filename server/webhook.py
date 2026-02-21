from fastapi import APIRouter, Request, BackgroundTasks
from fastapi.responses import PlainTextResponse
import os
from agents.file_agent import run_agent
from server.events import broadcast

router = APIRouter()

VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "devmate_token")

@router.get("/whatsapp")
async def verify_webhook(request: Request):
    params = dict(request.query_params)
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == VERIFY_TOKEN
    ):
        return PlainTextResponse(params["hub.challenge"])
    return PlainTextResponse("Forbidden", status_code=403)

@router.post("/whatsapp")
async def receive_message(request: Request, background_tasks: BackgroundTasks):
    body = await request.json()

    try:
        entry = body["entry"][0]
        changes = entry["changes"][0]
        value = changes["value"]
        message = value["messages"][0]

        text = message["text"]["body"]
        sender = message["from"] 

        await broadcast({"event": "message_received", "from": sender, "text": text})

        background_tasks.add_task(handle_request, text, sender)

    except (KeyError, IndexError):
        pass

    return {"status": "ok"}


async def handle_request(text: str, sender: str):
    """Run the agent and send result back to WhatsApp."""
    await broadcast({"event": "agent_start", "input": text, "sender": sender})
    result = await run_agent(text, sender)
    await broadcast({"event": "agent_done", "result": result})