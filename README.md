# VEYUKA — Sovereign Managed Event Booking Platform

Veyuka is a luxury, managed event booking mobile application built with React Native and Expo Router. Customers talk **only** to Veyuka; internal captains orchestrate and assign all vendors behind the scenes. Customers never browse, compare, or contact vendors.

---

## 🏛️ Design System & Aesthetic

- **Color Palette**: Classical deep plum tones (`#2A1240`, `#3E1C5E`), royal purple (`#5B2A86`), antique gold (`#B8924A`), soft gold (`#D9BE86`), champagne (`#F3E9D8`), ivory (`#FAF5EC`), ink (`#17101F`).
- **Glassmorphism**: Curated blur surfaces (`BlurView` with `glassFill` and `glassBorder`), soft gold highlights, and dynamic floating ambient blobs.
- **Typography**: Playfair Display for headings and Inter for body text.
- **Micro-Interactions**: Spring physics (0.97 press-scale on touchables), haptic feedback, skeleton shimmer bars (no basic spinners).

---

## 🚀 How to Run the App

Ensure Node.js is installed.

```bash
# 1. Start Expo dev server
npx expo start

# 2. Or start directly on specific platforms:
npx expo start --android   # Android Emulator / Device
npx expo start --ios       # iOS Simulator
npx expo start --web       # Web Browser preview
```

### Typecheck & Health Diagnoses:
```bash
npx tsc --noEmit    # Strict TypeScript verification (0 errors)
npx expo-doctor     # Verify 20/20 Expo SDK compatibility checks pass
```

---

## 🔑 Mock Credentials & Roles

The app uses a single unified login screen that accepts an **email or phone number**, followed by any **6-digit OTP** (e.g. `888888`).

| Role | Email / Phone | OTP | Destination Route | Features |
| :--- | :--- | :--- | :--- | :--- |
| **Owner** | `owner@veyuka.com`<br>or `9999999999` | Any 6 digits (e.g. `888888`) | `app/(owner)/dashboard` | KPI analytics, SVG revenue curve, bookings management, vendor assignment bottom sheet, status progression controls, calendar with event dots, vendor management with suspend toggle, customer roster, financial ledger. |
| **Customer** | `ananya.s@gmail.com`<br>*(or any other email/phone)* | Any 6 digits (e.g. `888888`) | `app/(customer)/home` | "My Booking" progress ring countdown, mascot with typewriter bubble, 3 fan cards bottom sheet (Wedding, Birthday, Other), 3-step booking flow with mock GPS map preview, vertical timeline, payments, live concierge chat, reschedule/cancel requests. |
| **Guest** | *None required* | *None* | `app/(public)/index` | Opening letter-by-letter VEYUKA splash, story scroll landing, updates carousel, 4-step journey, packages, testimonials. |

> **Role Protection Invariant**: Root layout dynamically checks user role. Owners cannot open customer routes and customers cannot access owner routes.

---

## 🛡️ Vendor Confidentiality Invariant

Customers **never** see, browse, or contact vendors anywhere in the application. All vendor references are stripped by `src/services/bookings.ts` (`isCustomerView: true`) before customer screens render. Only the owner side in `app/(owner)` can view and dispatch internal vendors.

---

## 🔌 Connecting a Real Backend (Zero UI Changes)

The entire application is architected so that plugging in a real backend requires replacing **only** the service files in `src/services/`. All UI screens, components, and Zustand stores consume only the service contracts and will function seamlessly without modification.

Replace these files when connecting your backend:

1. [src/services/apiHelper.ts](file:///e:/project/New%20folder/veyuka-app/src/services/apiHelper.ts): Replace the simulated delay with your Axios/fetch HTTP client and base URL configuration.
2. [src/services/auth.ts](file:///e:/project/New%20folder/veyuka-app/src/services/auth.ts): Connect to your real JWT / OTP authentication endpoints.
3. [src/services/bookings.ts](file:///e:/project/New%20folder/veyuka-app/src/services/bookings.ts): Connect to your real Booking CRUD, timeline advancement, and vendor assignment APIs.
4. [src/services/vendors.ts](file:///e:/project/New%20folder/veyuka-app/src/services/vendors.ts): Connect to your private internal vendor directory and suspend toggle APIs.
5. [src/services/packages.ts](file:///e:/project/New%20folder/veyuka-app/src/services/packages.ts): Connect to your packages and categories catalog endpoints.
6. [src/services/dashboard.ts](file:///e:/project/New%20folder/veyuka-app/src/services/dashboard.ts): Connect to your real owner KPI, monthly revenue metrics, and attention queue endpoints.
7. [src/services/customers.ts](file:///e:/project/New%20folder/veyuka-app/src/services/customers.ts): Connect to your client CRM directory.
8. [src/services/updates.ts](file:///e:/project/New%20folder/veyuka-app/src/services/updates.ts): Connect to your marketing announcements and testimonials CMS.

---

## 📁 Project Structure

```
veyuka-app/
├── app/
│   ├── _layout.tsx              # Root layout with font loading & role protection
│   ├── index.tsx                # Dynamic entry router
│   ├── (public)/
│   │   ├── _layout.tsx
│   │   └── index.tsx            # Cinematic splash & guest story landing
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Unified login (email/phone) with quick demo pills
│   │   └── otp.tsx              # 6-digit OTP verification & returnUrl redirect
│   ├── (customer)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx             # My Booking ring, mascot, fan cards modal
│   │   ├── bookings.tsx         # Active/Completed/Cancelled segmented control
│   │   ├── booking-detail.tsx   # Live vertical timeline, invoice, reschedule/cancel
│   │   ├── book.tsx             # 3-step booking flow (Location GPS + Pay Advance)
│   │   ├── support.tsx          # Live concierge chat, WhatsApp, FAQs, grievance
│   │   └── profile.tsx          # Client card, venues, preferences, sign out
│   └── (owner)/
│       ├── _layout.tsx
│       ├── dashboard.tsx        # KPI count-ups, SVG revenue curve, donut chart
│       ├── bookings.tsx         # Operations list, assign vendor bottom sheet, advance status
│       ├── calendar.tsx         # Month calendar grid with event dots & day schedule
│       ├── vendors.tsx          # Private vendor roster, add vendor form, suspend toggle
│       └── more.tsx             # Customers directory, captains, ledger, logout
├── src/
│   ├── theme/                   # Classical design system tokens (colors, typography, spacing)
│   ├── components/              # GlassCard, Button, Mascot, FanCardsModal, Timeline, etc.
│   ├── data/                    # Curated mock packages, categories, bookings, vendors
│   ├── services/                # Pluggable backend service layer with 400ms delay
│   ├── store/                   # Zustand stores (useAuthStore, useBookingStore)
│   └── types/                   # Strict TypeScript domain interfaces
├── app.json
└── package.json
```
