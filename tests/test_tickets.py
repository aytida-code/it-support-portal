from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

import pytest

from tests.utils.factories import ticket_model, ticket_payload

pytestmark = pytest.mark.asyncio(loop_scope='session')


async def seed_tickets(db_session):
    first = ticket_model(1)
    second = ticket_model(2, priority='P1', status='Escalated')
    db_session.add(first)
    db_session.add(second)
    await db_session.commit()
    return first, second


async def test_create_ticket(client, db_session):
    await seed_tickets(db_session)
    response = await client.post('/api/v1/tickets', json=ticket_payload(3, title='New store issue'))
    assert response.status_code == 201
    data = response.json()
    assert data['title'] == 'New store issue'
    assert data['ticketNumber'].startswith('IT-')


async def test_list_tickets(client, db_session):
    await seed_tickets(db_session)
    response = await client.get('/api/v1/tickets')
    assert response.status_code == 200
    assert len(response.json()) == 2


async def test_get_ticket(client, db_session):
    first, _ = await seed_tickets(db_session)
    response = await client.get(f'/api/v1/tickets/{first.id}')
    assert response.status_code == 200
    assert response.json()['id'] == first.id


async def test_update_ticket(client, db_session):
    first, _ = await seed_tickets(db_session)
    response = await client.patch(f'/api/v1/tickets/{first.id}', json={'status': 'Resolved', 'priority': 'P3'})
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'Resolved'
    assert data['priority'] == 'P3'


async def test_delete_ticket(client, db_session):
    first, _ = await seed_tickets(db_session)
    response = await client.delete(f'/api/v1/tickets/{first.id}')
    assert response.status_code == 204
    missing = await client.get(f'/api/v1/tickets/{first.id}')
    assert missing.status_code == 404
