import { Organization, User, OrganizationMember, UserSession, AuditLog, PermissionDefinition } from '@/types/auth';

/**
 * ============================================================================
 * MULTI-TENANT SEED DATA STORE
 * ============================================================================
 * Realistic, enterprise-grade isolated data for 3 distinct corporate tenants:
 * 1. Acme Global Technologies (Enterprise Tier)
 * 2. CyberDyne Defense AI (Defense / Zero-Trust Tier)
 * 3. Stripe Payments EU Gateway (Fintech / High-Compliance Tier)
 */

// ----------------------------------------------------------------------------
// 1. ORGANIZATIONS (TENANTS)
// ----------------------------------------------------------------------------
export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_01H9A_ACME',
    name: 'Acme Global Technologies',
    slug: 'acme-corp',
    logoUrl: 'https://avatar.vercel.sh/acme.svg?text=AG',
    plan: 'Enterprise',
    enforce2FA: true,
    sessionTimeoutHours: 72,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'org_02H9A_CYBER',
    name: 'CyberDyne Defense AI',
    slug: 'cyberdyne-ai',
    logoUrl: 'https://avatar.vercel.sh/cyberdyne.svg?text=CD',
    plan: 'Enterprise',
    enforce2FA: true,
    sessionTimeoutHours: 24,
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'org_03H9A_STRIPE_EU',
    name: 'Stripe Payments EU Gateway',
    slug: 'stripe-eu',
    logoUrl: 'https://avatar.vercel.sh/stripe.svg?text=SP',
    plan: 'Pro',
    enforce2FA: false,
    sessionTimeoutHours: 168,
    createdAt: '2026-03-20T16:00:00Z',
  }
];

// ----------------------------------------------------------------------------
// 2. USERS (GLOBAL IDENTITIES)
// ----------------------------------------------------------------------------
export const INITIAL_USERS: User[] = [
  // Acme Users
  {
    id: 'usr_01_ALEX',
    email: 'alex.morgan@acmecorp.com',
    fullName: 'Alex Morgan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr_02_SARAH',
    email: 'sarah.connor@acmecorp.com',
    fullName: 'Sarah Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 'usr_03_DEVON',
    email: 'devon.miles@acmecorp.com',
    fullName: 'Devon Miles',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: false,
    createdAt: '2026-03-12T14:15:00Z',
  },
  {
    id: 'usr_04_ELENA',
    email: 'elena.rostova@acmecorp.com',
    fullName: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-04-05T09:45:00Z',
  },

  // CyberDyne Users
  {
    id: 'usr_05_DYSON',
    email: 'miles.dyson@cyberdyne.ai',
    fullName: 'Dr. Miles Dyson',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'usr_06_MARCUS',
    email: 'marcus.wright@cyberdyne.ai',
    fullName: 'Marcus Wright',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'usr_07_T800',
    email: 'sec-ops.t800@cyberdyne.ai',
    fullName: 'CyberDyne SecOps Bot',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-02-20T16:00:00Z',
  },

  // Stripe EU Users
  {
    id: 'usr_08_PATRICK',
    email: 'patrick.c@stripe-eu.com',
    fullName: 'Patrick Collison',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-03-20T16:00:00Z',
  },
  {
    id: 'usr_09_CLAIRE',
    email: 'claire.dubois@stripe-eu.com',
    fullName: 'Claire Dubois',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isEmailVerified: true,
    twoFactorEnabled: false,
    createdAt: '2026-03-25T11:00:00Z',
  }
];

// ----------------------------------------------------------------------------
// 3. TENANT-SCOPED DATA MAP (ISOLATED DATA PER ORGANIZATION)
// ----------------------------------------------------------------------------
export interface TenantDataset {
  members: OrganizationMember[];
  sessions: UserSession[];
  auditLogs: AuditLog[];
  healthScore: number;
}

