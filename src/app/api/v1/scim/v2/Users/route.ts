/**
 * ============================================================================
 * RFC 7644 SCIM 2.0 DIRECTORY PROVISIONING ENDPOINT
 * ============================================================================
 * Standard SCIM 2.0 User resource protocol supporting Okta & Azure AD automated
 * employee onboarding, attribute syncing, and instant deprovisioning.
 */

import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  try {
    const users = await DbRepository.listMembers('org_01H9A_ACME');

    // SCIM 2.0 ListResponse Schema
    const scimResources = users.map(m => ({
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      id: m.user.id,
      userName: m.user.email,
      name: {
        formatted: m.user.fullName,
        givenName: m.user.fullName.split(' ')[0],
        familyName: m.user.fullName.split(' ')[1] || ''
      },
      emails: [
        {
          value: m.user.email,
          primary: true,
          type: 'work'
        }
      ],
      active: true,
      roles: [{ value: m.role }],
      meta: {
        resourceType: 'User',
        created: m.joinedAt,
        lastModified: m.joinedAt,
        location: `https://api.ea-auth.com/scim/v2/Users/${m.user.id}`
      }
    }));

    return NextResponse.json({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
      totalResults: scimResources.length,
      startIndex: 1,
      itemsPerPage: scimResources.length,
      Resources: scimResources
    }, {
      headers: {
        'Content-Type': 'application/scim+json'
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
      status: '500',
      detail: err.message || 'SCIM Internal Error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const scimUser = await req.json();
    const email = scimUser.userName || scimUser.emails?.[0]?.value;
    const fullName = scimUser.name?.formatted || `${scimUser.name?.givenName || ''} ${scimUser.name?.familyName || ''}`.trim() || email.split('@')[0];

    if (!email) {
      return NextResponse.json({
        schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
        status: '400',
        detail: 'Missing required SCIM attribute: userName / email'
      }, { status: 400 });
    }

    const newUser = await DbRepository.createUser({
      email,
      fullName,
      avatarUrl: `https://avatar.vercel.sh/${encodeURIComponent(email)}.svg`,
      isEmailVerified: true,
      twoFactorEnabled: false
    });

    const member = await DbRepository.addMember('org_01H9A_ACME', newUser.id, 'member');

    await DbRepository.createAuditLog({
      organizationId: 'org_01H9A_ACME',
      actorId: 'idp_okta_scim',
      actorEmail: 'system@okta.identity',
      actorName: 'Okta SCIM v2.0 Connector',
      event: 'scim.user.provisioned',
      targetResource: `User:${newUser.id}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: 'Okta-SCIM-Client/2.0',
      severity: 'INFO',
      metadata: { scimId: newUser.id, email }
    });

    return NextResponse.json({
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      id: newUser.id,
      userName: newUser.email,
      active: true,
      meta: {
        resourceType: 'User',
        created: newUser.createdAt,
        location: `https://api.ea-auth.com/scim/v2/Users/${newUser.id}`
      }
    }, {
      status: 201,
      headers: { 'Content-Type': 'application/scim+json' }
    });
  } catch (err: any) {
    return NextResponse.json({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
      status: '500',
      detail: err.message
    }, { status: 500 });
  }
}
