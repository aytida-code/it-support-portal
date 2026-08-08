from dotenv import load_dotenv

load_dotenv('.env_bc2e33e87c3de2a9', override=True)

AGENTS = [
    {'id': 'a1', 'name': 'Maya Patel', 'role': 'Tier 1 Support', 'avatar': 'MP', 'status': 'On call', 'queue': 5},
    {'id': 'a2', 'name': 'Jordan Ellis', 'role': 'Network Escalations', 'avatar': 'JE', 'status': 'Available', 'queue': 2},
    {'id': 'a3', 'name': 'Riley Chen', 'role': 'POS Specialist', 'avatar': 'RC', 'status': 'After-call work', 'queue': 3},
    {'id': 'a4', 'name': 'Sam Brooks', 'role': 'Field Dispatch', 'avatar': 'SB', 'status': 'Available', 'queue': 1},
]

STORE_LOCATIONS = [
    {'id': 's1', 'storeNumber': 'SUB-1042', 'city': 'Orlando', 'state': 'FL', 'franchisee': 'Sunway Foods', 'timezone': 'ET', 'health': 'Critical', 'openIncidents': 4},
    {'id': 's2', 'storeNumber': 'SUB-2388', 'city': 'Phoenix', 'state': 'AZ', 'franchisee': 'Desert Fresh LLC', 'timezone': 'MT', 'health': 'Degraded', 'openIncidents': 2},
    {'id': 's3', 'storeNumber': 'SUB-3150', 'city': 'Columbus', 'state': 'OH', 'franchisee': 'Buckeye Subs', 'timezone': 'ET', 'health': 'Healthy', 'openIncidents': 1},
    {'id': 's4', 'storeNumber': 'SUB-4471', 'city': 'Portland', 'state': 'OR', 'franchisee': 'Cascade Sandwich Co', 'timezone': 'PT', 'health': 'Degraded', 'openIncidents': 3},
    {'id': 's5', 'storeNumber': 'SUB-5207', 'city': 'Nashville', 'state': 'TN', 'franchisee': 'Music City Foods', 'timezone': 'CT', 'health': 'Healthy', 'openIncidents': 0},
    {'id': 's6', 'storeNumber': 'SUB-6119', 'city': 'Denver', 'state': 'CO', 'franchisee': 'Mile High Eats', 'timezone': 'MT', 'health': 'Critical', 'openIncidents': 5},
]

TICKETS = [
    {'id': 't1', 'ticketNumber': 'IT-24001', 'title': 'POS lane 2 frozen during lunch rush', 'storeId': 's1', 'requester': 'Dana Ruiz', 'channel': 'Call', 'priority': 'P1', 'status': 'Escalated', 'category': 'POS', 'assignedTo': 'Riley Chen', 'slaDue': 'Today 12:25 PM', 'createdAt': '2026-08-08T09:12:00.000Z', 'updatedAt': '2026-08-08T09:19:00.000Z', 'summary': 'Register accepts cash but card reader times out. Auto-escalated because impact is revenue-blocking during peak period.', 'autoLogged': True, 'escalationReason': 'Revenue-blocking POS failure with active customer queue'},
    {'id': 't2', 'ticketNumber': 'IT-24002', 'title': 'Drive-thru headset audio crackling', 'storeId': 's2', 'requester': 'Chris Nolan', 'channel': 'Chat', 'priority': 'P2', 'status': 'Triaging', 'category': 'Audio', 'assignedTo': 'Maya Patel', 'slaDue': 'Today 1:10 PM', 'createdAt': '2026-08-08T09:22:00.000Z', 'updatedAt': '2026-08-08T09:30:00.000Z', 'summary': 'Headset base station drops every 3 minutes; workaround uses front counter speaker.', 'autoLogged': True},
    {'id': 't3', 'ticketNumber': 'IT-24003', 'title': 'Back office PC cannot print end-of-day report', 'storeId': 's3', 'requester': 'Lena Wong', 'channel': 'Call', 'priority': 'P3', 'status': 'Waiting Vendor', 'category': 'Printer', 'assignedTo': 'Jordan Ellis', 'slaDue': 'Tomorrow 9:00 AM', 'createdAt': '2026-08-08T08:11:00.000Z', 'updatedAt': '2026-08-08T08:45:00.000Z', 'summary': 'Printer spooler clears but job remains pending; vendor cartridge sensor alert logged.', 'autoLogged': True},
    {'id': 't4', 'ticketNumber': 'IT-24004', 'title': 'Menu board player offline', 'storeId': 's4', 'requester': 'Avery Stone', 'channel': 'System', 'priority': 'P2', 'status': 'New', 'category': 'Digital Signage', 'assignedTo': 'Sam Brooks', 'slaDue': 'Today 2:30 PM', 'createdAt': '2026-08-08T10:01:00.000Z', 'updatedAt': '2026-08-08T10:01:00.000Z', 'summary': 'Monitoring detected signage player offline for 18 minutes; reboot command failed.', 'autoLogged': True},
    {'id': 't5', 'ticketNumber': 'IT-24005', 'title': 'Inventory tablet battery swelling', 'storeId': 's6', 'requester': 'Morgan Lee', 'channel': 'Chat', 'priority': 'P1', 'status': 'Escalated', 'category': 'Hardware Safety', 'assignedTo': 'Sam Brooks', 'slaDue': 'Today 11:45 AM', 'createdAt': '2026-08-08T09:41:00.000Z', 'updatedAt': '2026-08-08T09:48:00.000Z', 'summary': 'Agent instructed store to power down and isolate device. Escalated to field dispatch for same-day replacement.', 'autoLogged': True, 'escalationReason': 'Safety risk from swollen battery'},
    {'id': 't6', 'ticketNumber': 'IT-24006', 'title': 'Wi-Fi guest portal showing certificate warning', 'storeId': 's5', 'requester': 'Taylor Smith', 'channel': 'Walk-up', 'priority': 'P4', 'status': 'Resolved', 'category': 'Network', 'assignedTo': 'Jordan Ellis', 'slaDue': 'Yesterday 4:00 PM', 'createdAt': '2026-08-07T13:10:00.000Z', 'updatedAt': '2026-08-07T14:06:00.000Z', 'summary': 'Portal cert chain refreshed; store verified customer access.', 'autoLogged': False},
]

