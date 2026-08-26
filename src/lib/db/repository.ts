/**
 * ============================================================================
 * UNIVERSAL MULTI-TENANT DATA ACCESS REPOSITORY
 * ============================================================================
 * Production-ready abstraction with multi-tenant scoping, atomic mutations,
 * and high-performance in-memory cache/database.
 */

import {
  Organization,
  User,
  OrganizationMember,
  UserSession,
  PasskeyCredential,
  ApiKeyItem,
  WebhookEndpoint,
  SaaSApp,
  AuditLog,
  UserRole,
  AppApprovalStatus
} from './types';

import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  TENANT_DATA_STORE
} from '@/db/mock-data';

export const DEFAULT_SAAS_APPS: SaaSApp[] = [
  {
    id: 'app_claude',
    organizationId: 'org_01H9A_ACME',
    name: 'Anthropic Claude Enterprise',
    category: 'AI & LLM Infrastructure',
    vendor: 'Anthropic PBC',
    status: 'APPROVED',
    connectedUsers: 14,
    riskScore: 20,
    authMethod: 'SAML 2.0 SSO',
    lastUsedAt: '12m ago'
  },
  {
    id: 'app_github',
    organizationId: 'org_01H9A_ACME',
    name: 'GitHub Enterprise Cloud',
    category: 'DevOps & Source Control',
    vendor: 'GitHub / Microsoft',
    status: 'APPROVED',
    connectedUsers: 28,
    riskScore: 15,
    authMethod: 'OIDC / Okta SCIM',
    lastUsedAt: '4m ago'
  },
  {
    id: 'app_chatgpt',
    organizationId: 'org_01H9A_ACME',
    name: 'OpenAI ChatGPT Team',
    category: 'Generative AI',
    vendor: 'OpenAI Inc.',
    status: 'UNAPPROVED',
    connectedUsers: 6,
    riskScore: 65,
    authMethod: 'Google OAuth',
    lastUsedAt: '2h ago'
  },
  {
    id: 'app_aws',
    organizationId: 'org_01H9A_ACME',
    name: 'Amazon Web Services (AWS IAM)',
    category: 'Cloud Infrastructure',
    vendor: 'Amazon Web Services',
    status: 'APPROVED',
    connectedUsers: 19,
    riskScore: 10,
    authMethod: 'SAML 2.0 IdP',
    lastUsedAt: '1m ago'
  },
  {
    id: 'app_slack',
    organizationId: 'org_01H9A_ACME',
    name: 'Slack Enterprise Grid',
    category: 'Collaboration',
    vendor: 'Salesforce',
    status: 'APPROVED',
    connectedUsers: 45,
    riskScore: 18,
    authMethod: 'SAML 2.0 SSO',
    lastUsedAt: 'Active now'
  },
  {
    id: 'app_figma',
    organizationId: 'org_01H9A_ACME',
    name: 'Figma Organization',
    category: 'Product Design',
    vendor: 'Figma Inc.',
    status: 'APPROVED',
    connectedUsers: 11,
    riskScore: 22,
    authMethod: 'Google OAuth',
    lastUsedAt: '1d ago'
  },
  {
    id: 'app_grammarly',
    organizationId: 'org_01H9A_ACME',
    name: 'Grammarly Enterprise',
    category: 'Productivity Tool',
    vendor: 'Grammarly Inc.',
    status: 'RESTRICTED',
    connectedUsers: 3,
    riskScore: 82,
    authMethod: 'Password Login',
    lastUsedAt: '4d ago'
  }
];

