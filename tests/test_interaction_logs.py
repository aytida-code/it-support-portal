from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

import pytest

from tests.utils.factories import (
    interaction_log_model,
    interaction_log_payload,
    ticket_model,
)

pytestmark = pytest.mark.asyncio(loop_scope='session')


async def seed_logs(db_session):
    ticket = ticket_model(1)
    db_session.add(ticket)
    await db_session.flush()
    first = interaction_log_model(ticket.id, 1)
    second = interaction_log_model(ticket.id, 2, channel='Chat')
    db_session.add(first)
    db_session.add(second)
    await db_session.commit()
    return ticket, first, second


async def test_create_interaction_log(client, db_session):
    ticket, _, _ = await seed_logs(db_session)
    response = await client.post('/api/v1/interaction-logs', json=interaction_log_payload(ticket.id, 3))
    assert response.status_code == 201
    data = response.json()
    assert data['ticketId'] == ticket.id
    assert data['transcript'] == 'Transcript 3'


async def test_list_interaction_logs(client, db_session):
    await seed_logs(db_session)
    response = await client.get('/api/v1/interaction-logs')
    assert response.status_code == 200
    assert len(response.json()) == 2


async def test_get_interaction_log(client, db_session):
    _, first, _ = await seed_logs(db_session)
    response = await client.get(f'/api/v1/interaction-logs/{first.id}')
    assert response.status_code == 200
    assert response.json()['id'] == first.id


async def test_update_interaction_log(client, db_session):
    _, first, _ = await seed_logs(db_session)
    response = await client.patch(f'/api/v1/interaction-logs/{first.id}', json={'sentiment': 'Positive'})
    assert response.status_code == 200
    assert response.json()['sentiment'] == 'Positive'


async def test_delete_interaction_log(client, db_session):
    _, first, _ = await seed_logs(db_session)
    response = await client.delete(f'/api/v1/interaction-logs/{first.id}')
    assert response.status_code == 204
    missing = await client.get(f'/api/v1/interaction-logs/{first.id}')
    assert missing.status_code == 404


async def test_list_ticket_interaction_logs(client, db_session):
    ticket, _, _ = await seed_logs(db_session)
    response = await client.get(f'/api/v1/tickets/{ticket.id}/interaction-logs')
    assert response.status_code == 200
    assert len(response.json()) == 2
