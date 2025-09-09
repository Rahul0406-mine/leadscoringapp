
from sqlmodel import SQLModel, Field, JSON, Column
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(sa_column_kwargs={"unique": True})
    display_name: Optional[str] = None
    firebase_uid: str = Field(sa_column_kwargs={"unique": True})
    role: str = Field(default="user")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

class Organization(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    plan: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Agent(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    org_id: uuid.UUID = Field(foreign_key="organization.id")
    name: str
    status: str
    config: Dict = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Lead(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    org_id: uuid.UUID = Field(foreign_key="organization.id")
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_contacted_at: Optional[datetime] = None

class LeadEvent(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lead_id: uuid.UUID = Field(foreign_key="lead.id")
    event_type: str
    payload: Dict = Field(sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Campaign(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    org_id: uuid.UUID = Field(foreign_key="organization.id")
    name: str
    schedule: Optional[str] = None
    status: str

class Score(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lead_id: uuid.UUID = Field(foreign_key="lead.id")
    score_value: float
    reason: Dict = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lead_id: uuid.UUID = Field(foreign_key="lead.id")
    agent_id: Optional[uuid.UUID] = Field(foreign_key="agent.id")
    direction: str
    body: str
    meta: Dict = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    type: str
    payload: Dict = Field(sa_column=Column(JSON))
    status: str
    attempts: int = 0
    run_after: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

