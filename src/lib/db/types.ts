/**
 * ============================================================================
 * ENTERPRISE AUTHENTICATION SAAS (EA SAAS) - CORE DATABASE TYPES
 * ============================================================================
 * Strictly typed entities for Multi-Tenant IAM, Zero-Trust Sessions,
 * Biometric Passkeys (FIDO2), SCIM 2.0 Directory Sync, RBAC, and Audit Logs.
 */

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer' | 'custom';
export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AppApprovalStatus = 'APPROVED' | 'UNAPPROVED' | 'RESTRICTED';
export type ApiKeyEnvironment = 'Production' | 'Staging' | 'Development';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  passwordHash?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  totpSecret?: string;
  backupCodes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  enforce2FA: boolean;
  sessionTimeoutHours: number;
  allowedDomains?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  user: User;
  role: UserRole;
  customRoleName?: string;
  permissionsOverride?: Record<string, boolean>;
  joinedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  organizationId: string;
  tokenHash: string;
  browser: string;
  os: string;
  ipAddress: string;
  city: string;
  country: string;
  isCurrent: boolean;
  isRevoked: boolean;
  lastActiveAt: string;
  createdAt: string;
  expiresAt: string;
}

export interface PasskeyCredential {
  id: string;
  userId: string;
  name: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceType: string;
  aaguid?: string;
  createdAt: string;
  lastUsedAt: string;
}

export interface ApiKeyItem {
  id: string;
  organizationId: string;
  name: string;
  keyHash: string;
  prefix: string;
  env: ApiKeyEnvironment;
  scopes: string[];
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface WebhookEndpoint {
  id: string;
  organizationId: string;
  url: string;
  secret: string;
  events: string[];
  status: 'HEALTHY' | 'FAILED' | 'DISABLED';
  lastDeliveryAt?: string;
  createdAt: string;
}

export interface SaaSApp {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  vendor: string;
  status: AppApprovalStatus;
  connectedUsers: number;
  riskScore: number;
  authMethod: string;
  lastUsedAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorId: string;
  actorEmail: string;
  actorName: string;
  event: string;
  targetResource: string;
  ipAddress: string;
  userAgent: string;
  severity: AuditSeverity;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PermissionDefinition {
  id: string;
  category: string;
  name: string;
  description: string;
  roles: {
    owner: boolean;
    admin: boolean;
    member: boolean;
    viewer: boolean;
  };
}
