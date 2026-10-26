# VEYUKA CRM — Executive & Operations Web Console

The internal web console for the owner and operations staff of Veyuka (managed event booking platform for weddings, birthdays, engagements, galas, corporate summits, and cultural celebrations).

---

## 1. Quick Start

Ensure you are inside the `website` directory:

```bash
cd website
npm run dev
```

The application runs locally on **`http://localhost:3000`**.

---

## 2. Mock Logins & Role-Based Access Control (RBAC)

No role buttons are shown in the UI. Roles are determined automatically by mock authentication logic:

| Role | Email / Phone | Access Permissions |
| :--- | :--- | :--- |
| **Owner** | `owner@veyuka.com` or `9999999999` | Full access across all 12 modules |
| **Operations** | `ops@veyuka.com` | Today, Bookings, Customers, Vendors, Calendar, Operations |
| **Finance** | `finance@veyuka.com` | Today, Bookings, Finance, Analytics |
| **Support** | `support@veyuka.com` | Today, Bookings, Customers, Operations |
| **Unauthorized** | Any other email/phone | Denied with friendly notice to use customer mobile app |

**OTP Verification**: Enter any 6-digit code (e.g. `123456`) to complete the 2-step spring animated login.

---

## 3. Design System & Tokens

Reused directly from the Veyuka mobile application (`src/theme`):
- **Canvases**: Warm Ivory `#FBFAF8`, Pure White `#FFFFFF`, Section Neutral `#F7F5F2`
- **Inks**: Obsidian Ink `#121016`, Medium Contrast `#4A4553`, Grey `#8B8794`
- **Hairlines**: 1px structural borders `#ECE8E4`
- **Accent**: One Deep Plum `#4A2275` for the single primary action pill; Antique Gold `#B8924A` for thin lines and small numerals
- **Surfaces**: Radius 20–28, cards radius 24, floating drawer shadows, zero glassmorphism
- **Motion**: Spring physics only (Framer Motion 60fps), SVG stroke drawing intro, blur-to-sharp reveals

---

## 4. Replacing Mock Services With a Real Backend

The UI components **NEVER** call raw data files directly. All requests flow through `website/src/services/*`.

To connect to a live backend (REST, GraphQL, or Supabase), replace only the following service files:

1. **Authentication**: `website/src/services/auth.ts`  
   *(Replace with NextAuth, Supabase Auth, or your JWT session endpoints)*
2. **Bookings & Pipeline**: `website/src/services/bookings.ts`  
   *(Replace with `GET /api/bookings`, `PATCH /api/bookings/:id/stage`, `POST /api/bookings/:id/vendors`)*
3. **Customers**: `website/src/services/customers.ts`  
   *(Replace with `GET /api/customers`, `GET /api/customers/:id`)*
4. **Vendors & Payouts**: `website/src/services/vendors.ts`  
   *(Replace with `GET /api/vendors`, `POST /api/vendors`)*
5. **Packages**: `website/src/services/packages.ts`  
   *(Replace with `GET /api/packages`)*
6. **Payments & Ledger**: `website/src/services/payments.ts`  
   *(Replace with Razorpay/Stripe webhooks & accounting ledger APIs)*
7. **Operations & Escalations**: `website/src/services/operations.ts`  
   *(Replace with live WebSocket / SSE event dispatch queue)*
8. **Team & Staff**: `website/src/services/employees.ts`  
   *(Replace with HRMS / internal directory endpoints)*
9. **Analytics & Funnel**: `website/src/services/analytics.ts`  
   *(Replace with ClickHouse / PostgreSQL metrics aggregation queries)*
10. **Public Showcase Enquiries**: `website/src/services/enquiries.ts`  
   *(Replace with Lead capture CRM webhook)*

---

## 5. Route Architecture & Security Boundary

- `/` → Automatically redirects to `/showcase`
- `/showcase` → **PUBLIC**, client-facing showcase. Zero private data, zero vendor details.
- `/login` → Team login (split conversational layout with typewriter effect & spring OTP).
- `/console/*` → **PRIVATE**, strictly protected by middleware & session cookies:
  - `/console/today`: Executive morning/evening greeting, focus list, weekly timeline.
  - `/console/bookings`: Drag-and-drop pipeline board with `@dnd-kit`, table view, detail drawer.
  - `/console/customers`: VIP profiles and showcase consultation enquiries.
  - `/console/vendors`: Zero-vendor-app internal partner directory with KYC status.
  - `/console/calendar`: Event scheduling and "Event Day Mode" live operations control room.
  - `/console/finance`: Ledger, P&L, GST reconciliation, export reports.
  - `/console/operations`: Live delay and emergency escalation dispatch.
  - `/console/team`: Internal directory, attendance toggles, leave balances.
  - `/console/analytics`: Conversion funnels and category revenue mix.
  - `/console/marketing`: Campaign spend, leads, CAC.
  - `/console/settings`: Company profile, RBAC matrix, audit log.

