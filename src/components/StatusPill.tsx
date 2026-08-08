import type { DeviceStatus, TicketStatus } from '../types'

type Status = TicketStatus | DeviceStatus | 'Healthy' | 'Degraded' | 'Critical' | 'Available' | 'On call' | 'After-call work' | 'Offline'

const map: Record<string, string> = {
  New: 'bg-info/10 text-info',
  Triaging: 'bg-accent/20 text-accentDark',
  Escalated: 'bg-danger/10 text-danger',
  'Waiting Vendor': 'bg-warning/10 text-warning',
  Resolved: 'bg-success/10 text-success',
  Online: 'bg-success/10 text-success',
  Warning: 'bg-warning/10 text-warning',
  Offline: 'bg-danger/10 text-danger',
  Healthy: 'bg-success/10 text-success',
  Degraded: 'bg-warning/10 text-warning',
  Critical: 'bg-danger/10 text-danger',
  Available: 'bg-success/10 text-success',
  'On call': 'bg-info/10 text-info',
  'After-call work': 'bg-accent/20 text-accentDark',
}

export function StatusPill({ status }: { status: Status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${map[status] ?? 'bg-muted/10 text-muted'}`}>{status}</span>
}
