from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from datetime import datetime
from uuid import uuid4

from app import models


def make_id(prefix: str) -> str:
    return f'{prefix}-{uuid4()}'


def parse_dt(value: str | datetime) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def ticket_to_response(ticket: models.Ticket) -> dict:
    return {
        'id': ticket.id,
        'ticketNumber': ticket.ticket_number,
        'title': ticket.title,
        'storeId': ticket.store_id,
        'requester': ticket.requester,
        'channel': ticket.channel,
        'priority': ticket.priority,
        'status': ticket.status,
        'category': ticket.category,
        'assignedTo': ticket.assigned_to,
        'slaDue': ticket.sla_due,
        'createdAt': ticket.created_at,
        'updatedAt': ticket.updated_at,
        'summary': ticket.summary,
        'autoLogged': ticket.auto_logged,
        'escalationReason': ticket.escalation_reason,
    }


def log_to_response(log: models.InteractionLog) -> dict:
    return {
        'id': log.id,
        'ticketId': log.ticket_id,
        'channel': log.channel,
        'customer': log.customer,
        'agent': log.agent,
        'transcript': log.transcript,
        'sentiment': log.sentiment,
        'duration': log.duration,
        'createdAt': log.created_at,
        'autoTags': log.auto_tags,
    }


def next_ticket_number(count: int) -> str:
    return f'IT-{24001 + count}'
