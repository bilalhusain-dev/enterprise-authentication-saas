import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';

interface RouteContext {
  params: Promise<{ orgId: string }>;
}

// GET: List active sessions for an organization / user
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;

    const sessions = await DbRepository.listSessions(orgId, userId);
    return NextResponse.json({ success: true, count: sessions.length, sessions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list sessions' }, { status: 500 });
  }
}

// DELETE: Revoke session (Single or All Other)
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const body = await req.json();
    const { sessionId, revokeAllOther, userId, currentSessionId } = body;

    if (revokeAllOther && userId && currentSessionId) {
      const revokedCount = await DbRepository.revokeAllOtherSessions(userId, currentSessionId);

      await DbRepository.createAuditLog({
        organizationId: orgId,
        actorId: userId,
        actorEmail: 'alex.morgan@acmecorp.com',
        actorName: 'Alex Morgan',
        event: 'auth.session.revoked_all_other',
        targetResource: `User:${userId}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'Browser',
        severity: 'CRITICAL',
        metadata: { revokedCount }
      });

      return NextResponse.json({ success: true, revokedCount });
    }

    if (sessionId) {
      const revoked = await DbRepository.revokeSession(sessionId);

      await DbRepository.createAuditLog({
        organizationId: orgId,
        actorId: 'usr_01_ALEX',
        actorEmail: 'alex.morgan@acmecorp.com',
        actorName: 'Alex Morgan',
        event: 'auth.session.revoked',
        targetResource: `Session:${sessionId}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'Browser',
        severity: 'WARNING',
        metadata: { sessionId }
      });

      return NextResponse.json({ success: revoked });
    }

    return NextResponse.json({ error: 'sessionId or revokeAllOther params required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to revoke session' }, { status: 500 });
  }
}
