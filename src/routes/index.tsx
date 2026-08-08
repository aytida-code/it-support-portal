import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import { Dashboard } from '../pages/Dashboard'
import { Escalations } from '../pages/Escalations'
import { Logs } from '../pages/Logs'
import { NewTicket } from '../pages/NewTicket'
import { NotFound } from '../pages/NotFound'
import { Stores } from '../pages/Stores'
import { TicketDetail } from '../pages/TicketDetail'
import { Tickets } from '../pages/Tickets'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'tickets', element: <Tickets /> },
      { path: 'tickets/new', element: <NewTicket /> },
      { path: 'tickets/:ticketId', element: <TicketDetail /> },
      { path: 'logs', element: <Logs /> },
      { path: 'escalations', element: <Escalations /> },
      { path: 'stores', element: <Stores /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
