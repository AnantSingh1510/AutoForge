import os
import chromadb
from chromadb.config import Settings
import json
from datetime import datetime

CHROMA_PATH = os.getenv("CHROMA_PERSIST_PATH", "./memory/chroma_db")
HISTORY_LIMIT = 10 

_client = None
_collection = None


def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=CHROMA_PATH)
        _collection = _client.get_or_create_collection(
            name="devmate_conversations",
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def save_interaction(sender: str, human: str, ai: str):
    """Save a conversation turn to memory."""
    collection = get_collection()
    interaction_id = f"{sender}_{datetime.utcnow().isoformat()}"

    collection.add(
        documents=[human],
        metadatas=[{
            "sender": sender,
            "human": human,
            "ai": ai,
            "timestamp": datetime.utcnow().isoformat(),
        }],
        ids=[interaction_id],
    )


def get_history(sender: str) -> list:
    """Retrieve recent conversation history for a sender."""
    collection = get_collection()

    try:
        results = collection.get(
            where={"sender": sender},
            include=["metadatas"],
        )

        if not results["metadatas"]:
            return []

        turns = sorted(
            results["metadatas"],
            key=lambda x: x.get("timestamp", ""),
        )[-HISTORY_LIMIT:]

        return [{"human": t["human"], "ai": t["ai"]} for t in turns]

    except Exception:
        return []


def get_all_interactions(limit: int = 50) -> list:
    """Get recent interactions across all senders (for dashboard)."""
    collection = get_collection()

    try:
        results = collection.get(include=["metadatas"])
        turns = sorted(
            results["metadatas"],
            key=lambda x: x.get("timestamp", ""),
            reverse=True,
        )[:limit]
        return turns
    except Exception:
        return []