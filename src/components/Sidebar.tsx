import { NavLink } from 'react-router-dom'
import { Activity, Bot, ClipboardList, Gauge, Headphones, MessageSquareText, ShieldAlert, Store, Wrench } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Gauge },
  { label: 'Tickets', to: '/tickets', icon: ClipboardList },
  { label: 'New Ticket', to: '/tickets/new', icon: Wrench },
  { label: 'Logs', to: '/logs', icon: MessageSquareText },
  { label: 'Escalations', to: '/escalations', icon: ShieldAlert },
  { label: 'Stores', to: '/stores', icon: Store },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-sidebar text-white lg:flex">
      <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-black text-primaryDark shadow-soft">
          S
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">Subway</p>
          <p className="text-lg font-bold">IT Support Agent</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-primary text-white shadow-soft' : 'text-white/72 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="m-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
        <div className="mb-3 flex items-center gap-2 text-accent">
          <Bot className="h-5 w-5" />
          <span className="text-sm font-black">AI logging active</span>
        </div>
        <p className="text-xs leading-5 text-white/72">Calls and chats are summarized, tagged, and attached to tickets automatically.</p>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white">
          <Activity className="h-4 w-4 text-success" />
          99.2% capture rate
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-black">MP</div>
          <div>
            <p className="text-sm font-bold">Maya Patel</p>
            <p className="flex items-center gap-1 text-xs text-white/62"><Headphones className="h-3 w-3" /> On call</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
