from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app import models
from app.crud_utils import parse_dt
from app.database import Base, engine
from app.routers import auth, interaction_logs, static, tickets
from app.static_data import INTERACTION_LOGS, TICKETS


async def seed_database() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    from app.database import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        existing = await db.scalar(select(models.Ticket.id).limit(1))
        if existing:
            return
        for item in TICKETS:
            db.add(
                models.Ticket(
                    id=item['id'],
                    ticket_number=item['ticketNumber'],
                    title=item['title'],
                    store_id=item['storeId'],
                    requester=item['requester'],
                    channel=item['channel'],
                    priority=item['priority'],
                    status=item['status'],
                    category=item['category'],
                    assigned_to=item['assignedTo'],
                    sla_due=item['slaDue'],
                    created_at=parse_dt(item['createdAt']),
                    updated_at=parse_dt(item['updatedAt']),
                    summary=item['summary'],
                    auto_logged=item['autoLogged'],
                    escalation_reason=item.get('escalationReason'),
                )
            )
        await db.flush()
        for item in INTERACTION_LOGS:
            db.add(
                models.InteractionLog(
                    id=item['id'],
                    ticket_id=item['ticketId'],
                    channel=item['channel'],
                    customer=item['customer'],
                    agent=item['agent'],
                    transcript=item['transcript'],
                    sentiment=item['sentiment'],
                    duration=item['duration'],
                    created_at=parse_dt(item['createdAt']),
                    auto_tags=item['autoTags'],
                )
            )
        await db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_database()
    yield


app = FastAPI(title='IT Support API', version='1.0.0', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(interaction_logs.router)
app.include_router(static.router)


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.get('/')
async def root():
    return {'name': 'IT Support API', 'status': 'ok'}
