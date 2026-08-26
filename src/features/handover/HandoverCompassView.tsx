'use client';

import React, { useState } from 'react';
import { Compass, Code2, Database, Server } from 'lucide-react';

interface MappingItem {
  id: string;
  actionName: string;
  category: string;
  route: string;
  componentFile: string;
  serviceFile: string;
  dbTarget: string;
  simulatedSql: string;
  redisKey?: string;
  description: string;
}

const MAPPINGS: MappingItem[] = [
  {
    id: 'map_1',
    actionName: '1. User Password Login & Hash Verification',
    category: 'Authentication',
    route: '/login',
    componentFile: 'src/features/auth/components/login-card.tsx',
    serviceFile: 'src/features/auth/server/auth.service.ts -> loginWithPassword()',
    dbTarget: 'PostgreSQL: users, user_sessions',
    redisKey: 'ratelimit:auth:192.0.2.14, session:sess_01_CURRENT',
    simulatedSql: `SELECT id, email, password_hash, two_factor_enabled FROM users WHERE email = 'alex.morgan@acmecorp.com';
-- Verify Argon2id(password, hash)
INSERT INTO user_sessions (user_id, ip_address, user_agent, expires_at) VALUES ('usr_01', '192.0.2.14', 'Chrome 128', NOW() + INTERVAL '7 days');`,
    description: 'Verifies Argon2id password hash, checks Redis sliding rate-limit (max 5/15m), generates RS256 access JWT, and sets HTTP-only refresh cookie.',
  },
  {
    id: 'map_2',
    actionName: '2. 2FA TOTP Second Factor Verification',
    category: 'Security & 2FA',
    route: '/verify-2fa',
    componentFile: 'src/features/two-factor/components/otp-verify-form.tsx',
    serviceFile: 'src/features/two-factor/server/totp.service.ts -> verifyTotpCode()',
    dbTarget: 'PostgreSQL: two_factor_keys',
    simulatedSql: `SELECT encrypted_secret, hashed_backup_codes FROM two_factor_keys WHERE user_id = 'usr_01';
-- Decrypt AES-256 secret & evaluate RFC 6238 HMAC-SHA1 timestep
UPDATE users SET two_factor_enabled = TRUE WHERE id = 'usr_01';`,
    description: 'Validates 6-digit TOTP rolling token against decrypted base32 secret. Emits compliance audit log upon success.',
  },
  {
    id: 'map_3',
    actionName: '3. Instant Remote Session Revocation',
    category: 'Sessions & Zero-Trust',
    route: '/[orgSlug]/security/sessions',
    componentFile: 'src/features/sessions/components/device-row.tsx',
    serviceFile: 'src/features/sessions/server/session.service.ts -> revokeSessionAction()',
    dbTarget: 'PostgreSQL: user_sessions',
    redisKey: 'DEL session:sess_02_IPHONE, SET revoked_token:sha256(jwt) EX 900',
    simulatedSql: `UPDATE user_sessions SET is_revoked = TRUE WHERE id = 'sess_02_IPHONE' AND user_id = 'usr_01';`,
    description: 'Immediately purges the session from Redis and pushes token hash to the blacklist. Edge Middleware rejects revoked token in < 2ms.',
  },
  {
    id: 'map_4',
    actionName: '4. Granular RBAC Role Permission Sync',
    category: 'Multi-Tenant RBAC',
    route: '/[orgSlug]/roles',
    componentFile: 'src/features/rbac/components/permission-matrix.tsx',
    serviceFile: 'src/features/rbac/server/rbac.service.ts -> updateRolePermissions()',
    dbTarget: 'PostgreSQL: organization_members, roles',
    simulatedSql: `UPDATE organization_members SET permissions_override = '{"audit:export": true}' WHERE organization_id = 'org_01' AND user_id = 'usr_03';`,
    description: 'Updates tenant-scoped capability bitmask. Edge Middleware checks cached capabilities before proxying protected downstream requests.',
  },
  {
    id: 'map_5',
    actionName: '5. Immutable Audit Log Append & Stream',
    category: 'Compliance & Audit',
    route: '/[orgSlug]/audit-logs',
    componentFile: 'src/features/audit-logs/components/audit-table.tsx',
    serviceFile: 'src/features/audit-logs/server/audit.queries.ts -> getAuditLogsQuery()',
    dbTarget: 'PostgreSQL: audit_logs (append-only)',
    simulatedSql: `INSERT INTO audit_logs (organization_id, actor_id, event, target_resource, ip_address, severity, metadata)
VALUES ('org_01', 'usr_01', 'security.policy.enforce_2fa_enabled', 'org:acme', '192.0.2.14', 'WARNING', '{"enforced": true}');`,
    description: 'Appends tamper-evident audit record with actor ID, IP origin, and JSON diff payload. Strictly forbids UPDATE and DELETE operations.',
  }
];

export function HandoverCompassView() {
  const [selectedMap, setSelectedMap] = useState<MappingItem>(MAPPINGS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Interactive Coding Handover (Project GPS)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Line-of-sight mapping connecting every UI action directly to file paths, backend services, and DB queries.
              </p>
            </div>
          </div>
        </div>

        <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start">
          Zero-Token Code Index
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Action Selectors */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
            Select UI Trigger / Action
          </span>
          {MAPPINGS.map((item) => {
            const isSelected = selectedMap.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMap(item)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {item.actionName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                  Route: {item.route}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Code GPS Inspector */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-xs">
          <div className="pb-2.5 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">{selectedMap.actionName}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{selectedMap.description}</p>
          </div>

          {/* Trace Nodes */}
          <div className="space-y-2.5 font-mono text-xs">
            {/* UI Component */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center gap-1.5 text-blue-700 text-[11px] font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                FRONT-END COMPONENT
              </div>
              <div className="text-slate-900 text-xs font-bold">{selectedMap.componentFile}</div>
            </div>

            {/* Server Action / Service */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center gap-1.5 text-indigo-700 text-[11px] font-semibold">
                <Server className="w-3.5 h-3.5" />
                BACKEND SERVER SERVICE
              </div>
              <div className="text-slate-900 text-xs font-bold">{selectedMap.serviceFile}</div>
            </div>

            {/* DB & Redis */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold">
                <Database className="w-3.5 h-3.5" />
                DATABASE & CACHE TARGET
              </div>
              <div className="text-slate-800 text-[11px]">{selectedMap.dbTarget}</div>
              {selectedMap.redisKey && (
                <div className="text-amber-700 text-[11px] pt-1 border-t border-slate-100">
                  Redis Key: {selectedMap.redisKey}
                </div>
              )}
            </div>

            {/* Simulated SQL Query */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Executed SQL Simulation
              </span>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-[11px] overflow-x-auto leading-relaxed">
                {selectedMap.simulatedSql}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
