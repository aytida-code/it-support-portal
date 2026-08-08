import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, MessageSquarePlus, ShieldAlert, Trash2 } from 'lucide-react'
import { PriorityBadge } from '../components/PriorityBadge'
import { StatusPill } from '../components/StatusPill'
import { agents, storeLocations } from '../data/mockData'
import { createInteractionLog, deleteTicket, getInteractionLogsByTicket, getTicket, updateTicket } from '../data/store'
import type { InteractionLog, Ticket } from '../types'

export function TicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [logs, setLogs] = useState<InteractionLog[]>([])
  const [note, setNote] = useState('')
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    if (!ticketId) return
    void getTicket(ticketId).then((item) => setTicket(item ?? null))
    void getInteractionLogsByTicket(ticketId).then(setLogs)
  }, [ticketId])

  if (!ticketId || !ticket) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-black text-ink">Ticket not found</p>
        <button type="button" onClick={() => navigate('/tickets')} className="btn-primary mt-4">Back to tickets</button>
      </div>
    )
  }

  const currentTicket = ticket
  const store = storeLocations.find((item) => item.id === currentTicket.storeId)
  const isNoteValid = note.trim().length >= 8

  async function handleResolve() {
    const updated = await updateTicket(currentTicket.id, { status: 'Resolved' })
    if (updated) setTicket(updated)
  }

  async function handleEscalate() {
    const updated = await updateTicket(currentTicket.id, { status: 'Escalated', priority: currentTicket.priority === 'P1' ? 'P1' : 'P2', escalationReason: 'Manual agent escalation from ticket detail' })
    if (updated) setTicket(updated)
  }

  async function handleDelete() {
    await deleteTicket(currentTicket.id)
    navigate('/tickets')
  }

  async function handleAddLog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    if (!isNoteValid) return
    const log = await createInteractionLog({
      ticketId: currentTicket.id,
      channel: currentTicket.channel === 'Chat' ? 'Chat' : 'Call',
      customer: currentTicket.requester,
      agent: currentTicket.assignedTo,
      transcript: note.trim(),
      sentiment: currentTicket.priority === 'P1' ? 'Frustrated' : 'Neutral',
      duration: '03:15',
      autoTags: [currentTicket.category.toLowerCase(), 'agent-note'],
    })
    setLogs((current) => [log, ...current])
    setNote('')
    setAttempted(false)
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="card p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={currentTicket.priority} />
                <StatusPill status={currentTicket.status} />
                <span className="text-sm font-bold text-muted">{currentTicket.ticketNumber}</span>
              </div>
              <h2 className="mt-3 text-3xl font-black text-ink">{currentTicket.title}</h2>
              <p className="mt-2 text-sm text-muted">{store?.storeNumber} · {store?.city}, {store?.state} · {currentTicket.requester}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleEscalate} className="btn-secondary"><ShieldAlert className="h-4 w-4" /> Escalate</button>
              <button type="button" onClick={handleResolve} className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Resolve</button>
            </div>
          </div>

          <div className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Category" value={currentTicket.category} />
            <Info label="Assigned" value={currentTicket.assignedTo} />
            <Info label="Channel" value={currentTicket.channel} />
            <Info label="SLA due" value={currentTicket.slaDue} />
          </div>

          <div className="rounded-2xl bg-surfaceAlt p-5">
            <p className="text-sm font-black text-ink">Agent summary</p>
            <p className="mt-2 text-sm leading-6 text-muted">{currentTicket.summary}</p>
            {currentTicket.escalationReason && <p className="mt-3 rounded-xl bg-danger/10 p-3 text-sm font-semibold text-danger">Escalation reason: {currentTicket.escalationReason}</p>}
          </div>

          <form onSubmit={handleAddLog} className="mt-6 rounded-2xl border border-border p-5">
            <label htmlFor="note" className="field-label">Add call/chat note</label>
            <textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} className="input-control mt-2 min-h-28" placeholder="Document troubleshooting steps, customer sentiment, or escalation handoff..." />
            {attempted && !isNoteValid && <p className="mt-2 text-sm font-semibold text-danger">Note must be at least 8 characters.</p>}
            <button type="submit" disabled={!isNoteValid} className="btn-primary mt-4"><MessageSquarePlus className="h-4 w-4" /> Add log</button>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="section-title">Store context</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Info label="Store" value={store?.storeNumber ?? 'Unknown'} />
              <Info label="Franchisee" value={store?.franchisee ?? 'Unknown'} />
              <Info label="Timezone" value={store?.timezone ?? 'Unknown'} />
              {store && <StatusPill status={store.health} />}
            </div>
            <button type="button" onClick={() => navigate('/stores')} className="btn-secondary mt-5 w-full">Open stores</button>
          </div>

          <div className="card p-5">
            <h3 className="section-title">Assignable agents</h3>
            <div className="mt-4 space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between rounded-2xl bg-surfaceAlt p-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{agent.name}</p>
                    <p className="text-xs text-muted">{agent.role}</p>
                  </div>
                  <StatusPill status={agent.status} />
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={handleDelete} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-bold text-white transition hover:bg-danger/90">
            <Trash2 className="h-4 w-4" /> Delete ticket
          </button>
        </aside>
      </div>

      <section className="card p-5">
        <h2 className="section-title">Auto logging timeline</h2>
        <div className="mt-4 space-y-3">
          {logs.length === 0 ? (
            <p className="rounded-2xl bg-surfaceAlt p-5 text-sm text-muted">No logs yet — create one from this ticket.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-ink">{log.channel} with {log.customer}</p>
                  <span className="text-xs font-bold text-muted">{new Date(log.createdAt).toLocaleString()} · {log.duration}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{log.transcript}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {log.autoTags.map((tag) => <span key={tag} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">#{tag}</span>)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  )
}
