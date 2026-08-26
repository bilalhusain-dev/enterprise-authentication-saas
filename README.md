# Enterprise Authentication SaaS (EA SaaS)

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SOC2 Type II Ready](https://img.shields.io/badge/Compliance-SOC2_Type_II_Ready-emerald.svg)](#)
[![NIST SP 800-63B](https://img.shields.io/badge/Security-NIST_SP_800--63B-blue.svg)](#)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js_15_App_Router-black.svg)](#)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_Strict-3178C6.svg)](#)
[![Redis](https://img.shields.io/badge/Cache-Redis_Sliding_Window-DC382D.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16_RLS-336791.svg)](#)

> **Enterprise Authentication SaaS (EA SaaS)** is a production-grade, open-source, self-hosted Identity and Access Management (IAM) engine engineered for high-growth B2B SaaS platforms. Engineered as a modern open-source alternative to WorkOS, Clerk, and Auth0 with zero per-user fees.

---

## 🏛️ Staff-Engineer Architecture Highlights

- **🏢 Enterprise SSO & SCIM v2.0 Directory Sync:** Automated real-time employee provisioning and de-provisioning from Okta, Microsoft Entra ID (Azure AD), and Google Workspace with SAML 2.0 and OIDC discovery.
- **🔑 Passkeys & WebAuthn (FIDO2 / Biometrics):** Phishing-resistant passwordless authentication leveraging Apple Secure Enclave, Touch ID, Face ID, and YubiKey 5 NFC hardware keys.
- **🔐 RFC 6238 TOTP Two-Factor (2FA):** 30-second sliding time-step visualizer with SVG QR code generation and 8 cryptographically hashed emergency recovery codes.
- **📱 Zero-Trust Session Revocation:** Device fingerprinting with sub-millisecond Redis blacklist token invalidation and remote session kill switches.
- **🛡️ Granular RBAC Engine:** Role hierarchy (`Owner`, `Admin`, `Member`, `Viewer`) paired with fine-grained domain permission matrices and custom role registration.
- **⚡ Webhooks & Real-Time Event Dispatcher:** HMAC-SHA256 signed event delivery (`user.created`, `session.revoked`, `scim.user.deprovisioned`) with exponential backoff replay.
- **💻 Drop-In Developer SDKs:** 5-line integration libraries for **Next.js 15 App Router**, **React Hooks**, **Node.js Express / Fastify**, and **Python FastAPI**.
- **⌨️ Global Command Palette (`⌘K`):** Instant keyboard-first navigation across all tabs, multi-tenant workspaces, and security commands.

---

## 📑 Complete Enterprise Specification Suite (`docs/`)

| Document | Title | Purpose |
| :--- | :--- | :--- |
| [`01_BRD_AND_PRD.md`](docs/01_BRD_AND_PRD.md) | **Product Requirements Document** | Personas, user stories, acceptance criteria, and non-goals. |
| [`02_UI_UX_SPECIFICATION.md`](docs/02_UI_UX_SPECIFICATION.md) | **Information Architecture & UI Matrix** | Navigation matrix, layout slots, and 5-state UI guidelines. |
| [`03_SYSTEM_ARCHITECTURE.md`](docs/03_SYSTEM_ARCHITECTURE.md) | **System Architecture & Tech Specs** | Edge middleware lifecycles, Redis revocation, and RLS. |
| [`04_DATABASE_SCHEMA.md`](docs/04_DATABASE_SCHEMA.md) | **PostgreSQL Schema & ERD** | Production DDL, foreign keys, cascades, and B-tree indexes. |
| [`05_API_CONTRACTS.md`](docs/05_API_CONTRACTS.md) | **API Contracts & Zod Schemas** | Type-safe REST request/response validation schemas. |
| [`06_CODING_HANDOVER.md`](docs/06_CODING_HANDOVER.md) | **Developer & AI Project GPS** | Zero-token direct file path and function mapping index. |
| [`07_SECURITY_AND_COMPLIANCE.md`](docs/07_SECURITY_AND_COMPLIANCE.md) | **Security & Cryptography Specs** | Argon2id, NIST 800-63B, OWASP ASVS Level 2 mitigations. |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/enterprise-authentication-saas.git
cd enterprise-authentication-saas
npm install
```

### 2. Start PostgreSQL & Redis Cluster via Docker
```bash
docker compose up -d
```

### 3. Run Next.js Development Server
```bash
npm run dev
```

Navigate to [http://localhost:3004](http://localhost:3004) to access **Enterprise Authentication SaaS (EA SaaS)**.

---

## 🗂️ Project Directory Structure

```text
enterprise-authentication-saas/
├── .cursorrules                  # Zero-token AI context guidelines
├── docker-compose.yml            # PostgreSQL 16 + Redis cluster
├── docs/                         # The 7 Production Specification Files
│   ├── 01_BRD_AND_PRD.md
│   ├── 02_UI_UX_SPECIFICATION.md
│   ├── 03_SYSTEM_ARCHITECTURE.md
│   ├── 04_DATABASE_SCHEMA.md
│   ├── 05_API_CONTRACTS.md
│   ├── 06_CODING_HANDOVER.md
│   └── 07_SECURITY_AND_COMPLIANCE.md
│
├── public/                       # Static Assets, Logo & Favicon
│   ├── brand-logo.png            # Official Brand Logo
│   ├── app-icon.png              # Shield App Icon
│   └── favicon.ico               # Browser Favicon
│
├── src/
│   ├── app/                      # Next.js App Router
│   ├── components/               # Global Shell & Command Palette (⌘K)
│   ├── features/                 # Modular Feature Architecture
│   │   ├── overview/             # Security posture & metric hub
│   │   ├── members/              # Team directory & cryptographic invites
│   │   ├── rbac/                 # Granular capability matrix & custom roles
│   │   ├── sso/                  # SAML 2.0 & SCIM v2.0 directory sync
│   │   ├── sessions/             # Redis device tracking & kill switches
│   │   ├── passkeys/             # FIDO2 WebAuthn biometrics manager
│   │   ├── two-factor/           # RFC 6238 TOTP timer & recovery codes
│   │   ├── audit-logs/           # Immutable compliance event store
│   │   ├── api-keys/             # Machine Bearer access tokens
│   │   ├── webhooks/             # HMAC-SHA256 signed event dispatcher
│   │   └── sdk/                  # Drop-in SDKs & REST API Sandbox
│   │
│   ├── db/                       # PostgreSQL schema & Multi-Tenant Store
│   ├── lib/                      # Cryptographic & audit utilities
│   └── types/                    # TypeScript interfaces & Zod contracts
```

---

## 🛡️ License

MIT License © 2026 Enterprise Authentication SaaS. Engineered for Tier-1 Global Applications.
