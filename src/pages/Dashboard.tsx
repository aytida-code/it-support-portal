import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Clock, Headphones, MessageSquareText, ShieldAlert, Ticket as TicketIcon } from 'lucide-react'
import { PriorityBadge } from '../components/PriorityBadge'
import { StatCard } from '../components/StatCard'
import { StatusPill } from '../components/StatusPill'
import { agents, devices, escalationRules, storeLocations } from '../data/mockData'
import { getInteractionLogs, getTickets } from '../data/store'
import type { InteractionLog, Ticket } from '../types'

export function Dashboard() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [logs, setLogs] = useState<InteractionLog[]>([])

  useEffect(() => {
    void getTickets().then(setTickets)
    void getInteractionLogs().then(setLogs)
  }, [])

  const stats = useMemo(() => {
    const escalated = tickets.filter((ticket) => ticket.status === 'Escalated').length
    const p1 = tickets.filter((ticket) => ticket.priority === 'P1').length
    const autoLogged = tickets.filter((ticket) => ticket.autoLogged).length
    return { escalated, p1, autoLogged }
  }, [tickets])

  const queue = tickets.filter((ticket) => ticket.status !== 'Resolved').slice(0, 5)
  const offlineDevices = devices.filter((device) => device.status !== 'Online')

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-sidebar text-white shadow-card">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primaryDark">
              <Headphones className="h-4 w-4" /> Live support shift
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">Priority escalation and call/chat logging for Subway stores.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">AI-assisted triage watches every inbound interaction, creates audit-ready logs, and routes P1 issues to POS, safety, or network teams before SLAs breach.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate('/tickets/new')} className="btn-primary bg-accent text-primaryDark hover:bg-accentDark">
                Create incident
              </button>
              <button type="button" onClick={() => navigate('/logs')} className="btn-secondary border-white/20 bg-white/10 text-white hover:border-accent hover:text-accent">
                Review auto logs
              </button>
            </div>
          </div>
          <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
            <p className="text-sm font-bold text-accent">Escalation monitor</p>
            <div className="mt-4 space-y-3">
              {escalationRules.slice(0, 3).map((rule) => (
                <button key={rule.id} type="button" onClick={() => navigate('/escalations')} className="w-full rounded-2xl bg-white/10 p-3 text-left transition hover:bg-white/15">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{rule.team}</span>
                    <PriorityBadge priority={rule.priority} />
                  </div>
                  <p className="mt-1 text-xs text-white/62">Target: {rule.responseTarget}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open tickets" value={tickets.filter((ticket) => ticket.status !== 'Resolved').length.toString()} helper="Across all franchise stores" tone="primary" icon={TicketIcon} />
        <StatCard label="P1 incidents" value={stats.p1.toString()} helper="Immediate escalation required" tone="danger" icon={AlertTriangle} />
        <StatCard label="Auto logged" value={stats.autoLogged.toString()} helper="Calls/chats captured today" tone="info" icon={MessageSquareText} />
        <StatCard label="Escalated" value={stats.escalated.toString()} helper="Command center handoffs" tone="warning" icon={ShieldAlert} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="section-title">Priority queue</h2>
            <button type="button" onClick={() => navigate('/tickets')} className="text-sm font-bold text-primary hover:text-primaryDark">View all</button>
          </div>
          <div className="divide-y divide-border">
            {queue.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">No tickets yet — create one.</div>
            ) : (
              queue.map((ticket) => {
                const store = storeLocations.find((item) => item.id === ticket.storeId)
                return (
                  <button key={ticket.id} type="button" onClick={() => navigate(`/tickets/${ticket.id}`)} className="grid w-full gap-3 p-5 text-left transition hover:bg-surfaceAlt md:grid-cols-[1fr_120px_130px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={ticket.priority} />
                        <span className="text-xs font-bold text-muted">{ticket.ticketNumber}</span>
                      </div>
                      <p className="mt-2 font-bold text-ink">{ticket.title}</p>
                      <p className="mt-1 text-sm text-muted">{store?.storeNumber} · {store?.city}, {store?.state}</p>
                    </div>
                    <StatusPill status={ticket.status} />
                    <p className="text-sm font-bold text-ink">{ticket.slaDue}</p>
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="section-title">Agent availability</h2>
            <div className="mt-4 space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between gap-3 rounded-2xl bg-surfaceAlt p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">{agent.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-ink">{agent.name}</p>
                      <p className="text-xs text-muted">{agent.role}</p>
                    </div>
                  </div>
                  <StatusPill status={agent.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Device alerts</h2>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="mt-4 space-y-3">
              {offlineDevices.map((device) => (
                <button key={device.id} type="button" onClick={() => navigate('/stores')} className="w-full rounded-2xl border border-border p-3 text-left transition hover:border-primary">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-ink">{device.name}</p>
                    <StatusPill status={device.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted"><Clock className="h-3 w-3" /> {device.lastSeen} · {device.issue}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Recent auto logs</h2>
          <button type="button" onClick={() => navigate('/logs')} className="text-sm font-bold text-primary hover:text-primaryDark">Open logs</button>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {logs.slice(0, 4).map((log) => (
            <button key={log.id} type="button" onClick={() => navigate(`/tickets/${log.ticketId}`)} className="rounded-2xl border border-border p-4 text-left transition hover:border-primary hover:bg-surfaceAlt">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-ink">{log.channel} · {log.customer}</p>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{log.duration}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{log.transcript}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
