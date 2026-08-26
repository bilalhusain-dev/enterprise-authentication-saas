'use client';

import React, { useState } from 'react';
import { Organization, UserSession, OrganizationMember, AuditLog } from '@/types/auth';
import {
  ShieldCheck,
  Users,
  Smartphone,
  KeyRound,
  FileText,
  Building2,
  ArrowUpRight,
  UserPlus,
  Lock,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';

interface Props {
  organization: Organization;
  sessions: UserSession[];
  members: OrganizationMember[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: string) => void;
  onEnforce2FA: () => void;
}

export function OverviewView({
  organization,
  sessions,
  members,
  auditLogs,
  onNavigateTab,
  onEnforce2FA
}: Props) {
  const [showHealthModal, setShowHealthModal] = useState(false);

  const activeSessionsCount = sessions.filter(s => !s.isRevoked).length;
  const mfaEnabledCount = members.filter(m => m.user.twoFactorEnabled).length;
  const mfaPercentage = Math.round((mfaEnabledCount / (members.length || 1)) * 100);

  const healthScore = organization.slug === 'cyberdyne-ai' ? 100 : organization.slug === 'stripe-eu' ? 92 : 98;

  // Clean Human-Readable Activity Events
  const recentActivities = [
    { id: '1', title: 'Alex Morgan signed in', desc: 'Chrome on macOS • London, UK', time: '12m ago', isSuccess: true },
    { id: '2', title: '2FA Policy updated', desc: 'Mandatory 2FA enforced for all workspace members', time: '1h ago', isSuccess: true },
    { id: '3', title: 'Sarah Connor role changed to Admin', desc: 'Permissions updated by Organization Owner', time: '3h ago', isSuccess: true },
  ];

  return (
    <div className="space-y-4">
      {/* 1. CLEAN ENTERPRISE SECURITY STATUS BANNER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* SVG Score Dial */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-200 shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${healthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold font-mono text-slate-900">
                {healthScore}%
              </span>
            </div>

            {/* Clean Status & Organization Info */}
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs font-bold text-slate-900">
                  Security Posture: {healthScore >= 95 ? 'Excellent' : 'Good'}
                </h2>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SOC2 Compliant
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {organization.plan} Plan
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {organization.name} • All identity systems and sessions operating normally
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              View Report
            </button>

            {!organization.enforce2FA && (
              <button
                onClick={onEnforce2FA}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
              >
                Enforce 2FA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. 4 CLEAN KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Team Members */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Team Members
            </span>
            <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono text-slate-900">{members.length}</div>
            <span className="text-[10px] text-slate-500 font-medium">
              {members.filter(m => m.role === 'admin' || m.role === 'owner').length} Admins
            </span>
          </div>

          <div className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 pt-1 border-t border-slate-100">
            <span>Manage users</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Card 2: Active Devices */}
        <div
          onClick={() => onNavigateTab('sessions')}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Active Devices
            </span>
            <Smartphone className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono text-slate-900">{activeSessionsCount}</div>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Online
            </span>
          </div>

          <div className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 pt-1 border-t border-slate-100">
            <span>View devices</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Card 3: 2FA Protection */}
        <div
          onClick={() => onNavigateTab('2fa')}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              2FA Protection
            </span>
            <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono text-slate-900">{mfaPercentage}%</div>
            <span className="text-[10px] text-slate-500 font-medium">
              {mfaEnabledCount}/{members.length} Protected
            </span>
          </div>

          <div className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 pt-1 border-t border-slate-100">
            <span>Security settings</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Card 4: SSO Integration */}
        <div
          onClick={() => onNavigateTab('sso-scim')}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Single Sign-On
            </span>
            <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-lg font-bold text-slate-900">Okta SSO</div>
            <span className="text-[10px] font-semibold text-emerald-600">Connected</span>
          </div>

          <div className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 pt-1 border-t border-slate-100">
            <span>Configure SSO</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Quick Actions
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigateTab('members')}
            className="flex items-center gap-2.5 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-left shadow-2xs group"
          >
            <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Invite Member</span>
          </button>

          <button
            onClick={() => onNavigateTab('sso-scim')}
            className="flex items-center gap-2.5 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-left shadow-2xs group"
          >
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Connect SSO</span>
          </button>

          <button
            onClick={() => onNavigateTab('passkeys')}
            className="flex items-center gap-2.5 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-left shadow-2xs group"
          >
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Add Passkey</span>
          </button>

          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="flex items-center gap-2.5 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-left shadow-2xs group"
          >
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">View Logs</span>
          </button>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY STREAM (Human-Readable) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recent Activity
          </div>
          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-bold"
          >
            View all →
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          {recentActivities.map((act) => (
            <div key={act.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{act.title}</div>
                  <div className="text-[11px] text-slate-500 truncate">{act.desc}</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium shrink-0">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Breakdown Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Security Audit Report</h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Password Encryption</div>
                  <div className="text-[11px] text-slate-500">Industry-standard cryptographic hashing</div>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Protected</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Two-Factor Authentication</div>
                  <div className="text-[11px] text-slate-500">Biometric & Authenticator app support</div>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Active</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Session Security</div>
                  <div className="text-[11px] text-slate-500">Real-time device tracking & remote logout</div>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Active</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Directory Sync (SSO)</div>
                  <div className="text-[11px] text-slate-500">Automated employee onboarding</div>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Connected</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHealthModal(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
