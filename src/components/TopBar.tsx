import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Menu, Plus, Search } from 'lucide-react'

export function TopBar() {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => navigate('/dashboard')} className="rounded-xl border border-border p-2 text-ink lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Agent console</p>
          <h1 className="text-xl font-black text-ink sm:text-2xl">Subway IT Support</h1>
        </div>
      </div>

      <div className="hidden w-full max-w-md items-center gap-3 rounded-2xl border border-border bg-surfaceAlt px-4 py-3 lg:flex">
        <Search className="h-5 w-5 text-muted" />
        <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted" placeholder="Search tickets, stores, callers..." />
      </div>

      <div className="flex items-center gap-3">
        <NavLink
          to="/logs"
          className={({ isActive }) =>
            `hidden rounded-xl px-3 py-2 text-sm font-bold transition sm:inline-flex ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surfaceAlt hover:text-ink'}`
          }
        >
          Live logs
        </NavLink>
        <button type="button" onClick={() => navigate('/tickets/new')} className="btn-primary py-2.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New ticket</span>
        </button>
        <button type="button" onClick={() => navigate('/escalations')} className="relative rounded-xl border border-border bg-white p-2.5 text-muted transition hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>
      </div>
    </header>
  )
}
