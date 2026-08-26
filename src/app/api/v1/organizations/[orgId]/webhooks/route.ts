import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';
import { WebhookService } from '@/lib/security/webhooks';
import crypto from 'crypto';

interface RouteContext {
  params: Promise<{ orgId: string }>;
}

// GET: List webhooks
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const webhooks = await DbRepository.listWebhooks(orgId);
    return NextResponse.json({ success: true, count: webhooks.length, webhooks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list webhooks' }, { status: 500 });
  }
}

// POST: Create webhook or trigger test ping
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const body = await req.json();
    const { action, url, events = ['user.created'], endpointId } = body;

    // Test ping action
    if (action === 'test_ping') {
      const result = await WebhookService.dispatchEvent(
        url || 'https://backend.acmecorp.com/api/webhooks/ea-auth',
        'whsec_9f82194a820c74b291848bc1029',
        'ping.test',
        { ping: 'pong', timestamp: Date.now() },
        orgId
      );
      return NextResponse.json({ success: true, result });
    }

    if (!url) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 });
    }

    const secret = `whsec_${crypto.randomBytes(16).toString('hex')}`;
    const newWh = await DbRepository.createWebhook({
      organizationId: orgId,
      url: url.trim(),
      secret,
      events,
      status: 'HEALTHY',
      lastDeliveryAt: 'Pending'
    });

    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'webhook.endpoint_created',
      targetResource: `Webhook:${newWh.id}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: 'INFO',
      metadata: { url, events }
    });

    return NextResponse.json({ success: true, webhook: newWh }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to handle webhook request' }, { status: 500 });
  }
}

// DELETE: Remove webhook
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const { searchParams } = new URL(req.url);
    const whId = searchParams.get('whId');

    if (!whId) {
      return NextResponse.json({ error: 'whId parameter is required' }, { status: 400 });
    }

    const deleted = await DbRepository.deleteWebhook(whId);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete webhook' }, { status: 500 });
  }
}
