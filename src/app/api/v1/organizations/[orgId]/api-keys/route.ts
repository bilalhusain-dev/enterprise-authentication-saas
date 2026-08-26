import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';
import crypto from 'crypto';

interface RouteContext {
  params: Promise<{ orgId: string }>;
}

// GET: List organization API keys
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const keys = await DbRepository.listApiKeys(orgId);
    return NextResponse.json({ success: true, count: keys.length, keys });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list API keys' }, { status: 500 });
  }
}

// POST: Create API key
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const body = await req.json();
    const { name, env = 'Production', scopes = ['read:users'] } = body;

    if (!name) {
      return NextResponse.json({ error: 'Key name is required' }, { status: 400 });
    }

    const secretPart = crypto.randomBytes(24).toString('hex');
    const fullKey = `ea_${env.toLowerCase()}_sk_${secretPart}`;
    const prefix = `${fullKey.substring(0, 14)}...${fullKey.substring(fullKey.length - 4)}`;
    const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');

    const newKey = await DbRepository.createApiKey({
      organizationId: orgId,
      name: name.trim(),
      keyHash,
      prefix,
      env,
      scopes,
      lastUsedAt: 'Never'
    });

    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'api_key.created',
      targetResource: `ApiKey:${newKey.id}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: 'WARNING',
      metadata: { name, env, scopes }
    });

    return NextResponse.json({
      success: true,
      apiKey: newKey,
      secret: fullKey
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create API key' }, { status: 500 });
  }
}

// DELETE: Revoke API key
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get('keyId');

    if (!keyId) {
      return NextResponse.json({ error: 'keyId is required' }, { status: 400 });
    }

    const deleted = await DbRepository.deleteApiKey(keyId);

    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'api_key.revoked',
      targetResource: `ApiKey:${keyId}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: 'WARNING',
      metadata: { keyId }
    });

    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to revoke API key' }, { status: 500 });
  }
}
