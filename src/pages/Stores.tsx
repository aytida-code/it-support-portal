import { useNavigate } from 'react-router-dom'
import { MapPin, MonitorSmartphone, Ticket } from 'lucide-react'
import { StatusPill } from '../components/StatusPill'
import { devices, storeLocations } from '../data/mockData'

export function Stores() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Store monitoring</p>
          <h2 className="mt-1 text-3xl font-black text-ink">Subway locations</h2>
        </div>
        <button type="button" onClick={() => navigate('/tickets/new')} className="btn-primary">Create store ticket</button>
      </div>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {storeLocations.map((store) => {
          const storeDevices = devices.filter((device) => device.storeId === store.id)
          return (
            <div key={store.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-ink">{store.storeNumber}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin className="h-4 w-4" /> {store.city}, {store.state}</p>
                </div>
                <StatusPill status={store.health} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surfaceAlt p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Franchisee</p>
                  <p className="mt-1 text-sm font-bold text-ink">{store.franchisee}</p>
                </div>
                <div className="rounded-2xl bg-surfaceAlt p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Open incidents</p>
                  <p className="mt-1 text-sm font-bold text-ink">{store.openIncidents}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {storeDevices.length === 0 ? (
                  <p className="rounded-2xl bg-surfaceAlt p-3 text-sm text-muted">No monitored devices.</p>
                ) : (
                  storeDevices.map((device) => (
                    <div key={device.id} className="rounded-2xl border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-2 text-sm font-bold text-ink"><MonitorSmartphone className="h-4 w-4 text-primary" /> {device.name}</p>
                        <StatusPill status={device.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted">{device.type} · last seen {device.lastSeen}</p>
                      {device.issue && <p className="mt-2 text-xs font-semibold text-danger">{device.issue}</p>}
                    </div>
                  ))
                )}
              </div>
              <button type="button" onClick={() => navigate('/tickets/new')} className="btn-secondary mt-5 w-full"><Ticket className="h-4 w-4" /> Log issue for store</button>
            </div>
          )
        })}
      </section>
    </div>
  )
}
