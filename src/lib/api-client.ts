/**
 * ============================================================================
 * UNIFIED TYPESAFE API CLIENT
 * ============================================================================
 * Isomorphic client library for invoking Enterprise Authentication SaaS APIs
 * with automatic error handling, tenant scoping, and authorization headers.
 */

import {
  Organization,
  OrganizationMember,
  UserSession,
  ApiKeyItem,
  WebhookEndpoint,
  SaaSApp,
  AuditLog,
  UserRole,
  AppApprovalStatus
} from './db/types';

export class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl = '', token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // --------------------------------------------------------------------------
  // AUTH
  // --------------------------------------------------------------------------
  auth = {
    login: (email: string, password = 'password123', organizationSlug = 'acme-corp') =>
      this.request<{ success: boolean; tokens: any; user: any; organization: Organization }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, organizationSlug })
      }),

    verify2FA: (userId: string, code: string, enable = false) =>
      this.request<{ success: boolean; twoFactorEnabled: boolean; tokens: any }>('/api/v1/auth/2fa', {
        method: 'POST',
        body: JSON.stringify({ userId, code, enable })
      }),

    getJwks: () => this.request<any>('/api/v1/auth/jwks')
  };

  // --------------------------------------------------------------------------
  // MEMBERS (USERS)
  // --------------------------------------------------------------------------
  members = {
    list: (orgId: string) =>
      this.request<{ success: boolean; count: number; members: OrganizationMember[] }>(
        `/api/v1/organizations/${orgId}/members`
      ),

    invite: (orgId: string, email: string, role: UserRole) =>
      this.request<{ success: boolean; member: OrganizationMember }>(
        `/api/v1/organizations/${orgId}/members`,
        {
          method: 'POST',
          body: JSON.stringify({ email, role })
        }
      ),

    updateRole: (orgId: string, memberId: string, role: UserRole) =>
      this.request<{ success: boolean; member: OrganizationMember }>(
        `/api/v1/organizations/${orgId}/members`,
        {
          method: 'PATCH',
          body: JSON.stringify({ memberId, role })
        }
      ),

    remove: (orgId: string, memberId: string) =>
      this.request<{ success: boolean }>(
        `/api/v1/organizations/${orgId}/members?memberId=${memberId}`,
        { method: 'DELETE' }
      )
  };

  // --------------------------------------------------------------------------
  // SESSIONS
  // --------------------------------------------------------------------------
  sessions = {
    list: (orgId: string, userId?: string) =>
      this.request<{ success: boolean; count: number; sessions: UserSession[] }>(
        `/api/v1/organizations/${orgId}/sessions${userId ? `?userId=${userId}` : ''}`
      ),

    revoke: (orgId: string, sessionId: string) =>
      this.request<{ success: boolean }>(`/api/v1/organizations/${orgId}/sessions`, {
        method: 'DELETE',
        body: JSON.stringify({ sessionId })
      }),

    revokeAllOther: (orgId: string, userId: string, currentSessionId: string) =>
      this.request<{ success: boolean; revokedCount: number }>(`/api/v1/organizations/${orgId}/sessions`, {
        method: 'DELETE',
        body: JSON.stringify({ revokeAllOther: true, userId, currentSessionId })
      })
  };

  // --------------------------------------------------------------------------
  // API KEYS
  // --------------------------------------------------------------------------
  apiKeys = {
    list: (orgId: string) =>
      this.request<{ success: boolean; count: number; keys: ApiKeyItem[] }>(
        `/api/v1/organizations/${orgId}/api-keys`
      ),

    create: (orgId: string, name: string, env: string, scopes: string[]) =>
      this.request<{ success: boolean; apiKey: ApiKeyItem; secret: string }>(
        `/api/v1/organizations/${orgId}/api-keys`,
        {
          method: 'POST',
          body: JSON.stringify({ name, env, scopes })
        }
      ),

    revoke: (orgId: string, keyId: string) =>
      this.request<{ success: boolean }>(
        `/api/v1/organizations/${orgId}/api-keys?keyId=${keyId}`,
        { method: 'DELETE' }
      )
  };

  // --------------------------------------------------------------------------
  // WEBHOOKS
  // --------------------------------------------------------------------------
  webhooks = {
    list: (orgId: string) =>
      this.request<{ success: boolean; count: number; webhooks: WebhookEndpoint[] }>(
        `/api/v1/organizations/${orgId}/webhooks`
      ),

    create: (orgId: string, url: string, events: string[]) =>
      this.request<{ success: boolean; webhook: WebhookEndpoint }>(
        `/api/v1/organizations/${orgId}/webhooks`,
        {
          method: 'POST',
          body: JSON.stringify({ url, events })
        }
      ),

    testPing: (orgId: string, url?: string) =>
      this.request<{ success: boolean; result: any }>(`/api/v1/organizations/${orgId}/webhooks`, {
        method: 'POST',
        body: JSON.stringify({ action: 'test_ping', url })
      }),

    delete: (orgId: string, whId: string) =>
      this.request<{ success: boolean }>(
        `/api/v1/organizations/${orgId}/webhooks?whId=${whId}`,
        { method: 'DELETE' }
      )
  };

  // --------------------------------------------------------------------------
  // SAAS APPS
  // --------------------------------------------------------------------------
  saasApps = {
    list: (orgId: string) =>
      this.request<{ success: boolean; count: number; apps: SaaSApp[] }>(
        `/api/v1/organizations/${orgId}/saas-apps`
      ),

    updateStatus: (orgId: string, appId: string, status: AppApprovalStatus) =>
      this.request<{ success: boolean; app: SaaSApp }>(
        `/api/v1/organizations/${orgId}/saas-apps`,
        {
          method: 'PATCH',
          body: JSON.stringify({ appId, status })
        }
      )
  };

  // --------------------------------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------------------------------
  auditLogs = {
    list: (orgId: string, limit = 50) =>
      this.request<{ success: boolean; count: number; logs: AuditLog[] }>(
        `/api/v1/organizations/${orgId}/audit-logs?limit=${limit}`
      )
  };

  // --------------------------------------------------------------------------
  // SCIM 2.0
  // --------------------------------------------------------------------------
  scim = {
    getUsers: () => this.request<any>('/api/v1/scim/v2/Users'),
    provisionUser: (scimUserPayload: any) =>
      this.request<any>('/api/v1/scim/v2/Users', {
        method: 'POST',
        body: JSON.stringify(scimUserPayload)
      })
  };
}

export const api = new ApiClient();
