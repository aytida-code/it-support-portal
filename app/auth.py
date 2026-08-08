from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Annotated
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models
from app.database import get_db

security = HTTPBearer(auto_error=False)
CredentialsDep = Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
DBSession = Annotated[AsyncSession, Depends(get_db)]


def hash_password(password: str) -> str:
    salt = uuid4().hex
    digest = hashlib.sha256(f'{salt}:{password}'.encode()).hexdigest()
    return f'{salt}:{digest}'


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt, digest = password_hash.split(':', 1)
    except ValueError:
        return False
    expected = hashlib.sha256(f'{salt}:{password}'.encode()).hexdigest()
    return hmac.compare_digest(expected, digest)


def _secret() -> bytes:
    return os.getenv('JWT_SECRET_KEY', '').encode()


def create_access_token(user_id: str) -> str:
    expires = int(time.time()) + int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '1440')) * 60
    payload = {'sub': user_id, 'exp': expires}
    body = base64.urlsafe_b64encode(json.dumps(payload, separators=(',', ':')).encode()).decode().rstrip('=')
    signature = hmac.new(_secret(), body.encode(), hashlib.sha256).hexdigest()
    return f'{body}.{signature}'


def decode_access_token(token: str) -> str:
    try:
        body, signature = token.split('.', 1)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token') from exc
    expected = hmac.new(_secret(), body.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')
    padded = body + '=' * (-len(body) % 4)
    try:
        payload = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
    except (json.JSONDecodeError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token') from exc
    if int(payload.get('exp', 0)) < int(time.time()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Token expired')
    return str(payload.get('sub', ''))


async def get_current_user(
    credentials: CredentialsDep,
    db: DBSession,
) -> models.User:
    if credentials is None or credentials.scheme.lower() != 'bearer':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Not authenticated')
    user_id = decode_access_token(credentials.credentials)
    user = await db.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> models.User | None:
    result = await db.execute(select(models.User).where(models.User.email == email.lower()))
    return result.scalar_one_or_none()
