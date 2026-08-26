'use client';

import React, { useState } from 'react';
import { Organization, UserSession, OrganizationMember, AuditLog } from '@/types/auth';
import {
  Users,
  Smartphone,
  KeyRound,
  FileText,
  Building2,
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

  // Concise, Clean Activity Events
  const recentActivities = [
    { id: '1', title: 'Alex Morgan signed in', desc: 'Chrome on macOS • London, UK', time: '12m ago' },
    { id: '2', title: '2FA Policy updated', desc: 'Mandatory 2FA active across workspace', time: '1h ago' },
    { id: '3', title: 'Sarah Connor promoted to Admin', desc: 'Updated by Organization Owner', time: '3h ago' },
  ];

  return (
    <div className="space-y-5">
      {/* 1. CLEAN ENTERPRISE STATUS BANNER */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-100 shrink-0">
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
              <span className="absolute text-xs font-bold font-mono text-slate-900">
                {healthScore}%
              </span>
            </div>

            {/* Status Title & Badges */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-900">
                  Security Posture: {healthScore >= 95 ? 'Excellent' : 'Good'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SOC2 Compliant
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {organization.plan}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                All identity systems and sessions operating normally
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              View Report
            </button>

            {!organization.enforce2FA && (
              <button
                onClick={onEnforce2FA}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
              >
                Enforce 2FA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. 4 MINIMALIST KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Team Members */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Team Members</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">{members.length}</div>
            <span className="text-[11px] text-slate-500 font-medium">
              {members.filter(m => m.role === 'admin' || m.role === 'owner').length} Admins
            </span>
          </div>
        </div>

        {/* Card 2: Active Devices */}
        <div
          onClick={() => onNavigateTab('sessions')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Devices</span>
            <Smartphone className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">{activeSessionsCount}</div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Online
            </span>
          </div>
        </div>

        {/* Card 3: 2FA Protection */}
        <div
          onClick={() => onNavigateTab('2fa')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">2FA Protection</span>
            <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">{mfaPercentage}%</div>
            <span className="text-[11px] text-slate-500 font-medium">
              {mfaEnabledCount}/{members.length} Protected
            </span>
          </div>
        </div>

        {/* Card 4: SSO Integration */}
        <div
          onClick={() => onNavigateTab('sso-scim')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Single Sign-On</span>
            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-lg font-bold text-slate-900">Okta SSO</div>
            <span className="text-[11px] font-semibold text-emerald-600">Connected</span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
          Quick Actions
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('members')}
            className="flex items-center gap-2.5 p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-300 rounded-2xl text-xs font-bold text-slate-800 transition-all text-left shadow-xs group"
          >
            <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Invite Member</span>
          </button>

          <button
            onClick={() => onNavigateTab('sso-scim')}
            className="flex items-center gap-2.5 p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-300 rounded-2xl text-xs font-bold text-slate-800 transition-all text-left shadow-xs group"
          >
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Connect SSO</span>
          </button>

          <button
            onClick={() => onNavigateTab('passkeys')}
            className="flex items-center gap-2.5 p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-300 rounded-2xl text-xs font-bold text-slate-800 transition-all text-left shadow-xs group"
          >
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Add Passkey</span>
          </button>

          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="flex items-center gap-2.5 p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-300 rounded-2xl text-xs font-bold text-slate-800 transition-all text-left shadow-xs group"
          >
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">View Logs</span>
          </button>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recent Activity
          </div>
          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            View all →
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          {recentActivities.map((act) => (
            <div key={act.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Security Posture Breakdown</h3>
              <button
                onClick={() => setShowHealthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>SOC2 Type II Compliance</span>
                <span className="text-emerald-600 font-bold">100% Passed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Two-Factor Authentication</span>
                <span className="text-blue-600 font-bold">{mfaPercentage}% Active</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Single Sign-On (IdP)</span>
                <span className="text-emerald-600 font-bold">Connected</span>
              </div>
            </div>

            <button
              onClick={() => setShowHealthModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
