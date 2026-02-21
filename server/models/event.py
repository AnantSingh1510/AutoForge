from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, index=True)
    payload = Column(JSON)
    ts = Column(DateTime(timezone=True), server_default=func.now())