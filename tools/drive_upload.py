import os
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from langchain.tools import tool
from server.events import broadcast
import asyncio
import mimetypes


CREDENTIALS_PATH = os.getenv("GOOGLE_DRIVE_CREDENTIALS_JSON", "credentials.json")
FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID", None)

SCOPES = ["https://www.googleapis.com/auth/drive.file"]


def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_PATH, scopes=SCOPES
    )
    return build("drive", "v3", credentials=creds)


@tool
def upload_to_drive(file_path: str) -> str:
    """
    Upload a file from the local filesystem to Google Drive.
    Returns a shareable link to the uploaded file.

    Args:
        file_path: The absolute path to the file on the local machine.
    """
    asyncio.create_task(
        broadcast({"event": "tool_call", "tool": "upload_to_drive", "input": file_path})
    )

    if not os.path.exists(file_path):
        return f"File not found at path: {file_path}"

    try:
        service = get_drive_service()

        filename = os.path.basename(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)
        mime_type = mime_type or "application/octet-stream"

        file_metadata = {"name": filename}
        if FOLDER_ID:
            file_metadata["parents"] = [FOLDER_ID]

        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)

        uploaded = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id, webViewLink")
            .execute()
        )

        file_id = uploaded.get("id")
        link = uploaded.get("webViewLink")

        service.permissions().create(
            fileId=file_id,
            body={"type": "anyone", "role": "reader"},
        ).execute()

        asyncio.create_task(
            broadcast({"event": "tool_result", "tool": "upload_to_drive", "result": link})
        )

        return f"Uploaded successfully. Shareable link: {link}"

    except Exception as e:
        return f"Failed to upload file: {str(e)}"