INTERACTION_LOGS = [
    {'id': 'l1', 'ticketId': 't1', 'channel': 'Call', 'customer': 'Dana Ruiz', 'agent': 'Maya Patel', 'transcript': 'Caller reports lane 2 POS froze after card tap. Agent verified payment service timeout and created P1 escalation.', 'sentiment': 'Frustrated', 'duration': '06:42', 'createdAt': '2026-08-08T09:18:00.000Z', 'autoTags': ['pos', 'payment', 'rush-hour']},
    {'id': 'l2', 'ticketId': 't2', 'channel': 'Chat', 'customer': 'Chris Nolan', 'agent': 'Maya Patel', 'transcript': 'Chat transcript captured headset crackling and base reboot steps. Store confirms intermittent audio remains.', 'sentiment': 'Neutral', 'duration': '09:11', 'createdAt': '2026-08-08T09:31:00.000Z', 'autoTags': ['drive-thru', 'headset']},
    {'id': 'l3', 'ticketId': 't5', 'channel': 'Chat', 'customer': 'Morgan Lee', 'agent': 'Sam Brooks', 'transcript': 'Photo reviewed by agent. Safety protocol sent and dispatch requested for tablet replacement.', 'sentiment': 'Frustrated', 'duration': '12:03', 'createdAt': '2026-08-08T09:49:00.000Z', 'autoTags': ['battery', 'safety', 'dispatch']},
    {'id': 'l4', 'ticketId': 't3', 'channel': 'Call', 'customer': 'Lena Wong', 'agent': 'Jordan Ellis', 'transcript': 'Agent restarted spooler and ran test page. Print failed with cartridge sensor error; vendor case opened.', 'sentiment': 'Positive', 'duration': '08:20', 'createdAt': '2026-08-08T08:44:00.000Z', 'autoTags': ['printer', 'vendor']},
]

ESCALATION_RULES = [
    {'id': 'e1', 'trigger': 'Payment outage or POS revenue blocker', 'priority': 'P1', 'team': 'POS Command Center', 'notify': 'Ops Director + Franchisee', 'responseTarget': '15 minutes', 'enabled': True},
    {'id': 'e2', 'trigger': 'Safety risk: battery, exposed wiring, overheating', 'priority': 'P1', 'team': 'Field Dispatch', 'notify': 'Safety Lead', 'responseTarget': '10 minutes', 'enabled': True},
    {'id': 'e3', 'trigger': 'Network outage impacting online orders', 'priority': 'P2', 'team': 'Network Escalations', 'notify': 'Regional IT', 'responseTarget': '30 minutes', 'enabled': True},
    {'id': 'e4', 'trigger': 'Single peripheral degraded with workaround', 'priority': 'P3', 'team': 'Tier 1 Queue', 'notify': 'Store Manager', 'responseTarget': '4 hours', 'enabled': True},
]

DEVICES = [
    {'id': 'd1', 'storeId': 's1', 'name': 'POS Lane 1', 'type': 'Register', 'status': 'Online', 'lastSeen': '2 min ago'},
    {'id': 'd2', 'storeId': 's1', 'name': 'POS Lane 2', 'type': 'Register', 'status': 'Offline', 'lastSeen': '24 min ago', 'issue': 'Payment service timeout'},
    {'id': 'd3', 'storeId': 's2', 'name': 'Drive-thru Base', 'type': 'Audio', 'status': 'Warning', 'lastSeen': '6 min ago', 'issue': 'Packet loss detected'},
    {'id': 'd4', 'storeId': 's4', 'name': 'Menu Player A', 'type': 'Signage', 'status': 'Offline', 'lastSeen': '21 min ago', 'issue': 'Remote reboot failed'},
    {'id': 'd5', 'storeId': 's6', 'name': 'Inventory Tablet 3', 'type': 'Tablet', 'status': 'Offline', 'lastSeen': '1 hr ago', 'issue': 'Device isolated by safety protocol'},
    {'id': 'd6', 'storeId': 's5', 'name': 'Guest Wi-Fi AP', 'type': 'Network', 'status': 'Online', 'lastSeen': '1 min ago'},
]
