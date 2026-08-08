import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <main className="flex min-h-screen items-center justify-center bg-surfaceAlt p-6">
      <div className="card max-w-lg p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Home className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-4xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted">The support workspace you requested does not exist or has moved.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </main>
  )
}
