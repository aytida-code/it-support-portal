import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowUpRight, Clock, ShieldAlert } from 'lucide-react'
import { PriorityBadge } from '../components/PriorityBadge'
import { StatusPill } from '../components/StatusPill'
import { escalationRules, storeLocations } from '../data/mockData'
import { getTickets } from '../data/store'
import type { Ticket } from '../types'

export function Escalations() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    void getTickets().then(setTickets)
  }, [])

  const escalated = tickets.filter((ticket) => ticket.status === 'Escalated' || ticket.priority === 'P1')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Escalation center</p>
        <h2 className="mt-1 text-3xl font-black text-ink">Priority routing</h2>
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        {escalationRules.map((rule) => (
          <div key={rule.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <PriorityBadge priority={rule.priority} />
            </div>
            <p className="mt-4 font-black text-ink">{rule.team}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{rule.trigger}</p>
            <div className="mt-4 rounded-2xl bg-surfaceAlt p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Notify</p>
              <p className="mt-1 text-sm font-bold text-ink">{rule.notify}</p>
              <p className="mt-2 flex items-center gap-1 text-sm font-bold text-primary"><Clock className="h-4 w-4" /> {rule.responseTarget}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="section-title">Active escalations</h3>
            <p className="mt-1 text-sm text-muted">P1 and escalated tickets requiring command center follow-up.</p>
          </div>
          <button type="button" onClick={() => navigate('/tickets/new')} className="btn-primary">Escalate new</button>
        </div>
        <div className="divide-y divide-border">
          {escalated.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">No active escalations.</div>
          ) : (
            escalated.map((ticket) => {
              const store = storeLocations.find((item) => item.id === ticket.storeId)
              return (
                <button key={ticket.id} type="button" onClick={() => navigate(`/tickets/${ticket.id}`)} className="grid w-full gap-4 p-5 text-left transition hover:bg-surfaceAlt lg:grid-cols-[1fr_180px_140px_120px] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-danger" />
                      <PriorityBadge priority={ticket.priority} />
                      <span className="text-xs font-bold text-muted">{ticket.ticketNumber}</span>
                    </div>
                    <p className="mt-2 font-black text-ink">{ticket.title}</p>
                    <p className="mt-1 text-sm text-muted">{ticket.escalationReason ?? 'Escalation reason pending command center review'}</p>
                  </div>
                  <p className="text-sm font-bold text-ink">{store?.storeNumber} · {store?.city}</p>
                  <StatusPill status={ticket.status} />
                  <span className="inline-flex items-center gap-1 text-sm font-black text-primary">Open <ArrowUpRight className="h-4 w-4" /></span>
                </button>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
