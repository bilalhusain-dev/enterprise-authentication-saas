# 02 - UI/UX Specification & Information Architecture

**Project Name:** Enterprise Authentication SaaS  
**Short Name:** EA SaaS  
**Design Philosophy:** Silicon Valley High-Density Clean B2B (Linear, WorkOS, Stripe inspired)  
**Theme:** Obsidian Slate (`#090C10`) & Cobalt Sapphire (`#2563EB`) with 1px Hairline Borders  

---

## 1. Information Architecture & Navigation System

```
Enterprise Authentication SaaS
├── Public & Auth Flows
│   ├── /login                     (Enterprise Sign-In with OAuth & 2FA challenge)
│   ├── /register                  (Tenant Onboarding & Workspace Initialization)
│   ├── /verify-2fa                (6-Digit TOTP Challenge & Recovery Code Fallback)
│   └── /accept-invite             (Cryptographic Token Validation & Account Setup)
│
└── Authenticated Tenant Portal (/dashboard/[orgSlug]/...)
    ├── /overview                  (Security Health Score, Active Session Count, Quick Metrics)
    ├── /members                   (Team Directory, Pending Invites, Role Assignment Modal)
    ├── /roles                     (Granular RBAC Permission Matrix & Custom Roles)
    ├── /security/sessions         (Real-time Device Tracker & Remote Session Revocation)
    ├── /security/2fa              (TOTP Key Generator, QR Code Setup & Recovery Keys)
    ├── /audit-logs                (Forensic Audit Log Stream, JSON Inspector & Export Engine)
    └── /settings                  (Tenant Branding, SSO Policies & Danger Zone)
```

---

## 2. Layout Grid & Global UI Slots

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP NAVIGATION BAR (Fixed h-14, Border-b #1E2638)                                       │
│ [EA SaaS Logo]  |  [Org Switcher Dropdown ▼]  |  Docs  API Status       [User Profile ▼]│
├──────────────────────────┬──────────────────────────────────────────────────────────────┤
│ SIDEBAR (w-60, Fixed)    │ MAIN WORKSPACE CANVAS                                        │
│                          │ BREADCRUMB: Acme Corp > Security > Active Sessions           │
│ 📊 Overview              ├──────────────────────────────────────────────────────────────┤
│ 👥 Members & Teams       │ PAGE HEADER: Active Sessions & Devices                       │
│ 🛡️ Roles & RBAC          │ Subtitle: Manage and revoke authorized devices connected...  │
│ 📱 Active Sessions (3)   ├──────────────────────────────────────────────────────────────┤
│ 🔐 Two-Factor (2FA)      │ [PRIMARY CONTENT SECTION]                                    │
│ 📜 Audit Log Explorer    │  - Current Active Device Card (Green Indicator)              │
│ ⚙️ Organization Settings │  - Other Active Sessions Table with Revoke CTA               │
│                          │  - Bulk Revocation Danger Action                             │
└──────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. UI Component State Matrix (5-State Standard)

Every UI view and interactive component in Enterprise Authentication SaaS strictly adheres to the 5-State Rule:

| State | Visual Representation & Behavior | Standard Primitive |
| :--- | :--- | :--- |
| **1. Loading** | Subtle animated shimmer skeletons matching exact table/card dimensions. | `<Skeleton className="h-10 w-full" />` |
| **2. Empty** | Clean icon, concise explanation, and direct primary action button. | `<EmptyState icon={Shield} title="No audit logs recorded" action={<RefreshBtn/>} />` |
| **3. Error** | Non-intrusive alert banner with error code and instant "Retry" trigger. | `<Alert variant="destructive" action={<Retry/>} />` |
| **4. Success / Ideal** | High-density typography, monospace data fields, crisp 1px borders. | Standard view with responsive layouts. |
| **5. Optimistic UI** | Immediate visual update on user click (e.g. revoked session row fades out instantly). | React Server Action transitions with `useOptimistic`. |

---

## 4. Key Screen Specifications

### Screen A: Active Sessions Manager (`/security/sessions`)
- **Metric Badges:** Total Active Sessions, Distinct IP Addresses, Geographical Locations.
- **Current Device Card:** Browser Icon (Chrome/Safari/Firefox), OS Tag (macOS/Windows/Linux), IP Address, Timestamp `Active now`, Location Badge.
- **Remote Devices Table:** Columns for Device Name, IP, Location, First Seen, Last Active, Action (`Revoke` button with instant feedback).
- **Emergency Action:** Red destructive button *"Revoke All Other Sessions"*.

### Screen B: Granular RBAC Matrix (`/roles`)
- **Matrix View:** Row headers show granular permissions (e.g. `members:invite`, `audit:export`), Column headers show roles (`Owner`, `Admin`, `Member`, `Viewer`, `Custom`).
- **Interactive Checkboxes:** Interactive permission toggles with immediate security policy sync.
- **Custom Role Builder:** Drawer modal enabling creation of scoped custom roles (e.g. `Security Auditor`, `Billing Manager`).

### Screen C: Compliance Audit Log Explorer (`/audit-logs`)
- **Live Search & Filter Bar:** Full-text filter on Actor email, Event Type selector, Date-Range Picker, Severity Filter (`INFO`, `WARNING`, `CRITICAL`).
- **Live Stream Table:** Timestamps in ISO UTC monospace (`2026-08-26 14:00:00Z`), Event badges with distinct status colors.
- **Forensic Drawer:** Clicking any log opens a slide-over panel displaying the full raw JSON payload diff.
- **Export Engine:** One-click instant export to `JSON` or `CSV` format for SOC2 auditors.
