import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceAlt">
      <Sidebar />
      <div className="lg:pl-72">
        <TopBar />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