// Singleton in-memory persistent storage
class InMemoryDatabase {
  public organizations: Map<string, Organization> = new Map();
  public users: Map<string, User> = new Map();
  public members: Map<string, OrganizationMember> = new Map();
  public sessions: Map<string, UserSession> = new Map();
  public passkeys: Map<string, PasskeyCredential> = new Map();
  public apiKeys: Map<string, ApiKeyItem> = new Map();
  public webhooks: Map<string, WebhookEndpoint> = new Map();
  public saasApps: Map<string, SaaSApp> = new Map();
  public auditLogs: AuditLog[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    this.organizations.clear();
    this.users.clear();
    this.members.clear();
    this.sessions.clear();
    this.passkeys.clear();
    this.apiKeys.clear();
    this.webhooks.clear();
    this.saasApps.clear();
    this.auditLogs = [];

    // 1. Seed Organizations
    INITIAL_ORGANIZATIONS.forEach(org => {
      this.organizations.set(org.id, {
        ...org,
        updatedAt: org.createdAt
      });
    });

    // 2. Seed Users
    INITIAL_USERS.forEach(user => {
      this.users.set(user.id, {
        ...user,
        passwordHash: 'argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$qU3s8Z',
        totpSecret: 'HXDMV3S2FZ6WG7P9',
        backupCodes: [
          'a982-f471-bc01',
          '33d8-11ea-90bf',
          'e7c2-901b-55a4',
          '88f1-aa42-0019',
          'c091-23ba-ff77',
          '55a1-77b3-88cc',
          'bb02-44df-9901',
          '12f9-88aa-33ee'
        ],
        updatedAt: user.createdAt
      });
    });

    // 3. Seed Multi-Tenant Data from TENANT_DATA_STORE
    Object.entries(TENANT_DATA_STORE).forEach(([orgId, dataset]) => {
      // Members
      if (dataset.members) {
        dataset.members.forEach(member => {
          this.members.set(member.id, { ...member, organizationId: orgId });
        });
      }

      // Sessions
      if (dataset.sessions) {
        dataset.sessions.forEach(session => {
          this.sessions.set(session.id, {
            ...session,
            organizationId: orgId,
            tokenHash: `hash_${session.id}`
          });
        });
      }

      // Audit Logs
      if (dataset.auditLogs) {
        dataset.auditLogs.forEach(log => {
          this.auditLogs.push({
            id: log.id,
            organizationId: log.organizationId,
            actorId: log.actorId,
            actorEmail: log.actorEmail,
            actorName: log.actorName,
            event: log.event,
            targetResource: log.targetResource,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            severity: log.severity as any,
            metadata: log.metadata,
            createdAt: log.createdAt
          });
        });
      }
    });

    // 4. Seed SaaS Apps
    DEFAULT_SAAS_APPS.forEach(app => this.saasApps.set(app.id, app));

    // 5. Default Seed API Keys
    this.apiKeys.set('key_01', {
      id: 'key_01',
      organizationId: 'org_01H9A_ACME',
      name: 'Production Backend Service',
      keyHash: 'hash_live_9f82194a',
      prefix: 'ea_live_sk_9f82...3a19',
      env: 'Production',
      scopes: ['read:users', 'write:users', 'audit:read'],
      lastUsedAt: '2m ago',
      createdAt: '2026-08-10T00:00:00Z'
    });

    this.apiKeys.set('key_02', {
      id: 'key_02',
      organizationId: 'org_01H9A_ACME',
      name: 'CI/CD Staging Key',
      keyHash: 'hash_test_1c44820a',
      prefix: 'ea_test_sk_1c44...8d90',
      env: 'Staging',
      scopes: ['read:users'],
      lastUsedAt: '3h ago',
      createdAt: '2026-08-20T00:00:00Z'
    });

    // 6. Default Seed Webhooks
    this.webhooks.set('wh_01', {
      id: 'wh_01',
      organizationId: 'org_01H9A_ACME',
      url: 'https://backend.acmecorp.com/api/webhooks/ea-auth',
      secret: 'whsec_9f82194a820c74b291848bc1029',
      events: ['user.created', 'session.revoked'],
      status: 'HEALTHY',
      lastDeliveryAt: '200 OK (142ms)',
      createdAt: '2026-08-01T00:00:00Z'
    });

    // 7. Default Seed Passkeys
    this.passkeys.set('pk_01', {
      id: 'pk_01',
      userId: 'usr_01_ALEX',
      name: 'MacBook Touch ID',
      credentialId: 'cred_apple_sec_01',
      publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA',
      counter: 142,
      deviceType: 'Apple Touch ID',
      createdAt: '2026-08-15T00:00:00Z',
      lastUsedAt: 'Today at 09:14 AM'
    });
  }
}

// Global Singleton Instance
const globalForDb = globalThis as unknown as { dbInstance?: InMemoryDatabase };
export const db = globalForDb.dbInstance ?? new InMemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;

// Guarantee seed
if (db.saasApps.size === 0) {
  DEFAULT_SAAS_APPS.forEach(app => db.saasApps.set(app.id, app));
}

/**
 * ============================================================================
 * DATA ACCESS REPOSITORY
 * ============================================================================
 */
