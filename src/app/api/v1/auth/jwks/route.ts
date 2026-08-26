import { NextResponse } from 'next/server';
import { TokenService } from '@/lib/security/tokens';

export async function GET() {
  const jwks = TokenService.getPublicJwks();
  return NextResponse.json(jwks, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Type': 'application/json'
    }
  });
}
