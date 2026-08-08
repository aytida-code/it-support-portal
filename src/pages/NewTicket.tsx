import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { agents, escalationRules, storeLocations } from '../data/mockData'
import { createTicket } from '../data/store'
import type { Channel, Priority, TicketStatus } from '../types'

const channels: Channel[] = ['Call', 'Chat', 'Walk-up', 'System']
const priorities: Priority[] = ['P1', 'P2', 'P3', 'P4']
const categories = ['POS', 'Network', 'Printer', 'Digital Signage', 'Hardware Safety', 'Audio', 'Online Orders']

export function NewTicket() {
  const navigate = useNavigate()
  const [attempted, setAttempted] = useState(false)
  const [form, setForm] = useState({
    title: '',
    storeId: storeLocations[0]?.id ?? '',
    requester: '',
    channel: 'Call' as Channel,
    priority: 'P3' as Priority,
    category: 'POS',
    assignedTo: agents[0]?.name ?? '',
    summary: '',
    escalationReason: '',
    autoLogged: true,
  })

  const recommendedRule = useMemo(() => escalationRules.find((rule) => rule.priority === form.priority), [form.priority])
  const titleValid = form.title.trim().length >= 6
  const requesterValid = form.requester.trim().length >= 2
  const summaryValid = form.summary.trim().length >= 12
  const escalationValid = form.priority !== 'P1' || form.escalationReason.trim().length >= 8
  const isValid = titleValid && requesterValid && summaryValid && escalationValid && Boolean(form.storeId && form.assignedTo)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    if (!isValid) return
    const ticket = await createTicket({
      title: form.title.trim(),
      storeId: form.storeId,
      requester: form.requester.trim(),
      channel: form.channel,
      priority: form.priority,
      status: form.priority === 'P1' ? 'Escalated' : ('New' as TicketStatus),
      category: form.category,
      assignedTo: form.assignedTo,
      slaDue: form.priority === 'P1' ? '15 minutes' : form.priority === 'P2' ? '30 minutes' : '4 hours',
      summary: form.summary.trim(),
      autoLogged: form.autoLogged,
      escalationReason: form.escalationReason.trim() || undefined,
    })
    navigate(`/tickets/${ticket.id}`)
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="card p-6">
          <div className="border-b border-border pb-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Create incident</p>
            <h2 className="mt-1 text-3xl font-black text-ink">New support ticket</h2>
            <p className="mt-2 text-sm text-muted">Capture a call, chat, store alert, or walk-up request. Auto logging will attach the transcript to the ticket.</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Issue title" invalid={attempted && !titleValid} error="Title must be at least 6 characters.">
              <input value={form.title} onChange={(event) => update('title', event.target.value)} className="input-control" placeholder="e.g. POS card reader offline" />
            </Field>
            <Field label="Requester" invalid={attempted && !requesterValid} error="Requester is required.">
              <input value={form.requester} onChange={(event) => update('requester', event.target.value)} className="input-control" placeholder="Store manager or caller name" />
            </Field>
            <Field label="Store" invalid={attempted && !form.storeId} error="Select a store.">
              <select value={form.storeId} onChange={(event) => update('storeId', event.target.value)} className="input-control">
                {storeLocations.map((store) => <option key={store.id} value={store.id}>{store.storeNumber} · {store.city}, {store.state}</option>)}
              </select>
            </Field>
            <Field label="Channel" invalid={false} error="">
              <select value={form.channel} onChange={(event) => update('channel', event.target.value as Channel)} className="input-control">
                {channels.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
              </select>
            </Field>
            <Field label="Priority" invalid={false} error="">
              <select value={form.priority} onChange={(event) => update('priority', event.target.value as Priority)} className="input-control">
                {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </Field>
            <Field label="Category" invalid={false} error="">
              <select value={form.category} onChange={(event) => update('category', event.target.value)} className="input-control">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </Field>
            <Field label="Assigned to" invalid={attempted && !form.assignedTo} error="Assign an agent.">
              <select value={form.assignedTo} onChange={(event) => update('assignedTo', event.target.value)} className="input-control">
                {agents.map((agent) => <option key={agent.id} value={agent.name}>{agent.name} · {agent.role}</option>)}
              </select>
            </Field>
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-surfaceAlt px-4 py-3">
              <input type="checkbox" checked={form.autoLogged} onChange={(event) => update('autoLogged', event.target.checked)} className="h-5 w-5 rounded border-border text-primary" />
              <span>
                <span className="block text-sm font-bold text-ink">Auto log call/chat</span>
                <span className="block text-xs text-muted">Create an interaction log when saved</span>
              </span>
            </label>
          </div>

          <div className="mt-5 space-y-5">
            <Field label="Summary" invalid={attempted && !summaryValid} error="Summary must be at least 12 characters.">
              <textarea value={form.summary} onChange={(event) => update('summary', event.target.value)} className="input-control min-h-32" placeholder="Describe symptoms, troubleshooting steps, impact, and customer sentiment." />
            </Field>
            <Field label="Escalation reason (required for P1)" invalid={attempted && !escalationValid} error="P1 tickets require an escalation reason.">
              <input value={form.escalationReason} onChange={(event) => update('escalationReason', event.target.value)} className="input-control" placeholder="Why should this bypass normal queue routing?" />
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate('/tickets')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={!isValid} className="btn-primary">Create and open ticket</button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h3 className="section-title">Priority assistant</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">Suggested path for selected priority:</p>
            {recommendedRule && (
              <div className="mt-4 rounded-2xl bg-surfaceAlt p-4">
                <p className="font-black text-ink">{recommendedRule.team}</p>
                <p className="mt-2 text-sm text-muted">{recommendedRule.trigger}</p>
                <p className="mt-3 text-sm font-bold text-primary">Response target: {recommendedRule.responseTarget}</p>
              </div>
            )}
          </div>
          <div className="card p-5">
            <h3 className="section-title">Logging checklist</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>• Capture store number and requester.</li>
              <li>• Summarize customer impact and workaround.</li>
              <li>• For P1, document revenue or safety impact.</li>
              <li>• Keep auto logging enabled for audit trail.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, invalid, error, children }: { label: string; invalid: boolean; error: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <span className="mt-2 block">{children}</span>
      {invalid && <span className="mt-2 block text-sm font-semibold text-danger">{error}</span>}
    </label>
  )
}
