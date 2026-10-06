export type UserRole = 'owner' | 'admin' | 'member' | 'viewer' | 'custom';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  enforce2FA: boolean;
  sessionTimeoutHours: number;
  createdAt: string;
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

export interface TwoFactorConfig {
  userId: string;
  isEnabled: boolean;
  secret: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

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
  metadata: Record<string, unknown>;
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
