import { apiClient } from '../api/client'
import { mockInteractionLogs, mockTickets } from './mockData'
import type { InteractionLog, InteractionLogInput, Ticket, TicketInput } from '../types'

const TICKET_KEY = 'subway_it_tickets'
const LOG_KEY = 'subway_it_interaction_logs'

function readStorage<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw) as T[]
  localStorage.setItem(key, JSON.stringify(seed))
  return seed
}

function writeStorage<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value))
}

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function nextTicketNumber(all: Ticket[]) {
  const next = all.length + 24001
  return `IT-${next}`
}

function loadTickets(): Ticket[] {
  return readStorage<Ticket>(TICKET_KEY, mockTickets)
}

function loadLogs(): InteractionLog[] {
  return readStorage<InteractionLog>(LOG_KEY, mockInteractionLogs)
}

function localGetTickets(): Ticket[] {
  return loadTickets().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function localGetTicket(id: string): Ticket | undefined {
  return loadTickets().find((ticket) => ticket.id === id)
}

function localCreateTicket(input: TicketInput): Ticket {
  const all = loadTickets()
  const now = new Date().toISOString()
  const ticket: Ticket = {
    ...input,
    id: makeId('ticket'),
    ticketNumber: nextTicketNumber(all),
    createdAt: now,
    updatedAt: now,
  }
  writeStorage(TICKET_KEY, [ticket, ...all])
  if (ticket.autoLogged && (ticket.channel === 'Call' || ticket.channel === 'Chat')) {
    localCreateInteractionLog({
      ticketId: ticket.id,
      channel: ticket.channel,
      customer: ticket.requester,
      agent: ticket.assignedTo,
      transcript: `Auto log created from ${ticket.channel.toLowerCase()}: ${ticket.summary}`,
      sentiment: ticket.priority === 'P1' ? 'Frustrated' : 'Neutral',
      duration: ticket.channel === 'Call' ? '04:00' : '07:00',
      autoTags: [ticket.category.toLowerCase(), ticket.priority.toLowerCase(), 'auto-logged'],
    })
  }
  return ticket
}

function localUpdateTicket(id: string, input: Partial<TicketInput>): Ticket | undefined {
  const all = loadTickets()
  const updated = all.map((ticket) =>
    ticket.id === id ? { ...ticket, ...input, updatedAt: new Date().toISOString() } : ticket,
  )
  writeStorage(TICKET_KEY, updated)
  return updated.find((ticket) => ticket.id === id)
}

function localDeleteTicket(id: string): boolean {
  const all = loadTickets()
  const next = all.filter((ticket) => ticket.id !== id)
  writeStorage(TICKET_KEY, next)
  return next.length !== all.length
}

function localGetInteractionLogs(): InteractionLog[] {
  return loadLogs().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function localGetInteractionLogsByTicket(ticketId: string): InteractionLog[] {
  return localGetInteractionLogs().filter((log) => log.ticketId === ticketId)
}

function localCreateInteractionLog(input: InteractionLogInput): InteractionLog {
  const all = loadLogs()
  const log: InteractionLog = {
    ...input,
    id: makeId('log'),
    createdAt: new Date().toISOString(),
  }
  writeStorage(LOG_KEY, [log, ...all])
  return log
}

// TODO(USE_MOCK): verify path + response shape against the real backend's OpenAPI schema before flipping this to false.
export const USE_MOCK_TICKETS = true

export async function getTickets(): Promise<Ticket[]> {
  if (USE_MOCK_TICKETS) return localGetTickets()
  const res = await apiClient.get('/api/v1/tickets')
  return res.data
}

export async function getTicket(id: string): Promise<Ticket | undefined> {
  if (USE_MOCK_TICKETS) return localGetTicket(id)
  const res = await apiClient.get(`/api/v1/tickets/${id}`)
  return res.data
}

export async function createTicket(input: TicketInput): Promise<Ticket> {
  if (USE_MOCK_TICKETS) return localCreateTicket(input)
  const res = await apiClient.post('/api/v1/tickets', input)
  return res.data
}

export async function updateTicket(id: string, input: Partial<TicketInput>): Promise<Ticket | undefined> {
  if (USE_MOCK_TICKETS) return localUpdateTicket(id, input)
  const res = await apiClient.patch(`/api/v1/tickets/${id}`, input)
  return res.data
}

export async function deleteTicket(id: string): Promise<boolean> {
  if (USE_MOCK_TICKETS) return localDeleteTicket(id)
  await apiClient.delete(`/api/v1/tickets/${id}`)
  return true
}

// TODO(USE_MOCK): verify path + response shape against the real backend's OpenAPI schema before flipping this to false.
export const USE_MOCK_LOGS = true

export async function getInteractionLogs(): Promise<InteractionLog[]> {
  if (USE_MOCK_LOGS) return localGetInteractionLogs()
  const res = await apiClient.get('/api/v1/interaction-logs')
  return res.data
}

export async function getInteractionLogsByTicket(ticketId: string): Promise<InteractionLog[]> {
  if (USE_MOCK_LOGS) return localGetInteractionLogsByTicket(ticketId)
  const res = await apiClient.get(`/api/v1/tickets/${ticketId}/interaction-logs`)
  return res.data
}

export async function createInteractionLog(input: InteractionLogInput): Promise<InteractionLog> {
  if (USE_MOCK_LOGS) return localCreateInteractionLog(input)
  const res = await apiClient.post('/api/v1/interaction-logs', input)
  return res.data
}
