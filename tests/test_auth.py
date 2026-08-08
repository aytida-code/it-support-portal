from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

import pytest

from tests.utils.factories import register_payload

pytestmark = pytest.mark.asyncio(loop_scope='session')


async def test_register_returns_created_user(client):
    payload = register_payload()
    response = await client.post('/api/v1/auth/register', json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data['email'] == payload['email']
    assert data['name'] == payload['name']
    assert 'password' not in data


async def test_login_returns_token(client):
    payload = register_payload()
    await client.post('/api/v1/auth/register', json=payload)
    response = await client.post('/api/v1/auth/login', json={'email': payload['email'], 'password': payload['password']})
    assert response.status_code == 200
    assert response.json()['access_token']
    assert response.json()['token_type'] == 'bearer'


async def test_me_returns_current_user(client):
    payload = register_payload()
    await client.post('/api/v1/auth/register', json=payload)
    login = await client.post('/api/v1/auth/login', json={'email': payload['email'], 'password': payload['password']})
    token = login.json()['access_token']
    response = await client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert response.json()['email'] == payload['email']


async def test_me_rejects_invalid_token(client):
    response = await client.get('/api/v1/auth/me', headers={'Authorization': 'Bearer invalid-token'})
    assert response.status_code == 401
