import subprocess
import os
from langchain.tools import tool
from server.events import broadcast
import asyncio


FILES_ROOT = os.getenv("FILES_ROOT_PATH", os.path.expanduser("~/Documents"))


@tool
def search_file(filename: str) -> str:
    """
    Search the user's computer for a file by name or partial name.
    Returns the full file path if found, or an error message.

    Args:
        filename: The name or partial name of the file to find.
    """
    asyncio.create_task(
        broadcast({"event": "tool_call", "tool": "search_file", "input": filename})
    )

    try:
        result = subprocess.run(
            ["find", FILES_ROOT, "-iname", f"*{filename}*", "-type", "f"],
            capture_output=True,
            text=True,
            timeout=15,
        )

        matches = [line.strip() for line in result.stdout.strip().split("\n") if line.strip()]

        if not matches:
            return f"No file matching '{filename}' found under {FILES_ROOT}."

        best_match = matches[0]

        asyncio.create_task(
            broadcast({"event": "tool_result", "tool": "search_file", "result": best_match})
        )

        if len(matches) > 1:
            return f"Found {len(matches)} matches. Using: {best_match}\nAll matches:\n" + "\n".join(matches)

        return f"Found file: {best_match}"

    except subprocess.TimeoutExpired:
        return "File search timed out. Try a more specific filename."
    except Exception as e:
        return f"Error searching for file: {str(e)}"