'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Shield, Database, Layout, Terminal } from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  filename: string;
  content: string;
}

const DOCS: DocItem[] = [
  {
    id: 'prd',
    title: '01. Product Requirements Document (PRD)',
    category: 'Product Strategy',
    icon: Shield,
    filename: 'docs/01_BRD_AND_PRD.md',
    content: `# 01 - Business & Product Requirements Document (PRD)

**Project Name:** Enterprise Authentication SaaS (EA SaaS)
**Target Market:** USA, UK, Canada, Australia (B2B Enterprise & Mid-Market SaaS)
**Standard Compliance:** SOC2 Type II, GDPR, NIST SP 800-63B, OWASP ASVS Level 2

### 1. Executive Summary & Problem
Engineering teams spend 200+ developer hours rebuilding multi-tenant authentication, RBAC, 2FA, session revocation, and compliance audit logs from scratch. Enterprise Authentication SaaS provides a battle-tested, drop-in Identity and Access Management (IAM) engine.

### 2. Core Personas
- **Tenant Owner:** Manages billing, security policies, and team seats.
- **Security Administrator:** Real-time device tracking, remote session revocation, 2FA enforcement.
- **Compliance Officer:** SOC2/ISO 27001 evidence via immutable audit trails.
- **Developer / Integrator:** Type-safe Zod validation and declarative RBAC middleware.

### 3. Core Functional Requirements
- **Argon2id Password Hashing:** Memory: 64MB, Iterations: 3, Parallelism: 4.
- **JWT + Refresh Token Rotation:** 15m RS256 access tokens + 7d cryptographically random refresh tokens.
- **2FA TOTP:** RFC 6238 compliance with backup recovery codes.
- **Granular RBAC:** Owner, Admin, Member, Viewer + 20+ fine-grained privileges.
- **Append-Only Audit Stream:** Tamper-evident forensic event logging.`
  },
  {
    id: 'ui_ux',
    title: '02. UI/UX Specification & Screen Breakdown',
    category: 'Design System',
    icon: Layout,
    filename: 'docs/02_UI_UX_SPECIFICATION.md',
    content: `# 02 - UI/UX Specification & Information Architecture

**Design Philosophy:** Clean Minimal B2B (Linear, WorkOS, Stripe inspired)

### 1. Global Navigation System
- Public & Auth: /login, /register, /verify-2fa, /accept-invite
- Authenticated Tenant Portal:
  - /overview (Security Posture 98/100, Metrics, Quick Actions)
  - /members (Team Directory, Role Selection, Cryptographic Invites)
  - /roles (Interactive RBAC Matrix Table & Custom Roles)
  - /security/sessions (Active Device Manager & Remote Revocation)
  - /security/2fa (TOTP Setup Wizard & QR Code Generator)
  - /audit-logs (Forensic Stream, JSON Diff Drawer, CSV/JSON Exporter)

### 2. 5-State UI Matrix
1. Loading State: Skeleton animated loaders.
2. Empty State: Illustrated card + explicit CTA.
3. Error State: Banner with error code + instant retry.
4. Success State: High-density monospace data fields.
5. Optimistic UI: Instant visual update before server completion.`
  },
  {
    id: 'sys_arch',
    title: '03. System Architecture & Lifecycles',
    category: 'Engineering Architecture',
    icon: Terminal,
    filename: 'docs/03_SYSTEM_ARCHITECTURE.md',
    content: `# 03 - System Architecture & Technical Specifications

**Pattern:** Edge-First Modular Monolith with Redis Sliding Session Store & PostgreSQL RLS

### 1. Edge Authentication Middleware
- Injects x-user-id, x-tenant-id, and x-tenant-role headers in < 5ms.
- Checks Redis session blacklist for revoked tokens in sub-millisecond latency.

### 2. Zero-Trust Session Revocation
- When a session is revoked:
  1. Record marked is_revoked = true in PostgreSQL.
  2. Redis key session:<id> deleted immediately.
  3. Added to Redis blacklist revoked_token:<hash> with 15m TTL.
  4. Edge Middleware blocks any subsequent requests.`
  },
  {
    id: 'db_erd',
    title: '04. Database Architecture & PostgreSQL Schema',
    category: 'Data Layer',
    icon: Database,
    filename: 'docs/04_DATABASE_SCHEMA.md',
    content: `# 04 - Database Architecture & PostgreSQL Schema

### Entity Relations (PostgreSQL 16+ / Supabase)
- **organizations:** id, name, slug, logo_url, security_policies, timestamps
- **users:** id, email, password_hash (Argon2id), full_name, two_factor_enabled
- **organization_members:** id, organization_id, user_id, role, permissions_override
- **user_sessions:** id, user_id, ip_address, user_agent, is_revoked, expires_at
- **two_factor_keys:** id, user_id, encrypted_secret, hashed_backup_codes
- **audit_logs:** id, organization_id, actor_id, event, target_resource, ip_address, severity, metadata`
  },
  {
    id: 'handover',
    title: '06. Coding Handover & Developer GPS',
    category: 'Developer Handover',
    icon: FileText,
    filename: 'docs/06_CODING_HANDOVER.md',
    content: `# 06 - Coding Handover & Developer GPS Index

### Master Line-of-Sight Mapping
- **Login Submit** -> src/features/auth/components/login-card.tsx -> auth.service.ts -> PostgreSQL: users
- **2FA TOTP Code** -> src/features/two-factor/components/otp-verify-form.tsx -> totp.service.ts -> PostgreSQL: two_factor_keys
- **Revoke Session** -> src/features/sessions/components/device-row.tsx -> session.service.ts -> Redis + PostgreSQL: user_sessions
- **Update RBAC** -> src/features/rbac/components/permission-matrix.tsx -> rbac.service.ts -> PostgreSQL: organization_members
- **Export Audit Logs** -> src/features/audit-logs/components/export-button.tsx -> export.service.ts -> PostgreSQL: audit_logs`
  }
];

export function DocsSuiteView() {
  const [selectedDoc, setSelectedDoc] = useState<DocItem>(DOCS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Production Documentation Suite</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete A-to-Z specification documents for Enterprise Authentication SaaS.
              </p>
            </div>
          </div>
        </div>

        <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start">
          7 Specs in docs/
        </span>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Tabs */}
        <div className="lg:col-span-4 space-y-2">
          {DOCS.map((doc) => {
            const isSelected = selectedDoc.id === doc.id;
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">{doc.title}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 pl-6">
                  {doc.filename}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Markdown Content Viewer */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{selectedDoc.title}</h3>
              <span className="text-xs font-mono text-blue-600">{selectedDoc.filename}</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {selectedDoc.category}
            </span>
          </div>

          <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-[480px] overflow-y-auto">
            {selectedDoc.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
