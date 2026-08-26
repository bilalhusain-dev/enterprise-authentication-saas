import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';

interface RouteContext {
  params: Promise<{ orgId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const format = searchParams.get('format'); // 'csv' or 'json'

    const logs = await DbRepository.listAuditLogs(orgId, limit);

    if (format === 'csv') {
      const headers = 'ID,Event,Actor,Target,Severity,IP,CreatedAt\n';
      const rows = logs.map(l =>
        `"${l.id}","${l.event}","${l.actorEmail}","${l.targetResource}","${l.severity}","${l.ipAddress}","${l.createdAt}"`
      ).join('\n');

      return new NextResponse(headers + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=audit-logs-${orgId}.csv`
        }
      });
    }

    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list audit logs' }, { status: 500 });
  }
}
