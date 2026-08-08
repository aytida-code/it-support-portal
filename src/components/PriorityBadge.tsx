import type { Priority } from '../types'

const styles: Record<Priority, string> = {
  P1: 'bg-danger/10 text-danger ring-danger/20',
  P2: 'bg-warning/10 text-warning ring-warning/20',
  P3: 'bg-info/10 text-info ring-info/20',
  P4: 'bg-muted/10 text-muted ring-muted/20',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[priority]}`}>
      {priority}
    </span>
  )
}
