
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
import uuid

from .database import engine
from .models import Lead, User, Agent, Score
from .schemas import LeadCreate, LeadRead, LeadUpdate
from .auth import get_current_user, initialize_firebase

app = FastAPI()

def get_db():
    with Session(engine) as session:
        yield session

@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)
    initialize_firebase()


@app.get("/healthz")
def health_check():
    return {"status": "ok"}

@app.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Refactored CRUD for Leads with Pydantic schemas
@app.post("/leads/", response_model=LeadRead)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # In a real app, you would get the org_id from the current_user
    db_lead = Lead.from_orm(lead)
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@app.get("/leads/", response_model=List[LeadRead])
def read_leads(org_id: uuid.UUID, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # In a real app, you would get the org_id from the current_user
    # and filter by it for security.
    leads = db.exec(select(Lead).where(Lead.org_id == org_id).offset(skip).limit(limit)).all()
    return leads

@app.get("/leads/{lead_id}", response_model=LeadRead)
def read_lead(lead_id: uuid.UUID, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    # In a real app, also check if lead.org_id matches user's org_id
    return lead

@app.put("/leads/{lead_id}", response_model=LeadRead)
def update_lead(lead_id: uuid.UUID, lead_update: LeadUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    # In a real app, also check if lead.org_id matches user's org_id
    
    lead_data = lead_update.dict(exclude_unset=True)
    for key, value in lead_data.items():
        setattr(lead, key, value)
    
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

# ... (rest of the file remains the same) ...
