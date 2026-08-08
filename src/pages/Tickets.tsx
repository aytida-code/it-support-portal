import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { PriorityBadge } from '../components/PriorityBadge'
import { StatusPill } from '../components/StatusPill'
import { storeLocations } from '../data/mockData'
import { getTickets } from '../data/store'
import type { Priority, Ticket } from '../types'

const priorities: Array<Priority | 'All'> = ['All', 'P1', 'P2', 'P3', 'P4']

export function Tickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<Priority | 'All'>('All')

  useEffect(() => {
    void getTickets().then(setTickets)
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return tickets.filter((ticket) => {
      const store = storeLocations.find((item) => item.id === ticket.storeId)
      const matchesQuery = !needle || [ticket.title, ticket.ticketNumber, ticket.requester, ticket.category, store?.storeNumber, store?.city].join(' ').toLowerCase().includes(needle)
      const matchesPriority = priority === 'All' || ticket.priority === priority
      return matchesQuery && matchesPriority
    })
  }, [priority, query, tickets])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Ticket queue</p>
          <h2 className="mt-1 text-3xl font-black text-ink">All incidents</h2>
        </div>
        <button type="button" onClick={() => navigate('/tickets/new')} className="btn-primary">
          <Plus className="h-4 w-4" /> New ticket
        </button>
      </div>

      <div className="card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surfaceAlt px-4 py-3">
            <Search className="h-5 w-5 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search by ticket, store, requester, category..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {priorities.map((item) => (
              <button key={item} type="button" onClick={() => setPriority(item)} className={`rounded-xl px-4 py-3 text-sm font-bold transition ${priority === item ? 'bg-primary text-white' : 'bg-surfaceAlt text-muted hover:text-primary'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[110px_1fr_150px_130px_130px_130px] gap-4 border-b border-border bg-surfaceAlt px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-muted lg:grid">
          <span>Priority</span>
          <span>Issue</span>
          <span>Store</span>
          <span>Status</span>
          <span>Channel</span>
          <span>SLA</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-bold text-ink">No tickets yet — create one.</p>
              <button type="button" onClick={() => navigate('/tickets/new')} className="btn-primary mt-4">Create ticket</button>
            </div>
          ) : (
            filtered.map((ticket) => {
              const store = storeLocations.find((item) => item.id === ticket.storeId)
              return (
                <button key={ticket.id} type="button" onClick={() => navigate(`/tickets/${ticket.id}`)} className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-surfaceAlt lg:grid-cols-[110px_1fr_150px_130px_130px_130px] lg:items-center">
                  <PriorityBadge priority={ticket.priority} />
                  <div>
                    <p className="text-sm font-black text-ink">{ticket.title}</p>
                    <p className="mt-1 text-xs text-muted">{ticket.ticketNumber} · {ticket.requester} · {ticket.category}</p>
                  </div>
                  <p className="text-sm font-bold text-ink">{store?.storeNumber}</p>
                  <StatusPill status={ticket.status} />
                  <span className="text-sm text-muted">{ticket.channel}</span>
                  <span className="text-sm font-bold text-ink">{ticket.slaDue}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
