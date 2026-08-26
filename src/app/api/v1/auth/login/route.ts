import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';
import { PasswordService } from '@/lib/security/hashing';
import { TokenService } from '@/lib/security/tokens';
import { RateLimiter } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = RateLimiter.check(`login_${ip}`, 10, 60);

    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in a minute.' },
        { status: 429, headers: { 'Retry-After': rateCheck.resetSec.toString() } }
      );
    }

    const body = await req.json();
    const { email, password, organizationSlug = 'acme-corp' } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Find user & organization
    const user = await DbRepository.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const org = await DbRepository.findOrganizationBySlug(organizationSlug);
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // 2. Verify password
    const isPasswordValid = await PasswordService.verify(password, user.passwordHash || '');
    if (!isPasswordValid) {
      // Audit log failed attempt
      await DbRepository.createAuditLog({
        organizationId: org.id,
        actorId: user.id,
        actorEmail: user.email,
        actorName: user.fullName,
        event: 'auth.login.failed',
        targetResource: `User:${user.id}`,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'Unknown',
        severity: 'WARNING',
        metadata: { reason: 'Invalid password' }
      });

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Check 2FA requirement
    if (user.twoFactorEnabled || org.enforce2FA) {
      return NextResponse.json({
        requires2FA: true,
        userId: user.id,
        email: user.email,
        tempToken: `temp_2fa_${user.id}_${Date.now()}`
      });
    }

    // 4. Create Active Session
    const userAgent = req.headers.get('user-agent') || 'Chrome on macOS';
    const session = await DbRepository.createSession({
      userId: user.id,
      organizationId: org.id,
      tokenHash: `hash_${Date.now()}`,
      browser: userAgent.includes('Safari') && !userAgent.includes('Chrome') ? 'Safari' : 'Chrome',
      os: userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Windows') ? 'Windows 11' : 'Linux',
      ipAddress: ip,
      city: 'San Francisco',
      country: 'United States',
      isCurrent: true,
      isRevoked: false,
      lastActiveAt: 'Just now',
      expiresAt: new Date(Date.now() + org.sessionTimeoutHours * 3600 * 1000).toISOString()
    });

    // 5. Issue RS256 Dual-Token Pair
    const tokens = TokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      name: user.fullName,
      orgId: org.id,
      role: 'admin',
      sessionId: session.id
    });

    // 6. Record Audit Log
    await DbRepository.createAuditLog({
      organizationId: org.id,
      actorId: user.id,
      actorEmail: user.email,
      actorName: user.fullName,
      event: 'auth.session.created',
      targetResource: `Session:${session.id}`,
      ipAddress: ip,
      userAgent,
      severity: 'INFO',
      metadata: { sessionId: session.id }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        twoFactorEnabled: user.twoFactorEnabled
      },
      organization: org,
      session,
      tokens
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
