import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  helper: string
  tone: 'primary' | 'danger' | 'warning' | 'info'
  icon: LucideIcon
}

const toneMap = {
  primary: 'bg-primary/10 text-primary',
  danger: 'bg-danger/10 text-danger',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
}

export function StatCard({ label, value, helper, tone, icon: Icon }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{label}</p>
          <p className="mt-2 text-3xl font-black text-ink">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${toneMap[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">{helper}</p>
    </div>
  )
}
