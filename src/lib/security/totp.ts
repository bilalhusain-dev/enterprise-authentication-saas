/**
 * ============================================================================
 * RFC 6238 TOTP (TIME-BASED ONE-TIME PASSWORD) CRYPTOGRAPHIC ENGINE
 * ============================================================================
 * Standard RFC 6238 HMAC-SHA1 TOTP generator and validator with 30s intervals,
 * Base32 secret encoding, and emergency backup recovery code checks.
 */

import crypto from 'crypto';

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(secret: string): Buffer {
  const cleanSecret = secret.toUpperCase().replace(/[\s=-]/g, '');
  let bits = '';

  for (let i = 0; i < cleanSecret.length; i++) {
    const val = BASE32_CHARS.indexOf(cleanSecret.charAt(i));
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }

  return Buffer.from(bytes);
}

function base32Encode(buffer: Buffer): string {
  let bits = '';
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, '0');
  }

  let base32 = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substr(i, 5).padEnd(5, '0');
    base32 += BASE32_CHARS[parseInt(chunk, 2)];
  }

  return base32;
}

export const TotpService = {
  /**
   * Generate a random 16-character Base32 TOTP secret
   */
  generateSecret(): string {
    const randomBytes = crypto.randomBytes(10);
    return base32Encode(randomBytes);
  },

  /**
   * Compute the 6-digit TOTP code for a given timestamp step
   */
  generateCode(secret: string, timeStep = Math.floor(Date.now() / 1000 / 30)): string {
    const key = base32Decode(secret);
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(timeStep), 0);

    const hmac = crypto.createHmac('sha1', key);
    hmac.update(buffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0xf;
    const binary =
      ((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff);

    const code = (binary % 1000000).toString().padStart(6, '0');
    return code;
  },

  /**
   * Verify a submitted 6-digit TOTP token with +/- 1 step drift (90-second grace window)
   */
  verifyCode(secret: string, token: string): boolean {
    if (!token || token.length !== 6) return false;

    const currentStep = Math.floor(Date.now() / 1000 / 30);

    // Check T-1, T0, T+1 (Drift tolerance)
    for (let offset = -1; offset <= 1; offset++) {
      const validCode = this.generateCode(secret, currentStep + offset);
      if (validCode === token.trim()) {
        return true;
      }
    }

    return false;
  },

  /**
   * Verify and consume an emergency backup code
   */
  verifyBackupCode(submittedCode: string, backupCodes: string[]): { isValid: boolean; remainingCodes: string[] } {
    const cleanInput = submittedCode.trim().toLowerCase().replace(/\s/g, '');
    const matchIndex = backupCodes.findIndex(code => code.toLowerCase().replace(/\s/g, '') === cleanInput);

    if (matchIndex !== -1) {
      const remaining = [...backupCodes];
      remaining.splice(matchIndex, 1);
      return { isValid: true, remainingCodes: remaining };
    }

    return { isValid: false, remainingCodes: backupCodes };
  }
};
