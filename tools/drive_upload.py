#!/usr/bin/env python3
"""
Called by OpenClaw via shell for files over 10MB.
Usage: python drive_upload.py "/path/to/file"
Prints shareable link to stdout.
"""
import sys
import os
import mimetypes
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

CREDS  = os.getenv("GOOGLE_DRIVE_CREDENTIALS_JSON", "credentials.json")
FOLDER = os.getenv("GOOGLE_DRIVE_FOLDER_ID", None)


def upload(path: str) -> str:
    creds = service_account.Credentials.from_service_account_file(
        CREDS, scopes=["https://www.googleapis.com/auth/drive.file"]
    )
    svc = build("drive", "v3", credentials=creds)

    name = os.path.basename(path)
    mime, _ = mimetypes.guess_type(path)
    mime = mime or "application/octet-stream"

    meta = {"name": name}
    if FOLDER:
        meta["parents"] = [FOLDER]

    media = MediaFileUpload(path, mimetype=mime, resumable=True)
    f = svc.files().create(body=meta, media_body=media, fields="id,webViewLink").execute()

    svc.permissions().create(
        fileId=f["id"],
        body={"type": "anyone", "role": "reader"},
    ).execute()

    return f["webViewLink"]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: no file path given")
        sys.exit(1)

    path = sys.argv[1]

    if not os.path.exists(path):
        print(f"ERROR: file not found: {path}")
        sys.exit(1)

    try:
        link = upload(path)
        print(link)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)