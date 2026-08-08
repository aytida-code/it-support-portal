from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.crud_utils import log_to_response, make_id
from app.database import get_db

router = APIRouter(prefix='/api/v1/interaction-logs', tags=['interaction logs'])
DBSession = Annotated[AsyncSession, Depends(get_db)]


@router.get('', response_model=list[schemas.InteractionLogResponse])
async def list_interaction_logs(db: DBSession):
    result = await db.execute(select(models.InteractionLog).order_by(desc(models.InteractionLog.created_at)))
    return [log_to_response(log) for log in result.scalars().all()]


@router.get('/{log_id}', response_model=schemas.InteractionLogResponse)
async def get_interaction_log(log_id: str, db: DBSession):
    log = await db.get(models.InteractionLog, log_id)
    if log is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Interaction log not found')
    return log_to_response(log)


@router.post('', response_model=schemas.InteractionLogResponse, status_code=status.HTTP_201_CREATED)
async def create_interaction_log(payload: schemas.InteractionLogCreate, db: DBSession):
    if await db.get(models.Ticket, payload.ticketId) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    log = models.InteractionLog(
        id=make_id('log'),
        ticket_id=payload.ticketId,
        channel=payload.channel,
        customer=payload.customer,
        agent=payload.agent,
        transcript=payload.transcript,
        sentiment=payload.sentiment,
        duration=payload.duration,
        auto_tags=payload.autoTags,
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log_to_response(log)


@router.patch('/{log_id}', response_model=schemas.InteractionLogResponse)
async def update_interaction_log(
    log_id: str, payload: schemas.InteractionLogUpdate, db: DBSession
):
    log = await db.get(models.InteractionLog, log_id)
    if log is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Interaction log not found')
    data = payload.model_dump(exclude_unset=True)
    if 'ticketId' in data:
        if await db.get(models.Ticket, data['ticketId']) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
        log.ticket_id = data.pop('ticketId')
    if 'autoTags' in data:
        log.auto_tags = data.pop('autoTags')
    for key, value in data.items():
        setattr(log, key, value)
    await db.commit()
    await db.refresh(log)
    return log_to_response(log)


@router.delete('/{log_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_interaction_log(log_id: str, db: DBSession):
    log = await db.get(models.InteractionLog, log_id)
    if log is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Interaction log not found')
    await db.delete(log)
    await db.commit()
