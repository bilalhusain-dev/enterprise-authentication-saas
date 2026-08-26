import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';
import { TotpService } from '@/lib/security/totp';
import { TokenService } from '@/lib/security/tokens';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, code, backupCode, enable = false } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await DbRepository.findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const secret = user.totpSecret || 'HXDMV3S2FZ6WG7P9';
    let isCodeValid = false;

    // 1. Verify 6-digit TOTP
    if (code) {
      isCodeValid = TotpService.verifyCode(secret, code.trim());
    }

    // 2. Or verify Emergency Backup Code
    if (!isCodeValid && backupCode && user.backupCodes) {
      const backupCheck = TotpService.verifyBackupCode(backupCode, user.backupCodes);
      if (backupCheck.isValid) {
        isCodeValid = true;
        // Update user remaining codes
        await DbRepository.updateUser(user.id, { backupCodes: backupCheck.remainingCodes });
      }
    }

    if (!isCodeValid) {
      return NextResponse.json({ error: 'Invalid verification code or recovery key' }, { status: 401 });
    }

    // 3. Update user 2FA status if activating
    if (enable || !user.twoFactorEnabled) {
      await DbRepository.updateUser(user.id, { twoFactorEnabled: true });
    }

    // 4. Issue full token pair
    const tokens = TokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      name: user.fullName,
      orgId: 'org_01H9A_ACME',
      role: 'admin',
      sessionId: `sess_${Date.now()}`
    });

    return NextResponse.json({
      success: true,
      twoFactorEnabled: true,
      tokens
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
