import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';
import { AppApprovalStatus } from '@/lib/db/types';

interface RouteContext {
  params: Promise<{ orgId: string }>;
}

// GET: List SaaS apps
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const apps = await DbRepository.listSaaSApps(orgId);
    return NextResponse.json({ success: true, count: apps.length, apps });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list SaaS apps' }, { status: 500 });
  }
}

// PATCH: Update app approval status
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const body = await req.json();
    const { appId, status } = body;

    if (!appId || !status) {
      return NextResponse.json({ error: 'appId and status are required' }, { status: 400 });
    }

    const updated = await DbRepository.updateSaaSAppStatus(appId, status as AppApprovalStatus);
    if (!updated) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'saas.app_status_updated',
      targetResource: `SaaSApp:${appId}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: status === 'RESTRICTED' ? 'WARNING' : 'INFO',
      metadata: { appId, newStatus: status }
    });

    return NextResponse.json({ success: true, app: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update SaaS app' }, { status: 500 });
  }
}
