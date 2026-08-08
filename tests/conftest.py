from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

import os
from urllib.parse import urlparse

import asyncpg
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.database import Base, get_db
from app.main import app
from app.models import *
from app.models import InteractionLog, Ticket, User

MAIN_DB_URL = os.getenv('DATABASE_URL', '')
_parts = MAIN_DB_URL.rsplit('/', 1)
TEST_DB_URL = (_parts[0] + '/' + _parts[1] + '_test') if len(_parts) == 2 else MAIN_DB_URL


async def _ensure_postgres_database(url: str) -> None:
    parsed = urlparse(url.replace('postgresql+asyncpg://', 'postgresql://'))
    db_name = parsed.path.lstrip('/')
    if not db_name:
        return
    conn = await asyncpg.connect(
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname or 'localhost',
        port=parsed.port or 5432,
        database='postgres',
    )
    exists = await conn.fetchval('SELECT 1 FROM pg_database WHERE datname = $1', db_name)
    if not exists:
        safe_name = '"' + db_name.replace('"', '""') + '"'
        await conn.execute(f'CREATE DATABASE {safe_name}')
    await conn.close()


@pytest.fixture(scope='session')
async def db_engine():
    await _ensure_postgres_database(MAIN_DB_URL)
    await _ensure_postgres_database(TEST_DB_URL)

    main_engine = create_async_engine(MAIN_DB_URL, poolclass=NullPool)
    async with main_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await main_engine.dispose()

    engine = create_async_engine(TEST_DB_URL, poolclass=NullPool)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def db_session(db_engine):
    factory = async_sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as session:
        await session.execute(delete(InteractionLog))
        await session.execute(delete(Ticket))
        await session.execute(delete(User))
        await session.commit()
        yield session


@pytest.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as c:
        yield c
    app.dependency_overrides.clear()
