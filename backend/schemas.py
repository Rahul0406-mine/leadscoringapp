
from pydantic import BaseModel
import uuid
from typing import Optional
from datetime import datetime

# Shared properties
class LeadBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None

# Properties to receive on item creation
class LeadCreate(LeadBase):
    org_id: uuid.UUID
    name: str # Name is required on creation

# Properties to receive on item update
class LeadUpdate(LeadBase):
    pass

# Properties shared by models stored in DB
class LeadInDBBase(LeadBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime
    last_contacted_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Properties to return to client
class LeadRead(LeadInDBBase):
    pass

