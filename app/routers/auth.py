from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.auth import (
    create_access_token,
    get_current_user,
    get_user_by_email,
    hash_password,
    verify_password,
)
from app.database import get_db

router = APIRouter(prefix='/api/v1/auth', tags=['auth'])
DBSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[models.User, Depends(get_current_user)]


@router.post('/register', response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: schemas.RegisterRequest, db: DBSession):
    if await get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email already registered')
    user = models.User(
        id=f'user-{uuid4()}',
        email=payload.email.lower(),
        name=payload.name,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email already registered') from exc
    await db.refresh(user)
    return user


@router.post('/login', response_model=schemas.TokenResponse)
async def login(payload: schemas.LoginRequest, db: DBSession):
    user = await get_user_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')
    return {'access_token': create_access_token(user.id), 'token_type': 'bearer'}


@router.get('/me', response_model=schemas.UserResponse)
async def me(current_user: CurrentUser):
    return current_user
