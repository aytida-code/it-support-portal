from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.crud_utils import (
    log_to_response,
    make_id,
    next_ticket_number,
    ticket_to_response,
)
from app.database import get_db

router = APIRouter(prefix='/api/v1', tags=['tickets'])
DBSession = Annotated[AsyncSession, Depends(get_db)]


def _apply_ticket_input(ticket: models.Ticket, data: dict) -> None:
    mapping = {
        'storeId': 'store_id',
        'assignedTo': 'assigned_to',
        'slaDue': 'sla_due',
        'autoLogged': 'auto_logged',
        'escalationReason': 'escalation_reason',
    }
    for key, value in data.items():
        setattr(ticket, mapping.get(key, key), value)


@router.get('/tickets', response_model=list[schemas.TicketResponse])
async def list_tickets(db: DBSession):
    result = await db.execute(select(models.Ticket).order_by(desc(models.Ticket.created_at)))
    return [ticket_to_response(ticket) for ticket in result.scalars().all()]


@router.get('/tickets/{ticket_id}', response_model=schemas.TicketResponse)
async def get_ticket(ticket_id: str, db: DBSession):
    ticket = await db.get(models.Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    return ticket_to_response(ticket)


@router.post('/tickets', response_model=schemas.TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(payload: schemas.TicketCreate, db: DBSession):
    count = await db.scalar(select(func.count()).select_from(models.Ticket))
    ticket = models.Ticket(
        id=make_id('ticket'),
        ticket_number=next_ticket_number(int(count or 0)),
        title=payload.title,
        store_id=payload.storeId,
        requester=payload.requester,
        channel=payload.channel,
        priority=payload.priority,
        status=payload.status,
        category=payload.category,
        assigned_to=payload.assignedTo,
        sla_due=payload.slaDue,
        summary=payload.summary,
        auto_logged=payload.autoLogged,
        escalation_reason=payload.escalationReason,
    )
    db.add(ticket)
    await db.flush()
    if ticket.auto_logged and ticket.channel in {'Call', 'Chat'}:
        db.add(
            models.InteractionLog(
                id=make_id('log'),
                ticket_id=ticket.id,
                channel=ticket.channel,
                customer=ticket.requester,
                agent=ticket.assigned_to,
                transcript=f'Auto log created from {ticket.channel.lower()}: {ticket.summary}',
                sentiment='Frustrated' if ticket.priority == 'P1' else 'Neutral',
                duration='04:00' if ticket.channel == 'Call' else '07:00',
                auto_tags=[ticket.category.lower(), ticket.priority.lower(), 'auto-logged'],
            )
        )
    await db.commit()
    await db.refresh(ticket)
    return ticket_to_response(ticket)


@router.patch('/tickets/{ticket_id}', response_model=schemas.TicketResponse)
async def update_ticket(ticket_id: str, payload: schemas.TicketUpdate, db: DBSession):
    ticket = await db.get(models.Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    _apply_ticket_input(ticket, payload.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(ticket)
    return ticket_to_response(ticket)


@router.delete('/tickets/{ticket_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(ticket_id: str, db: DBSession):
    ticket = await db.get(models.Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    await db.delete(ticket)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/tickets/{ticket_id}/interaction-logs', response_model=list[schemas.InteractionLogResponse])
async def list_ticket_interaction_logs(ticket_id: str, db: DBSession):
    if await db.get(models.Ticket, ticket_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    result = await db.execute(
        select(models.InteractionLog)
        .where(models.InteractionLog.ticket_id == ticket_id)
        .order_by(desc(models.InteractionLog.created_at))
    )
    return [log_to_response(log) for log in result.scalars().all()]
