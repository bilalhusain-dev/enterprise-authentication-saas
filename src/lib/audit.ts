import { AuditLog, AuditSeverity } from '@/types/auth';

export function createAuditLogEntry(params: {
  organizationId: string;
  actorId: string;
  actorEmail: string;
  actorName: string;
  event: string;
  targetResource: string;
  ipAddress?: string;
  userAgent?: string;
  severity?: AuditSeverity;
  metadata?: Record<string, unknown>;
}): AuditLog {
  return {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    organizationId: params.organizationId,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    actorName: params.actorName,
    event: params.event,
    targetResource: params.targetResource,
    ipAddress: params.ipAddress || '192.0.2.14',
    userAgent: params.userAgent || 'Mozilla/5.0 (Enterprise Client)',
    severity: params.severity || 'INFO',
    metadata: params.metadata || {},
    createdAt: new Date().toISOString(),
  };
}
