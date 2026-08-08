import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Plus, Search, Send } from 'lucide-react'
import { getInteractionLogs, getTickets, createInteractionLog } from '../data/store'
import type { InteractionLog, Ticket } from '../types'

export function Logs() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<InteractionLog[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [form, setForm] = useState({ ticketId: '', channel: 'Call' as 'Call' | 'Chat', customer: '', transcript: '', duration: '05:00' })

  useEffect(() => {
    void getInteractionLogs().then(setLogs)
    void getTickets().then((items) => {
      setTickets(items)
      setForm((current) => ({ ...current, ticketId: current.ticketId || items[0]?.id || '' }))
    })
  }, [])

  const isValid = form.ticketId && form.customer.trim().length >= 2 && form.transcript.trim().length >= 10 && /^\d{2}:\d{2}$/.test(form.duration)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    if (!isValid) return
    const ticket = tickets.find((item) => item.id === form.ticketId)
    const log = await createInteractionLog({
      ticketId: form.ticketId,
      channel: form.channel,
      customer: form.customer.trim(),
      agent: ticket?.assignedTo ?? 'Maya Patel',
      transcript: form.transcript.trim(),
      sentiment: 'Neutral',
      duration: form.duration,
      autoTags: ['manual-log', form.channel.toLowerCase()],
    })
    setLogs((current) => [log, ...current])
    setIsOpen(false)
    setAttempted(false)
    setForm({ ticketId: tickets[0]?.id || '', channel: 'Call', customer: '', transcript: '', duration: '05:00' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Auto logging</p>
          <h2 className="mt-1 text-3xl font-black text-ink">Calls and chats</h2>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add log</button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Logs captured" value={logs.length.toString()} helper="Persisted locally" />
        <Metric label="Call capture" value={logs.filter((log) => log.channel === 'Call').length.toString()} helper="Voice summaries" />
        <Metric label="Chat capture" value={logs.filter((log) => log.channel === 'Chat').length.toString()} helper="Transcript summaries" />
      </section>

      <div className="card p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surfaceAlt px-4 py-3">
          <Search className="h-5 w-5 text-muted" />
          <span className="text-sm text-muted">Auto logs are searchable in the connected ticket timeline and retained for audit review.</span>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        {logs.length === 0 ? (
          <div className="card p-10 text-center xl:col-span-2">
            <p className="font-bold text-ink">No logs yet — create one.</p>
            <button type="button" onClick={() => setIsOpen(true)} className="btn-primary mt-4">Create log</button>
          </div>
        ) : (
          logs.map((log) => (
            <button key={log.id} type="button" onClick={() => navigate(`/tickets/${log.ticketId}`)} className="card p-5 text-left transition hover:border-primary hover:bg-surfaceAlt">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Phone className="h-5 w-5" /></div>
                  <div>
                    <p className="font-black text-ink">{log.channel} · {log.customer}</p>
                    <p className="text-xs font-bold text-muted">Agent {log.agent} · {log.duration}</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent/20 px-2 py-1 text-xs font-bold text-accentDark">{log.sentiment}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{log.transcript}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {log.autoTags.map((tag) => <span key={tag} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">#{tag}</span>)}
              </div>
            </button>
          ))
        )}
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Manual log</p>
                <h3 className="text-2xl font-black text-ink">Attach interaction</h3>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary py-2">Close</button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field invalid={attempted && !form.ticketId} error="Select a ticket." label="Ticket">
                <select value={form.ticketId} onChange={(event) => setForm((current) => ({ ...current, ticketId: event.target.value }))} className="input-control">
                  {tickets.map((ticket) => <option key={ticket.id} value={ticket.id}>{ticket.ticketNumber} · {ticket.title}</option>)}
                </select>
              </Field>
              <Field invalid={false} error="" label="Channel">
                <select value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value as 'Call' | 'Chat' }))} className="input-control">
                  <option value="Call">Call</option>
                  <option value="Chat">Chat</option>
                </select>
              </Field>
              <Field invalid={attempted && form.customer.trim().length < 2} error="Customer is required." label="Customer">
                <input value={form.customer} onChange={(event) => setForm((current) => ({ ...current, customer: event.target.value }))} className="input-control" />
              </Field>
              <Field invalid={attempted && !/^\d{2}:\d{2}$/.test(form.duration)} error="Use MM:SS format." label="Duration">
                <input value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} className="input-control" placeholder="05:00" />
              </Field>
            </div>
            <Field invalid={attempted && form.transcript.trim().length < 10} error="Transcript must be at least 10 characters." label="Transcript">
              <textarea value={form.transcript} onChange={(event) => setForm((current) => ({ ...current, transcript: event.target.value }))} className="input-control mt-2 min-h-32" />
            </Field>
            <button type="submit" disabled={!isValid} className="btn-primary mt-5"><Send className="h-4 w-4" /> Save log</button>
          </form>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{helper}</p>
    </div>
  )
}

function Field({ label, invalid, error, children }: { label: string; invalid: boolean; error: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="field-label">{label}</span>
      <span className="mt-2 block">{children}</span>
      {invalid && <span className="mt-2 block text-sm font-semibold text-danger">{error}</span>}
    </label>
  )
}
