import os
import httpx
from langchain.tools import tool
from server.events import broadcast
import asyncio

WHATSAPP_TOKEN = os.getenv("WHATSAPP_API_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
API_URL = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"

_current_sender: str = ""


def set_sender(phone: str):
    global _current_sender
    _current_sender = phone


@tool
def send_whatsapp_message(message: str) -> str:
    """
    Send a WhatsApp message back to the user.
    Use this as the final step to deliver results.

    Args:
        message: The message text to send to the user.
    """
    asyncio.create_task(
        broadcast({"event": "tool_call", "tool": "send_whatsapp", "input": message})
    )

    if not _current_sender:
        return "No sender set. Cannot send WhatsApp message."

    try:
        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}",
            "Content-Type": "application/json",
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": _current_sender,
            "type": "text",
            "text": {"body": message},
        }

        with httpx.Client() as client:
            response = client.post(API_URL, json=payload, headers=headers)
            response.raise_for_status()

        asyncio.create_task(
            broadcast({"event": "tool_result", "tool": "send_whatsapp", "result": "Message sent"})
        )

        return "WhatsApp message sent successfully."

    except Exception as e:
        return f"Failed to send WhatsApp message: {str(e)}"