'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  INITIAL_ORGANIZATIONS,
  TENANT_DATA_STORE,
  RBAC_PERMISSIONS_MATRIX
} from '@/db/mock-data';
import { Organization, UserSession, OrganizationMember, AuditLog, PermissionDefinition, UserRole } from '@/types/auth';
import { createAuditLogEntry } from '@/lib/audit';

// Feature Views
import { OverviewView } from '@/features/overview/OverviewView';
import { SaasAppsView } from '@/features/saas-apps/SaasAppsView';
import { ActiveSessionsView } from '@/features/sessions/ActiveSessionsView';
import { RbacMatrixView } from '@/features/rbac/RbacMatrixView';
import { MembersView } from '@/features/members/MembersView';
import { TwoFactorView } from '@/features/two-factor/TwoFactorView';
import { AuditLogsView } from '@/features/audit-logs/AuditLogsView';
import { SsoScimView } from '@/features/sso/SsoScimView';
import { PasskeysView } from '@/features/passkeys/PasskeysView';
import { WebhooksView } from '@/features/webhooks/WebhooksView';
import { SdkIntegrationView } from '@/features/sdk/SdkIntegrationView';
import { ApiKeysView } from '@/features/api-keys/ApiKeysView';

// UI Icons
import {
  Shield,
  Users,
  Smartphone,
  KeyRound,
  FileText,
  ChevronDown,
  LayoutDashboard,
  Search,
  Bell,
  Key,
  LogOut,
  Fingerprint,
  Building2,
  Webhook,
  Terminal,
  Layers,
  CheckCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CommandPaletteModal } from '@/components/CommandPaletteModal';

