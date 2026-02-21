from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.webhook import router as webhook_router
from server.events import router as events_router

app = FastAPI(title="DevMate", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook_router, prefix="/webhook")
app.include_router(events_router, prefix="/ws")

@app.get("/")
def root():
    return {"status": "DevMate is running"}