export const TENANT_DATA_STORE: Record<string, TenantDataset> = {
  // ACME CORP DATASET
  'org_01H9A_ACME': {
    healthScore: 98,
    members: [
      {
        id: 'mem_acme_01',
        organizationId: 'org_01H9A_ACME',
        userId: 'usr_01_ALEX',
        user: INITIAL_USERS[0],
        role: 'owner',
        joinedAt: '2026-01-15T08:00:00Z',
      },
      {
        id: 'mem_acme_02',
        organizationId: 'org_01H9A_ACME',
        userId: 'usr_02_SARAH',
        user: INITIAL_USERS[1],
        role: 'admin',
        joinedAt: '2026-02-01T10:30:00Z',
      },
      {
        id: 'mem_acme_03',
        organizationId: 'org_01H9A_ACME',
        userId: 'usr_03_DEVON',
        user: INITIAL_USERS[2],
        role: 'member',
        joinedAt: '2026-03-12T14:15:00Z',
      },
      {
        id: 'mem_acme_04',
        organizationId: 'org_01H9A_ACME',
        userId: 'usr_04_ELENA',
        user: INITIAL_USERS[3],
        role: 'viewer',
        joinedAt: '2026-04-05T09:45:00Z',
      }
    ],
    sessions: [
      {
        id: 'sess_acme_01_CURRENT',
        userId: 'usr_01_ALEX',
        browser: 'Chrome 128 (Desktop)',
        os: 'macOS Sequoia 15.1',
        ipAddress: '192.0.2.14',
        city: 'San Francisco',
        country: 'United States',
        isCurrent: true,
        isRevoked: false,
        lastActiveAt: 'Active now',
        createdAt: '2026-08-26T08:30:00Z',
        expiresAt: '2026-09-02T08:30:00Z',
      },
      {
        id: 'sess_acme_02_IPHONE',
        userId: 'usr_01_ALEX',
        browser: 'Mobile Safari 18.0',
        os: 'iOS 18.2 (iPhone 16 Pro)',
        ipAddress: '198.51.100.82',
        city: 'London',
        country: 'United Kingdom',
        isCurrent: false,
        isRevoked: false,
        lastActiveAt: '42m ago',
        createdAt: '2026-08-25T19:14:00Z',
        expiresAt: '2026-09-01T19:14:00Z',
      },
      {
        id: 'sess_acme_03_DEV_LINUX',
        userId: 'usr_01_ALEX',
        browser: 'Firefox Developer Edition',
        os: 'Ubuntu 24.04 LTS',
        ipAddress: '203.0.113.195',
        city: 'Toronto',
        country: 'Canada',
        isCurrent: false,
        isRevoked: false,
        lastActiveAt: '3h ago',
        createdAt: '2026-08-24T11:00:00Z',
        expiresAt: '2026-08-31T11:00:00Z',
      }
    ],
    auditLogs: [
      {
        id: 'aud_acme_01',
        organizationId: 'org_01H9A_ACME',
        actorId: 'usr_01_ALEX',
        actorEmail: 'alex.morgan@acmecorp.com',
        actorName: 'Alex Morgan',
        event: 'auth.session.created',
        targetResource: 'user_session:sess_acme_01',
        ipAddress: '192.0.2.14',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        severity: 'INFO',
        metadata: { method: 'password_with_totp', mfa_verified: true, geo: 'US-CA-SF' },
        createdAt: '2026-08-26T08:30:00Z',
      },
      {
        id: 'aud_acme_02',
        organizationId: 'org_01H9A_ACME',
        actorId: 'usr_01_ALEX',
        actorEmail: 'alex.morgan@acmecorp.com',
        actorName: 'Alex Morgan',
        event: 'security.policy.enforce_2fa_enabled',
        targetResource: 'organization:org_01H9A_ACME',
        ipAddress: '192.0.2.14',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        severity: 'WARNING',
        metadata: { previous_state: false, new_state: true, affected_users: 4 },
        createdAt: '2026-08-26T07:15:00Z',
      },
      {
        id: 'aud_acme_03',
        organizationId: 'org_01H9A_ACME',
        actorId: 'usr_02_SARAH',
        actorEmail: 'sarah.connor@acmecorp.com',
        actorName: 'Sarah Connor',
        event: 'rbac.role.permission_override_updated',
        targetResource: 'role:custom_billing_admin',
        ipAddress: '198.51.100.82',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)',
        severity: 'INFO',
        metadata: { permission_granted: 'billing:invoice_export', target_user: 'usr_03_DEVON' },
        createdAt: '2026-08-25T19:14:00Z',
      }
    ]
  },

  // CYBERDYNE DEFENSE AI DATASET
  'org_02H9A_CYBER': {
    healthScore: 100,
    members: [
      {
        id: 'mem_cyber_01',
        organizationId: 'org_02H9A_CYBER',
        userId: 'usr_05_DYSON',
        user: INITIAL_USERS[4],
        role: 'owner',
        joinedAt: '2026-02-10T12:00:00Z',
      },
      {
        id: 'mem_cyber_02',
        organizationId: 'org_02H9A_CYBER',
        userId: 'usr_06_MARCUS',
        user: INITIAL_USERS[5],
        role: 'admin',
        joinedAt: '2026-02-15T09:00:00Z',
      },
      {
        id: 'mem_cyber_03',
        organizationId: 'org_02H9A_CYBER',
        userId: 'usr_07_T800',
        user: INITIAL_USERS[6],
        role: 'admin',
        joinedAt: '2026-02-20T16:00:00Z',
      }
    ],
    sessions: [
      {
        id: 'sess_cyber_01_CURRENT',
        userId: 'usr_05_DYSON',
        browser: 'Chromium Enterprise Hardened',
        os: 'Red Hat Enterprise Linux 9.4',
        ipAddress: '140.82.121.4',
        city: 'Sunnyvale',
        country: 'United States',
        isCurrent: true,
        isRevoked: false,
        lastActiveAt: 'Active now',
        createdAt: '2026-08-26T09:00:00Z',
        expiresAt: '2026-08-27T09:00:00Z',
      },
      {
        id: 'sess_cyber_02_VAULT',
        userId: 'usr_07_T800',
        browser: 'Automated Agent Daemon',
        os: 'Custom Embedded Linux',
        ipAddress: '10.240.0.1',
        city: 'Secure Datacenter',
        country: 'United States',
        isCurrent: false,
        isRevoked: false,
        lastActiveAt: '12s ago',
        createdAt: '2026-08-26T00:00:00Z',
        expiresAt: '2026-08-27T00:00:00Z',
      }
    ],
    auditLogs: [
      {
        id: 'aud_cyber_01',
        organizationId: 'org_02H9A_CYBER',
        actorId: 'usr_05_DYSON',
        actorEmail: 'miles.dyson@cyberdyne.ai',
        actorName: 'Dr. Miles Dyson',
        event: 'defense.security.vault_seal_verified',
        targetResource: 'datacenter:cluster_alpha_node_0',
        ipAddress: '140.82.121.4',
        userAgent: 'CyberDyne Defense Engine v4.2',
        severity: 'INFO',
        metadata: { biometric_verified: true, hardware_fido2: 'YubiKey 5C NFC' },
        createdAt: '2026-08-26T09:00:00Z',
      },
      {
        id: 'aud_cyber_02',
        organizationId: 'org_02H9A_CYBER',
        actorId: 'usr_07_T800',
        actorEmail: 'sec-ops.t800@cyberdyne.ai',
        actorName: 'SecOps Bot',
        event: 'security.anomaly.foreign_ip_blocked',
        targetResource: 'gateway:external_firewall_rule_409',
        ipAddress: '185.220.101.5',
        userAgent: 'Unknown Port Scanner',
        severity: 'CRITICAL',
        metadata: { origin: 'Tor Exit Node', action_taken: 'ip_blacklisted_indefinitely' },
        createdAt: '2026-08-26T08:12:00Z',
      }
    ]
  },

  // STRIPE EU DATASET
  'org_03H9A_STRIPE_EU': {
    healthScore: 92,
    members: [
      {
        id: 'mem_stripe_01',
        organizationId: 'org_03H9A_STRIPE_EU',
        userId: 'usr_08_PATRICK',
        user: INITIAL_USERS[7],
        role: 'owner',
        joinedAt: '2026-03-20T16:00:00Z',
      },
      {
        id: 'mem_stripe_02',
        organizationId: 'org_03H9A_STRIPE_EU',
        userId: 'usr_09_CLAIRE',
        user: INITIAL_USERS[8],
        role: 'admin',
        joinedAt: '2026-03-25T11:00:00Z',
      }
    ],
    sessions: [
      {
        id: 'sess_stripe_01_CURRENT',
        userId: 'usr_08_PATRICK',
        browser: 'Safari 18.2 (macOS)',
        os: 'macOS Sequoia',
        ipAddress: '82.165.197.1',
        city: 'Dublin',
        country: 'Ireland',
        isCurrent: true,
        isRevoked: false,
        lastActiveAt: 'Active now',
        createdAt: '2026-08-26T10:15:00Z',
        expiresAt: '2026-09-02T10:15:00Z',
      }
    ],
    auditLogs: [
      {
        id: 'aud_stripe_01',
        organizationId: 'org_03H9A_STRIPE_EU',
        actorId: 'usr_08_PATRICK',
        actorEmail: 'patrick.c@stripe-eu.com',
        actorName: 'Patrick Collison',
        event: 'payments.gateway.pci_dss_scan_passed',
        targetResource: 'compliance:pci_dss_level_1',
        ipAddress: '82.165.197.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        severity: 'INFO',
        metadata: { auditor: 'KPMG Ireland', certificate_id: 'PCI-DSS-2026-IE-98' },
        createdAt: '2026-08-26T10:15:00Z',
      }
    ]
  }
};

