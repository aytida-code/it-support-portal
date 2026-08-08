# IT Support — Routes & Navigation

## How to run
cd /home/ryzen/frontend_generator_backend-test/frontend_runs/run_2f0dcce8_20260808_103503/project
npm install && npm run dev
Then open http://localhost:48577

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| / | redirects | Redirects to the main screen |
| /dashboard | src/pages/Dashboard.tsx | Subway IT support agent dashboard with priority queue, auto logging summary, device alerts, and escalation monitor |
| /tickets | src/pages/Tickets.tsx | Searchable incident queue with priority filters and clickable ticket rows |
| /tickets/new | src/pages/NewTicket.tsx | Validated ticket creation form with priority escalation recommendations and auto call/chat logging |
| /tickets/:ticketId | src/pages/TicketDetail.tsx | Ticket details, store context, timeline logs, resolve/escalate/delete actions, and add-log form |
| /logs | src/pages/Logs.tsx | Auto-logged call and chat history with manual log modal |
| /escalations | src/pages/Escalations.tsx | Priority escalation rules and active escalated incidents |
| /stores | src/pages/Stores.tsx | Subway store health cards with monitored devices and create-ticket actions |
| * | src/pages/NotFound.tsx | Public 404 page with Back and Go Home navigation |

## Navigation map
- / -> Dashboard (default redirect)
- Sidebar -> Dashboard (NavLink)
- Sidebar -> Tickets (NavLink)
- Sidebar -> New Ticket (NavLink)
- Sidebar -> Logs (NavLink)
- Sidebar -> Escalations (NavLink)
- Sidebar -> Stores (NavLink)
- TopBar logo/menu area -> Dashboard (button)
- TopBar Live logs -> Logs (NavLink)
- TopBar New ticket -> New Ticket (button)
- TopBar bell -> Escalations (button)
- Dashboard -> New Ticket (Create incident button)
- Dashboard -> Logs (Review auto logs button and Open logs button)
- Dashboard -> Escalations (escalation monitor cards)
- Dashboard -> Tickets (View all button)
- Dashboard -> TicketDetail (click priority queue row)
- Dashboard -> Stores (click device alert)
- Dashboard -> TicketDetail (click recent auto log)
- Tickets -> New Ticket (New ticket button and empty-state Create ticket button)
- Tickets -> TicketDetail (click any ticket row)
- TicketDetail -> previous page (Back button)
- TicketDetail -> Tickets (missing ticket fallback button and delete action)
- TicketDetail -> Stores (Open stores button)
- TicketDetail -> stays on TicketDetail (Resolve, Escalate, Add log actions mutate localStorage-backed store)
- NewTicket -> previous page (Back button)
- NewTicket -> Tickets (Cancel button)
- NewTicket -> TicketDetail (Create and open ticket submit after validation and persistence)
- Logs -> TicketDetail (click a log card)
- Logs -> stays on Logs (Add log modal creates persisted interaction log)
- Escalations -> New Ticket (Escalate new button)
- Escalations -> TicketDetail (click active escalation row)
- Stores -> New Ticket (Create store ticket and Log issue for store buttons)
- NotFound -> previous page (Back button)
- NotFound -> / then Dashboard (Go Home link)
- Any page -> NotFound (unknown URL)

## Shared components
- src/components/Sidebar.tsx — Fixed Subway-branded sidebar with NavLink active states, support agent identity, and AI logging status card.
- src/components/TopBar.tsx — Sticky top bar with search affordance, Live logs NavLink, New ticket button, and escalation notification button.
- src/components/PriorityBadge.tsx — Semantic P1/P2/P3/P4 priority pills.
- src/components/StatusPill.tsx — Reusable status pill for tickets, devices, stores, and agents.
- src/components/StatCard.tsx — Dashboard metric card with lucide icon, helper text, and tone colors.

## Design tokens
- primary: #008938
- primaryDark: #006B2E
- accent: #FFC20D
- accentDark: #E8A900
- surface: #FFFFFF
- surfaceAlt: #F7F9F5
- muted: #6B7280
- ink: #122018
- border: #E3E9DF
- danger: #DC2626
- warning: #F59E0B
- success: #16A34A
- info: #2563EB
- sidebar: #062C1D
