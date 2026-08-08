export type Priority = 'P1' | 'P2' | 'P3' | 'P4'
export type TicketStatus = 'New' | 'Triaging' | 'Escalated' | 'Waiting Vendor' | 'Resolved'
export type Channel = 'Call' | 'Chat' | 'Walk-up' | 'System'
export type DeviceStatus = 'Online' | 'Warning' | 'Offline'

export interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  status: 'Available' | 'On call' | 'After-call work' | 'Offline'
  queue: number
}

export interface StoreLocation {
  id: string
  storeNumber: string
  city: string
  state: string
  franchisee: string
  timezone: string
  health: 'Healthy' | 'Degraded' | 'Critical'
  openIncidents: number
}

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  storeId: string
  requester: string
  channel: Channel
  priority: Priority
  status: TicketStatus
  category: string
  assignedTo: string
  slaDue: string
  createdAt: string
  updatedAt: string
  summary: string
  autoLogged: boolean
  escalationReason?: string
}

export interface TicketInput {
  title: string
  storeId: string
  requester: string
  channel: Channel
  priority: Priority
  status: TicketStatus
  category: string
  assignedTo: string
  slaDue: string
  summary: string
  autoLogged: boolean
  escalationReason?: string
}

export interface InteractionLog {
  id: string
  ticketId: string
  channel: 'Call' | 'Chat'
  customer: string
  agent: string
  transcript: string
  sentiment: 'Positive' | 'Neutral' | 'Frustrated'
  duration: string
  createdAt: string
  autoTags: string[]
}

export interface InteractionLogInput {
  ticketId: string
  channel: 'Call' | 'Chat'
  customer: string
  agent: string
  transcript: string
  sentiment: 'Positive' | 'Neutral' | 'Frustrated'
  duration: string
  autoTags: string[]
}

export interface EscalationRule {
  id: string
  trigger: string
  priority: Priority
  team: string
  notify: string
  responseTarget: string
  enabled: boolean
}

export interface Device {
  id: string
  storeId: string
  name: string
  type: string
  status: DeviceStatus
  lastSeen: string
  issue?: string
}
