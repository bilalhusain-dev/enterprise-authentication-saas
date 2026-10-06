# AGENTS.md — AI Engineering Standards & Architectural Rules
> **Project:** Enterprise Authentication SaaS (EA SaaS)  
> **Author & Lead Architect:** Bilal Hussain (`bilalhusain-dev`)  
> **Protocol Standard:** RFC 6749 (OAuth 2.0), RFC 7519 (JWT), RFC 7644 (SCIM 2.0), FIDO2 WebAuthn

---

## 🎯 Architectural Intent & Core Principles

1. **Zero-Slop Rule:** All generated and modified code must be production-ready, strictly typed, modular, and adhering to Next.js 15 App Router conventions.
2. **Domain-Driven Boundary Isolation:**
   - Primitives: `src/components/ui/`
   - Feature modules: `src/features/<module>/components/`, `src/features/<module>/server/`, `src/features/<module>/types/`
   - Universal utilities & database: `src/lib/`, `src/db/`
3. **Multi-Tenant Strict Scoping:**
   - Every database query, cache key, and session check MUST explicitly scope to `organizationId` / `tenantId`.
   - Never perform cross-tenant data leaks or unscoped queries.
4. **Security & Cryptography Standards:**
   - Tokens: RS256 asymmetric signing with periodic key rotation (JWKS at `/api/v1/auth/jwks`).
   - Webhooks: Signed with HMAC-SHA256 headers (`X-EA-Signature`).
   - Sessions: Zero-trust sliding window with cryptographic revocation.
5. **Audit Trail Mandate:**
   - Every state-mutating action (login, token refresh, RBAC privilege grant, passkey register) MUST record an immutable event via `logAuditEvent()`.

---

## 🛠️ Tech Stack & Conventions

* **Framework:** Next.js 15 (App Router, Server Actions, Route Handlers)
* **Language:** TypeScript 5.0 (Strict mode, no `any`, mandatory Zod schema validation)
* **Styling:** Tailwind CSS v4, Lucide Icons, Dark slate enterprise palette
* **Database & ORM:** PostgreSQL 16 with Row-Level Security (RLS), Prisma ORM
* **Testing:** Node.js native test runner (`node --test`), API contract tests

---

## 🧪 Testing & Validation Protocol

Before any pull request or deployment:
1. Run `npm run typecheck` to verify zero TypeScript errors.
2. Run `npm run lint` for ESLint conformance.
3. Run `npm test` for security constants and protocol validation.
4. Update `docs/06_CODING_HANDOVER.md` for any new endpoints or schema updates.