export const DbRepository = {
  // --------------------------------------------------------------------------
  // ORGANIZATIONS (TENANTS)
  // --------------------------------------------------------------------------
  async findOrganizationById(id: string): Promise<Organization | null> {
    return db.organizations.get(id) || null;
  },

  async findOrganizationBySlug(slug: string): Promise<Organization | null> {
    for (const org of db.organizations.values()) {
      if (org.slug === slug) return org;
    }
    return null;
  },

  async listOrganizations(): Promise<Organization[]> {
    return Array.from(db.organizations.values());
  },

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | null> {
    const existing = db.organizations.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.organizations.set(id, updated);
    return updated;
  },

  // --------------------------------------------------------------------------
  // USERS
  // --------------------------------------------------------------------------
  async findUserById(id: string): Promise<User | null> {
    return db.users.get(id) || null;
  },

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of db.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return null;
  },

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newUser: User = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    db.users.set(id, newUser);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const existing = db.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.users.set(id, updated);
    return updated;
  },

  // --------------------------------------------------------------------------
  // ORGANIZATION MEMBERS
  // --------------------------------------------------------------------------
  async listMembers(organizationId: string): Promise<OrganizationMember[]> {
    const results: OrganizationMember[] = [];
    for (const member of db.members.values()) {
      if (member.organizationId === organizationId) {
        const user = db.users.get(member.userId);
        if (user) {
          results.push({ ...member, user });
        }
      }
    }
    return results;
  },

  async addMember(organizationId: string, userId: string, role: UserRole): Promise<OrganizationMember> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user = db.users.get(userId)!;
    const newMember: OrganizationMember = {
      id,
      organizationId,
      userId,
      user,
      role,
      joinedAt: new Date().toISOString()
    };
    db.members.set(id, newMember);
    return newMember;
  },

  async updateMemberRole(memberId: string, newRole: UserRole): Promise<OrganizationMember | null> {
    const existing = db.members.get(memberId);
    if (!existing) return null;
    existing.role = newRole;
    db.members.set(memberId, existing);
    return existing;
  },

  async removeMember(memberId: string): Promise<boolean> {
    return db.members.delete(memberId);
  },

  // --------------------------------------------------------------------------
  // SESSIONS
  // --------------------------------------------------------------------------
  async listSessions(organizationId?: string, userId?: string): Promise<UserSession[]> {
    const results: UserSession[] = [];
    for (const session of db.sessions.values()) {
      if (organizationId && session.organizationId !== organizationId) continue;
      if (userId && session.userId !== userId) continue;
      results.push(session);
    }
    return results;
  },

  async createSession(sessionData: Omit<UserSession, 'id' | 'createdAt'>): Promise<UserSession> {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newSession: UserSession = {
      id,
      ...sessionData,
      createdAt: new Date().toISOString()
    };
    db.sessions.set(id, newSession);
    return newSession;
  },

  async revokeSession(sessionId: string): Promise<boolean> {
    const session = db.sessions.get(sessionId);
    if (!session) return false;
    session.isRevoked = true;
    session.isCurrent = false;
    db.sessions.set(sessionId, session);
    return true;
  },

  async revokeAllOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    let count = 0;
    for (const session of db.sessions.values()) {
      if (session.userId === userId && session.id !== currentSessionId && !session.isRevoked) {
        session.isRevoked = true;
        session.isCurrent = false;
        db.sessions.set(session.id, session);
        count++;
      }
    }
    return count;
  },

  // --------------------------------------------------------------------------
  // API KEYS
  // --------------------------------------------------------------------------
  async listApiKeys(organizationId: string): Promise<ApiKeyItem[]> {
    const results: ApiKeyItem[] = [];
    for (const key of db.apiKeys.values()) {
      if (key.organizationId === organizationId) {
        results.push(key);
      }
    }
    return results;
  },

  async createApiKey(keyData: Omit<ApiKeyItem, 'id' | 'createdAt'>): Promise<ApiKeyItem> {
    const id = `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newKey: ApiKeyItem = {
      id,
      ...keyData,
      createdAt: new Date().toISOString()
    };
    db.apiKeys.set(id, newKey);
    return newKey;
  },

  async deleteApiKey(keyId: string): Promise<boolean> {
    return db.apiKeys.delete(keyId);
  },

  // --------------------------------------------------------------------------
  // WEBHOOKS
  // --------------------------------------------------------------------------
  async listWebhooks(organizationId: string): Promise<WebhookEndpoint[]> {
    const results: WebhookEndpoint[] = [];
    for (const wh of db.webhooks.values()) {
      if (wh.organizationId === organizationId) {
        results.push(wh);
      }
    }
    return results;
  },

  async createWebhook(whData: Omit<WebhookEndpoint, 'id' | 'createdAt'>): Promise<WebhookEndpoint> {
    const id = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newWh: WebhookEndpoint = {
      id,
      ...whData,
      createdAt: new Date().toISOString()
    };
    db.webhooks.set(id, newWh);
    return newWh;
  },

  async deleteWebhook(whId: string): Promise<boolean> {
    return db.webhooks.delete(whId);
  },

  // --------------------------------------------------------------------------
  // SAAS APPS
  // --------------------------------------------------------------------------
  async listSaaSApps(organizationId?: string): Promise<SaaSApp[]> {
    if (db.saasApps.size === 0) {
      DEFAULT_SAAS_APPS.forEach(app => db.saasApps.set(app.id, app));
    }
    const results: SaaSApp[] = [];
    for (const app of db.saasApps.values()) {
      if (!organizationId || app.organizationId === organizationId || organizationId === 'all') {
        results.push(app);
      }
    }

    if (results.length === 0) {
      return DEFAULT_SAAS_APPS;
    }

    return results;
  },

  async updateSaaSAppStatus(appId: string, status: AppApprovalStatus): Promise<SaaSApp | null> {
    const app = db.saasApps.get(appId);
    if (!app) return null;
    app.status = status;
    db.saasApps.set(appId, app);
    return app;
  },

  // --------------------------------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------------------------------
  async listAuditLogs(organizationId: string, limit = 50): Promise<AuditLog[]> {
    return db.auditLogs
      .filter(l => l.organizationId === organizationId)
      .slice(0, limit);
  },

  async createAuditLog(logData: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...logData,
      createdAt: new Date().toISOString()
    };
    db.auditLogs.unshift(newLog);
    return newLog;
  }
};
