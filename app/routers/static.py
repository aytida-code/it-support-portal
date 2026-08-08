from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from fastapi import APIRouter

from app import schemas
from app.static_data import AGENTS, DEVICES, ESCALATION_RULES, STORE_LOCATIONS

router = APIRouter(prefix='/api/v1', tags=['reference data'])


@router.get('/agents', response_model=list[schemas.AgentResponse])
async def list_agents():
    return AGENTS


@router.get('/stores', response_model=list[schemas.StoreLocationResponse])
async def list_stores():
    return STORE_LOCATIONS


@router.get('/escalation-rules', response_model=list[schemas.EscalationRuleResponse])
async def list_escalation_rules():
    return ESCALATION_RULES


@router.get('/devices', response_model=list[schemas.DeviceResponse])
async def list_devices():
    return DEVICES
