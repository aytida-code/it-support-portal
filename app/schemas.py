from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

Priority = Literal['P1', 'P2', 'P3', 'P4']
TicketStatus = Literal['New', 'Triaging', 'Escalated', 'Waiting Vendor', 'Resolved']
Channel = Literal['Call', 'Chat', 'Walk-up', 'System']
LogChannel = Literal['Call', 'Chat']
Sentiment = Literal['Positive', 'Neutral', 'Frustrated']


class CamelModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=None)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str


class TicketBase(BaseModel):
    title: str
    storeId: str
    requester: str
    channel: Channel
    priority: Priority
    status: TicketStatus
    category: str
    assignedTo: str
    slaDue: str
    summary: str
    autoLogged: bool
    escalationReason: str | None = None


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    title: str | None = None
    storeId: str | None = None
    requester: str | None = None
    channel: Channel | None = None
    priority: Priority | None = None
    status: TicketStatus | None = None
    category: str | None = None
    assignedTo: str | None = None
    slaDue: str | None = None
    summary: str | None = None
    autoLogged: bool | None = None
    escalationReason: str | None = None


class TicketResponse(TicketBase):
    id: str
    ticketNumber: str
    createdAt: datetime
    updatedAt: datetime


class InteractionLogBase(BaseModel):
    ticketId: str
    channel: LogChannel
    customer: str
    agent: str
    transcript: str
    sentiment: Sentiment
    duration: str
    autoTags: list[str]


class InteractionLogCreate(InteractionLogBase):
    pass


class InteractionLogUpdate(BaseModel):
    ticketId: str | None = None
    channel: LogChannel | None = None
    customer: str | None = None
    agent: str | None = None
    transcript: str | None = None
    sentiment: Sentiment | None = None
    duration: str | None = None
    autoTags: list[str] | None = None


class InteractionLogResponse(InteractionLogBase):
    id: str
    createdAt: datetime


class AgentResponse(BaseModel):
    id: str
    name: str
    role: str
    avatar: str
    status: Literal['Available', 'On call', 'After-call work', 'Offline']
    queue: int


class StoreLocationResponse(BaseModel):
    id: str
    storeNumber: str
    city: str
    state: str
    franchisee: str
    timezone: str
    health: Literal['Healthy', 'Degraded', 'Critical']
    openIncidents: int


class EscalationRuleResponse(BaseModel):
    id: str
    trigger: str
    priority: Priority
    team: str
    notify: str
    responseTarget: str
    enabled: bool


class DeviceResponse(BaseModel):
    id: str
    storeId: str
    name: str
    type: str
    status: Literal['Online', 'Warning', 'Offline']
    lastSeen: str
    issue: str | None = None
