from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from datetime import datetime, timezone
from uuid import uuid4

from app import models
from app.auth import hash_password


def unique_email() -> str:
    return f'user-{uuid4().hex[:8]}@example.com'


def register_payload(email: str | None = None) -> dict:
    return {'email': email or unique_email(), 'password': 'password123', 'name': 'Test Agent'}


def ticket_payload(index: int = 1, **overrides) -> dict:
    data = {
        'title': f'POS issue {index}',
        'storeId': f's{index}',
        'requester': f'Requester {index}',
        'channel': 'Call',
        'priority': 'P2',
        'status': 'New',
        'category': 'POS',
        'assignedTo': 'Maya Patel',
        'slaDue': 'Today 5:00 PM',
        'summary': f'Summary {index}',
        'autoLogged': False,
    }
    data.update(overrides)
    return data


def ticket_model(index: int = 1, **overrides) -> models.Ticket:
    now = datetime.now(timezone.utc)
    data = ticket_payload(index)
    data.update(overrides)
    return models.Ticket(
        id=f'test-ticket-{uuid4().hex[:8]}',
        ticket_number=f'TEST-{uuid4().hex[:8]}',
        title=data['title'],
        store_id=data['storeId'],
        requester=data['requester'],
        channel=data['channel'],
        priority=data['priority'],
        status=data['status'],
        category=data['category'],
        assigned_to=data['assignedTo'],
        sla_due=data['slaDue'],
        created_at=now,
        updated_at=now,
        summary=data['summary'],
        auto_logged=data['autoLogged'],
        escalation_reason=data.get('escalationReason'),
    )


def interaction_log_payload(ticket_id: str, index: int = 1, **overrides) -> dict:
    data = {
        'ticketId': ticket_id,
        'channel': 'Call',
        'customer': f'Customer {index}',
        'agent': 'Maya Patel',
        'transcript': f'Transcript {index}',
        'sentiment': 'Neutral',
        'duration': '05:00',
        'autoTags': ['pos', 'test'],
    }
    data.update(overrides)
    return data


def interaction_log_model(ticket_id: str, index: int = 1, **overrides) -> models.InteractionLog:
    data = interaction_log_payload(ticket_id, index, **overrides)
    return models.InteractionLog(
        id=f'test-log-{uuid4().hex[:8]}',
        ticket_id=data['ticketId'],
        channel=data['channel'],
        customer=data['customer'],
        agent=data['agent'],
        transcript=data['transcript'],
        sentiment=data['sentiment'],
        duration=data['duration'],
        created_at=datetime.now(timezone.utc),
        auto_tags=data['autoTags'],
    )


def user_model(email: str | None = None) -> models.User:
    return models.User(
        id=f'test-user-{uuid4().hex[:8]}',
        email=email or unique_email(),
        name='Test Agent',
        password_hash=hash_password('password123'),
    )
