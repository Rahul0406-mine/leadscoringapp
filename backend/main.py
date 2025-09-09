
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from .database import engine, DATABASE_URL
from .models import Lead, User, Agent, Score
from .auth import get_current_user, initialize_firebase

app = FastAPI()

def get_db():
    with Session(engine) as session:
        yield session

@app.on_event("startup")
def on_startup():
    # In a real app, you would use Alembic to manage migrations
    # For this example, we'''ll create the tables directly
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)
    initialize_firebase()


@app.get("/healthz")
def health_check():
    return {"status": "ok"}

@app.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Example CRUD for Leads
@app.post("/leads/", response_model=Lead)
def create_lead(lead: Lead, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@app.get("/leads/", response_model=List[Lead])
def read_leads(org_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    leads = db.exec(select(Lead).where(Lead.org_id == org_id).offset(skip).limit(limit)).all()
    return leads

@app.get("/leads/{lead_id}", response_model=Lead)
def read_lead(lead_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@app.put("/leads/{lead_id}", response_model=Lead)
def update_lead(lead_id: int, lead_update: Lead, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead_data = lead_update.dict(exclude_unset=True)
    for key, value in lead_data.items():
        setattr(lead, key, value)
    
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


# Example endpoints for Agents and Scores
@app.post("/agents/", response_model=Agent)
def create_agent(agent: Agent, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent

@app.get("/agents/", response_model=List[Agent])
def read_agents(org_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    agents = db.exec(select(Agent).where(Agent.org_id == org_id).offset(skip).limit(limit)).all()
    return agents


@app.post("/scores/", response_model=Score)
def create_score(score: Score, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db.add(score)
    db.commit()
    db.refresh(score)
    return score