export default function EnterpriseAuthApp() {
  // Multi-Tenant State
  const [organizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeOrg, setActiveOrg] = useState<Organization>(INITIAL_ORGANIZATIONS[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Tenant-Scoped Data Stores
  const initialTenantData = TENANT_DATA_STORE[INITIAL_ORGANIZATIONS[0].id];
  const [currentUser, setCurrentUser] = useState(initialTenantData.members[0].user);
  const [members, setMembers] = useState<OrganizationMember[]>(initialTenantData.members);
  const [sessions, setSessions] = useState<UserSession[]>(initialTenantData.sessions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialTenantData.auditLogs);
  const [permissions, setPermissions] = useState<PermissionDefinition[]>(RBAC_PERMISSIONS_MATRIX);

  // Popovers
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'New login from London, UK', desc: 'Mobile Safari on iOS 18.2', time: '12m ago', unread: true },
    { id: 'n2', title: 'Okta SCIM Sync Completed', desc: 'Enterprise directory seats synchronized', time: '42m ago', unread: true },
    { id: 'n3', title: '2FA Policy updated', desc: 'Mandatory 2FA enforced for all organization members', time: '1h ago', unread: false },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Multi-Tenant Context Switcher
  const handleSwitchOrganization = (orgId: string) => {
    const selectedOrg = organizations.find(o => o.id === orgId);
    if (!selectedOrg) return;

    setActiveOrg(selectedOrg);

    const tenantData = TENANT_DATA_STORE[orgId];
    if (tenantData) {
      setMembers(tenantData.members);
      setSessions(tenantData.sessions);
      setAuditLogs(tenantData.auditLogs);
      setCurrentUser(tenantData.members[0].user);
    }

    const switchLog = createAuditLogEntry({
      organizationId: selectedOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: 'tenant.context.switched',
      targetResource: `organization:${selectedOrg.slug}`,
      severity: 'INFO',
      metadata: { target_organization: selectedOrg.name, plan: selectedOrg.plan }
    });
    setAuditLogs(prev => [switchLog, ...prev]);
  };

  // Notifications
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleMarkAllUnread = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: true })));
  };

  const handleToggleSingleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n)
    );
  };

  // Sessions
  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, isRevoked: true } : s)
    );

    const revokedSession = sessions.find(s => s.id === sessionId);
    const newLog = createAuditLogEntry({
      organizationId: activeOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: 'security.session.revoked',
      targetResource: `user_session:${sessionId}`,
      severity: 'WARNING',
      metadata: {
        browser: revokedSession?.browser,
        ip_address: revokedSession?.ipAddress,
        city: revokedSession?.city
      }
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRevokeAllOther = () => {
    setSessions(prev =>
      prev.map(s => s.isCurrent ? s : { ...s, isRevoked: true })
    );

    const newLog = createAuditLogEntry({
      organizationId: activeOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: 'security.session.revoked_all_other',
      targetResource: `user:${currentUser.id}`,
      severity: 'CRITICAL',
      metadata: { action: 'emergency_bulk_revocation', affected_count: sessions.length - 1 }
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // RBAC
  const handleTogglePermission = (permissionId: string, role: 'owner' | 'admin' | 'member' | 'viewer') => {
    if (role === 'owner') return;

    setPermissions(prev =>
      prev.map(p => {
        if (p.id === permissionId) {
          const updatedVal = !p.roles[role];
          const newLog = createAuditLogEntry({
            organizationId: activeOrg.id,
            actorId: currentUser.id,
            actorEmail: currentUser.email,
            actorName: currentUser.fullName,
            event: 'rbac.permission.matrix_updated',
            targetResource: `permission:${permissionId}`,
            severity: 'WARNING',
            metadata: { permission: p.name, role, previous_state: p.roles[role], new_state: updatedVal }
          });
          setAuditLogs(l => [newLog, ...l]);
          return {
            ...p,
            roles: {
              ...p.roles,
              [role]: updatedVal
            }
          };
        }
        return p;
      })
    );
  };

  // Members
  const handleInviteMember = (email: string, role: UserRole) => {
    const newMember: OrganizationMember = {
      id: `mem_${Date.now()}`,
      organizationId: activeOrg.id,
      userId: `usr_${Date.now()}`,
      user: {
        id: `usr_${Date.now()}`,
        email,
        fullName: email.split('@')[0].replace('.', ' '),
        avatarUrl: `https://avatar.vercel.sh/${email}.svg`,
        isEmailVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString()
      },
      role,
      joinedAt: new Date().toISOString()
    };
    setMembers(prev => [newMember, ...prev]);

    const newLog = createAuditLogEntry({
      organizationId: activeOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: 'members.invite.sent',
      targetResource: `invite:${email}`,
      severity: 'INFO',
      metadata: { email, assigned_role: role }
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleChangeRole = (memberId: string, newRole: UserRole) => {
    setMembers(prev =>
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );
    const targetMember = members.find(m => m.id === memberId);
    const newLog = createAuditLogEntry({
      organizationId: activeOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: 'members.role.updated',
      targetResource: `member:${memberId}`,
      severity: 'WARNING',
      metadata: { target_email: targetMember?.user.email, previous_role: targetMember?.role, new_role: newRole }
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 2FA
  const handleToggle2FA = (enable: boolean) => {
    setCurrentUser(prev => ({ ...prev, twoFactorEnabled: enable }));
    setMembers(prev =>
      prev.map(m => m.userId === currentUser.id ? {
        ...m,
        user: { ...m.user, twoFactorEnabled: enable }
      } : m)
    );

    const newLog = createAuditLogEntry({
      organizationId: activeOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: enable ? 'security.2fa.totp_activated' : 'security.2fa.totp_disabled',
      targetResource: `user:${currentUser.id}`,
      severity: enable ? 'INFO' : 'CRITICAL',
      metadata: { algorithm: 'TOTP_SHA1_30S' }
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleEnforce2FA = () => {
    setActiveOrg(prev => ({ ...prev, enforce2FA: true }));
    const newLog = createAuditLogEntry({
      organizationId: activeOrg.id,
      actorId: currentUser.id,
      actorEmail: currentUser.email,
      actorName: currentUser.fullName,
      event: 'security.policy.enforce_2fa_enabled',
      targetResource: `organization:${activeOrg.id}`,
      severity: 'WARNING',
      metadata: { organization_name: activeOrg.name }
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* 1. DEEP DARK ENTERPRISE NAVY SIDEBAR */}
      <aside className="w-64 bg-[#0A1128] border-r border-[#1C2541] flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-50">
        <div className="flex flex-col">
          {/* Top Brand Logo & App Identity */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#1C2541] bg-[#070D1F]">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/app-icon.png"
                alt="Logo"
                className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0 border border-blue-500/30"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center leading-tight">
                  <span className="text-[12px] font-extrabold text-white tracking-tight">Enterprise</span>
                </div>
                <div className="flex items-center gap-1 leading-tight mt-0.5">
                  <span className="text-[11px] font-bold text-slate-300">Authentication</span>
                  <span className="text-[8px] font-extrabold text-white bg-blue-600 px-1 py-0.2 rounded leading-none">
                    SaaS
                  </span>
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-[#141E3C] border border-[#23315D] rounded shrink-0">
              v2.4
            </span>
          </div>

          {/* Navigation Categories */}
          <div className="p-3 space-y-4 overflow-y-auto">
            {/* Category 1: Identity & Access */}
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Identity & Access
              </div>

              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'saas-apps', label: 'SaaS Apps', icon: Layers, badge: '7' },
                { id: 'members', label: 'Users', icon: Users, badge: `${members.length}` },
                { id: 'rbac', label: 'Roles', icon: ShieldCheck },
                { id: 'sso-scim', label: 'SSO', icon: Building2, badge: 'Okta' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-[#141E3C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-[#141E3C] text-slate-300 border border-[#23315D]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Category 2: Security & Zero-Trust */}
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Security & Zero-Trust
              </div>

              {[
                { id: 'sessions', label: 'Sessions', icon: Smartphone, badge: `${sessions.filter(s => !s.isRevoked).length}` },
                { id: 'passkeys', label: 'Passkeys', icon: Fingerprint },
                { id: '2fa', label: '2FA', icon: KeyRound, badgePill: currentUser.twoFactorEnabled ? 'Active' : 'Pending', isSuccess: currentUser.twoFactorEnabled },
                { id: 'audit-logs', label: 'Audit Logs', icon: FileText, badge: `${auditLogs.length}` },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-[#141E3C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-[#141E3C] text-slate-300 border border-[#23315D]'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.badgePill && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        item.isSuccess ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60' : 'bg-amber-900/80 text-amber-300 border border-amber-700/60'
                      }`}>
                        {item.badgePill}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Category 3: Developer Platform */}
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Developer Platform
              </div>

              {[
                { id: 'api-keys', label: 'API Keys', icon: Key },
                { id: 'webhooks', label: 'Webhooks', icon: Webhook },
                { id: 'sdk', label: 'SDKs', icon: Terminal },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-[#141E3C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: SOC2 Compliance & Open-Source Status */}
        <div className="p-3.5 border-t border-[#1C2541] bg-[#070D1F]/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-medium text-slate-300">SOC2 Type II</span>
            </div>
            <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Open-Source
            </span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
          {/* Left: Organization Tenant Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider hidden sm:inline">
              Tenant:
            </span>
            <div className="relative group">
              <select
                value={activeOrg.id}
                onChange={(e) => handleSwitchOrganization(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg pl-3 pr-8 py-1.5 focus:outline-hidden focus:border-blue-600 transition-colors cursor-pointer"
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.plan})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Center / Right: Global Actions, Notifications & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center justify-between w-56 px-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-xs font-medium text-slate-500">Search...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded-md text-slate-400 shadow-2xs leading-none">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadCount > 0 ? (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                        >
                          <CheckCheck className="w-3 h-3" />
                          Mark read
                        </button>
                      ) : (
                        <button
                          onClick={handleMarkAllUnread}
                          className="text-[11px] text-slate-600 hover:text-slate-800 flex items-center gap-1 font-semibold"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Mark unread
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleToggleSingleNotification(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2.5 ${n.unread ? 'bg-blue-50/40' : ''}`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-blue-600' : 'bg-transparent border border-slate-300'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <span className={`text-xs text-slate-800 ${n.unread ? 'font-bold' : 'font-medium'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.fullName}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                        Tenant Owner
                      </span>
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                        2FA Active
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('overview');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                      Overview
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('sessions');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      Active Sessions ({sessions.filter(s => !s.isRevoked).length})
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('2fa');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                      Security & 2FA
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        localStorage.removeItem('ea_access_token');
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* VIEW MAIN BODY CANVAS */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full">
          {activeTab === 'overview' && (
            <OverviewView
              organization={activeOrg}
              sessions={sessions}
              members={members}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onEnforce2FA={handleEnforce2FA}
            />
          )}

          {activeTab === 'saas-apps' && (
            <SaasAppsView />
          )}

          {activeTab === 'members' && (
            <MembersView
              members={members}
              onInviteMember={handleInviteMember}
              onChangeRole={handleChangeRole}
            />
          )}

          {activeTab === 'rbac' && (
            <RbacMatrixView
              permissions={permissions}
              onTogglePermission={handleTogglePermission}
            />
          )}

          {activeTab === 'sso-scim' && (
            <SsoScimView />
          )}

          {activeTab === 'sessions' && (
            <ActiveSessionsView
              sessions={sessions}
              onRevokeSession={handleRevokeSession}
              onRevokeAllOther={handleRevokeAllOther}
            />
          )}

          {activeTab === 'passkeys' && (
            <PasskeysView />
          )}

          {activeTab === '2fa' && (
            <TwoFactorView
              is2FAEnabled={currentUser.twoFactorEnabled}
              onToggle2FA={handleToggle2FA}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogsView auditLogs={auditLogs} />
          )}

          {activeTab === 'api-keys' && (
            <ApiKeysView />
          )}

          {activeTab === 'webhooks' && (
            <WebhooksView />
          )}

          {activeTab === 'sdk' && (
            <SdkIntegrationView />
          )}
        </main>
      </div>

      {/* 3. GLOBAL COMMAND PALETTE (⌘K MODAL) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onSelectOrg={(orgId) => handleSwitchOrganization(orgId)}
      />
    </div>
  );
}