// ----------------------------------------------------------------------------
// 4. GRANULAR RBAC PERMISSIONS MATRIX
// ----------------------------------------------------------------------------
export const RBAC_PERMISSIONS_MATRIX: PermissionDefinition[] = [
  {
    id: 'perm_org_manage',
    category: 'Organization & Billing',
    name: 'Manage Organization Settings',
    description: 'Update organization name, domain, logo, and billing subscription.',
    roles: { owner: true, admin: false, member: false, viewer: false },
  },
  {
    id: 'perm_members_invite',
    category: 'Team & Members',
    name: 'Invite & Remove Members',
    description: 'Issue cryptographic email invites and revoke team member access.',
    roles: { owner: true, admin: true, member: false, viewer: false },
  },
  {
    id: 'perm_roles_assign',
    category: 'Team & Members',
    name: 'Assign & Modify Roles',
    description: 'Promote or demote user roles within the organization context.',
    roles: { owner: true, admin: true, member: false, viewer: false },
  },
  {
    id: 'perm_sessions_inspect',
    category: 'Security & Sessions',
    name: 'Inspect Live Device Sessions',
    description: 'View active IP addresses, geolocation, and device fingerprints of members.',
    roles: { owner: true, admin: true, member: true, viewer: false },
  },
  {
    id: 'perm_sessions_revoke',
    category: 'Security & Sessions',
    name: 'Emergency Remote Session Revocation',
    description: 'Trigger instant Redis blacklist token kill switches on connected devices.',
    roles: { owner: true, admin: true, member: false, viewer: false },
  },
  {
    id: 'perm_2fa_enforce',
    category: 'Security & Sessions',
    name: 'Enforce Mandatory 2FA Policies',
    description: 'Block member logins until hardware or TOTP 2FA key is registered.',
    roles: { owner: true, admin: true, member: false, viewer: false },
  },
  {
    id: 'perm_audit_view',
    category: 'Compliance & Audit',
    name: 'View Immutable Audit Stream',
    description: 'Browse real-time forensic activity logs with actor metadata.',
    roles: { owner: true, admin: true, member: true, viewer: true },
  },
  {
    id: 'perm_audit_export',
    category: 'Compliance & Audit',
    name: 'Export Audit Logs (CSV / JSON)',
    description: 'Download cryptographically signed audit logs for SOC2 / ISO compliance.',
    roles: { owner: true, admin: true, member: false, viewer: false },
  }
];
