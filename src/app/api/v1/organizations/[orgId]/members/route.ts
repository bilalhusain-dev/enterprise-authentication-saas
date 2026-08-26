import { NextRequest, NextResponse } from 'next/server';
import { DbRepository } from '@/lib/db/repository';
import { UserRole } from '@/lib/db/types';

interface RouteContext {
  params: Promise<{ orgId: string }>;
}

// GET: List organization members
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const members = await DbRepository.listMembers(orgId);
    return NextResponse.json({ success: true, count: members.length, members });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list members' }, { status: 500 });
  }
}

// POST: Invite / Add member to organization
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const body = await req.json();
    const { email, fullName, role = 'member' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists or create new user
    let user = await DbRepository.findUserByEmail(email);
    if (!user) {
      user = await DbRepository.createUser({
        email,
        fullName: fullName || email.split('@')[0],
        avatarUrl: `https://avatar.vercel.sh/${encodeURIComponent(email)}.svg`,
        isEmailVerified: false,
        twoFactorEnabled: false
      });
    }

    const member = await DbRepository.addMember(orgId, user.id, role as UserRole);

    // Record audit log
    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'organization.member.invited',
      targetResource: `User:${user.id}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: 'INFO',
      metadata: { role, email }
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to invite member' }, { status: 500 });
  }
}

// PATCH: Update member role
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const body = await req.json();
    const { memberId, role } = body;

    if (!memberId || !role) {
      return NextResponse.json({ error: 'memberId and role are required' }, { status: 400 });
    }

    const updated = await DbRepository.updateMemberRole(memberId, role as UserRole);
    if (!updated) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'rbac.role.permission_override_updated',
      targetResource: `Member:${memberId}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: 'WARNING',
      metadata: { newRole: role }
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update role' }, { status: 500 });
  }
}

// DELETE: Remove member
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { orgId } = await params;
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'memberId query parameter is required' }, { status: 400 });
    }

    const deleted = await DbRepository.removeMember(memberId);

    await DbRepository.createAuditLog({
      organizationId: orgId,
      actorId: 'usr_01_ALEX',
      actorEmail: 'alex.morgan@acmecorp.com',
      actorName: 'Alex Morgan',
      event: 'organization.member.removed',
      targetResource: `Member:${memberId}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      severity: 'CRITICAL',
      metadata: { memberId }
    });

    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to remove member' }, { status: 500 });
  }
}
