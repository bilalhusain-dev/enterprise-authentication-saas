# 06 - Coding Handover & Developer GPS Index

**Project Name:** Enterprise Authentication SaaS  
**Short Name:** EA SaaS  
**Purpose:** Direct line-of-sight mapping connecting every UI action, screen, route, and button directly to its source file, server action, and database table.

---

## 🗺️ Master UI-to-Code Mapping Index

| # | User Action / UI Element | Route URL | Front-End Component File | Server Logic / Service File | Database Table / Redis Key |
| :- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Password Login Submission** | `/login` | `src/features/auth/components/login-card.tsx` | `loginWithPassword()` in `src/features/auth/server/auth.service.ts` | `users`, `user_sessions`, Redis `ratelimit:auth:*` |
| **2** | **OAuth Provider Click (Google/GH)** | `/login` | `src/features/auth/components/oauth-buttons.tsx` | `initiateOAuthFlow()` in `src/features/auth/server/oauth.service.ts` | OAuth State in Cookies |
| **3** | **2FA TOTP Code Submission** | `/verify-2fa` | `src/features/two-factor/components/otp-verify-form.tsx` | `verifyTotpCode()` in `src/features/two-factor/server/totp.service.ts` | `two_factor_keys`, `user_sessions` |
| **4** | **Switch Active Tenant Org** | Global Header | `src/components/layout/org-switcher.tsx` | `switchTenantContext()` in `src/features/organizations/server/org.service.ts` | Cookie `ea_tenant_context` |
| **5** | **Revoke Single Active Device** | `/[orgSlug]/security/sessions` | `src/features/sessions/components/device-card.tsx` | `revokeSessionAction()` in `src/features/sessions/server/session.service.ts` | `user_sessions`, Redis `revoked_token:*` |
| **6** | **Revoke All Other Sessions** | `/[orgSlug]/security/sessions` | `src/features/sessions/components/revoke-all-modal.tsx`| `revokeAllOtherSessionsAction()` in `src/features/sessions/server/session.service.ts` | `user_sessions` (bulk update) |
| **7** | **Invite New Team Member** | `/[orgSlug]/members` | `src/features/members/components/invite-modal.tsx` | `sendMemberInvite()` in `src/features/members/server/invite.service.ts` | `organization_invites`, `audit_logs` |
| **8** | **Update RBAC Permission Matrix** | `/[orgSlug]/roles` | `src/features/rbac/components/permission-matrix.tsx` | `updateRolePermissions()` in `src/features/rbac/server/rbac.service.ts` | `roles` or `organization_members` |
| **9** | **Inspect Forensic JSON Payload** | `/[orgSlug]/audit-logs` | `src/features/audit-logs/components/json-drawer.tsx` | Pure client JSON formatter | `audit_logs.metadata` |
| **10**| **Export Compliance Audit CSV** | `/[orgSlug]/audit-logs` | `src/features/audit-logs/components/export-button.tsx` | `generateAuditExport()` in `src/features/audit-logs/server/export.service.ts` | Stream from `audit_logs` |

---

## 📁 Architectural Module Responsibilities

```
src/
├── features/
│   ├── auth/           ➔ User authentication, passwords, OAuth tokens, JWT signing.
│   ├── two-factor/     ➔ TOTP secret generation, QR rendering, backup codes.
│   ├── organizations/  ➔ Tenant provisioning, workspace switching, tenant settings.
│   ├── members/        ➔ Team invites, seat assignments, member directory.
│   ├── rbac/           ➔ Role definitions, permission matrix checks, capability gates.
│   ├── sessions/       ➔ Device fingerprints, IP geolocation, instant revocation.
│   └── audit-logs/     ➔ Immutable compliance event capture, JSON diffing, CSV exporter.
├── components/
│   ├── ui/             ➔ Atom primitives (Button, Card, Dialog, Badge, Skeleton).
│   └── layout/         ➔ Global Header, Sidebar, Org Switcher, Breadcrumbs.
├── lib/                ➔ Global singletons (Redis client, Postgres pool, Audit emitter).
└── types/              ➔ Shared TypeScript interfaces and Zod schemas.
```
