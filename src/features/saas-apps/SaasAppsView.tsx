'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  User,
  X,
  Plus,
  ShieldAlert
} from 'lucide-react';

export interface SaasApp {
  id: string;
  name: string;
  category: string;
  logo: string;
  status: 'APPROVED' | 'UNAPPROVED' | 'RESTRICTED';
  authMethod: string;
  connectedUsersCount: number;
  lastUsedAt: string;
  discoveredAt: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  users: {
    name: string;
    email: string;
    loginMethod: string;
    lastLogin: string;
  }[];
  scopes: string[];
}

const INITIAL_SAAS_APPS: SaasApp[] = [
  {
    id: 'app_claude',
    name: 'Anthropic Claude Enterprise',
    category: 'AI & LLM Infrastructure',
    logo: 'https://avatar.vercel.sh/anthropic.svg?text=AN',
    status: 'APPROVED',
    authMethod: 'SAML 2.0 SSO',
    connectedUsersCount: 14,
    lastUsedAt: '12m ago',
    discoveredAt: 'Aug 10, 2026',
    riskScore: 'LOW',
    scopes: ['openid', 'email', 'profile', 'org.ai.access'],
    users: [
      { name: 'Alex Rivera', email: 'alex.rivera@acme.corp', loginMethod: 'SAML 2.0 SSO', lastLogin: '12m ago' },
      { name: 'Sarah Chen', email: 'sarah.chen@acme.corp', loginMethod: 'SAML 2.0 SSO', lastLogin: '1h ago' },
      { name: 'Johnny Test', email: 'johnny.test@acme.corp', loginMethod: 'Google OAuth', lastLogin: '3h ago' },
    ]
  },
  {
    id: 'app_github',
    name: 'GitHub Enterprise Cloud',
    category: 'DevOps & Source Control',
    logo: 'https://avatar.vercel.sh/github.svg?text=GH',
    status: 'APPROVED',
    authMethod: 'SCIM Sync',
    connectedUsersCount: 28,
    lastUsedAt: '2m ago',
    discoveredAt: 'Jan 15, 2026',
    riskScore: 'LOW',
    scopes: ['repo', 'read:org', 'user:email', 'workflow'],
    users: [
      { name: 'Alex Rivera', email: 'alex.rivera@acme.corp', loginMethod: 'SCIM Provisioned', lastLogin: '2m ago' },
      { name: 'Marcus Vance', email: 'marcus.vance@acme.corp', loginMethod: 'SCIM Provisioned', lastLogin: '45m ago' },
    ]
  },
  {
    id: 'app_chatgpt',
    name: 'OpenAI ChatGPT Team',
    category: 'AI & Research (Shadow IT)',
    logo: 'https://avatar.vercel.sh/openai.svg?text=OA',
    status: 'UNAPPROVED',
    authMethod: 'Google OAuth',
    connectedUsersCount: 3,
    lastUsedAt: '2h ago',
    discoveredAt: 'Yesterday',
    riskScore: 'HIGH',
    scopes: ['openid', 'email', 'user.profile'],
    users: [
      { name: 'Bobby Test', email: 'bobby.test@acme.corp', loginMethod: 'Google OAuth', lastLogin: '2h ago' },
      { name: 'Johnny Test', email: 'johnny.test@acme.corp', loginMethod: 'Google OAuth', lastLogin: 'Yesterday' },
    ]
  },
  {
    id: 'app_aws',
    name: 'AWS Management Console',
    category: 'Cloud Infrastructure',
    logo: 'https://avatar.vercel.sh/aws.svg?text=AWS',
    status: 'APPROVED',
    authMethod: 'SAML 2.0 SSO',
    connectedUsersCount: 8,
    lastUsedAt: '15m ago',
    discoveredAt: 'Feb 01, 2026',
    riskScore: 'LOW',
    scopes: ['arn:aws:iam::role/AdminAccess', 'sts:AssumeRoleWithSAML'],
    users: [
      { name: 'Alex Rivera', email: 'alex.rivera@acme.corp', loginMethod: 'SAML 2.0 + MFA', lastLogin: '15m ago' },
    ]
  },
  {
    id: 'app_slack',
    name: 'Slack Enterprise Grid',
    category: 'Team Communication',
    logo: 'https://avatar.vercel.sh/slack.svg?text=SL',
    status: 'APPROVED',
    authMethod: 'SCIM Sync',
    connectedUsersCount: 42,
    lastUsedAt: 'Just now',
    discoveredAt: 'Jan 01, 2026',
    riskScore: 'LOW',
    scopes: ['users:read', 'channels:read', 'chat:write'],
    users: [
      { name: 'Sarah Chen', email: 'sarah.chen@acme.corp', loginMethod: 'SCIM Provisioned', lastLogin: 'Just now' },
      { name: 'Elena Rostova', email: 'elena.rostova@acme.corp', loginMethod: 'SCIM Provisioned', lastLogin: '10m ago' },
    ]
  },
  {
    id: 'app_figma',
    name: 'Figma Enterprise',
    category: 'Design Systems',
    logo: 'https://avatar.vercel.sh/figma.svg?text=FG',
    status: 'APPROVED',
    authMethod: 'SAML 2.0 SSO',
    connectedUsersCount: 12,
    lastUsedAt: '1h ago',
    discoveredAt: 'Mar 12, 2026',
    riskScore: 'LOW',
    scopes: ['files:read', 'projects:read', 'user:read'],
    users: [
      { name: 'Elena Rostova', email: 'elena.rostova@acme.corp', loginMethod: 'SAML 2.0 SSO', lastLogin: '1h ago' },
    ]
  },
  {
    id: 'app_grammarly',
    name: 'Grammarly Extension',
    category: 'Text Scraper Plugin',
    logo: 'https://avatar.vercel.sh/grammarly.svg?text=GR',
    status: 'RESTRICTED',
    authMethod: 'Google OAuth',
    connectedUsersCount: 1,
    lastUsedAt: '3d ago',
    discoveredAt: 'Aug 18, 2026',
    riskScore: 'HIGH',
    scopes: ['input:read', 'storage:write'],
    users: [
      { name: 'Johnny Test', email: 'johnny.test@acme.corp', loginMethod: 'Google OAuth (Blocked)', lastLogin: '3d ago' },
    ]
  }
];

export function SaasAppsView() {
  const [apps, setApps] = useState<SaasApp[]>(INITIAL_SAAS_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'UNAPPROVED' | 'RESTRICTED'>('ALL');
  const [selectedApp, setSelectedApp] = useState<SaasApp | null>(null);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (appId: string, newStatus: 'APPROVED' | 'UNAPPROVED' | 'RESTRICTED') => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const approvedCount = apps.filter(a => a.status === 'APPROVED').length;
  const unapprovedCount = apps.filter(a => a.status === 'UNAPPROVED').length;
  const restrictedCount = apps.filter(a => a.status === 'RESTRICTED').length;

  return (
    <div className="space-y-4">
      {/* 1. Header with Compact Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">SaaS App Governance</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {apps.length} Connected
          </span>
        </div>

        <button
          onClick={() => alert('Connect New Enterprise SaaS Connector')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Connector</span>
        </button>
      </div>

      {/* 2. Micro-Metric KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Total SaaS
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 mt-0.5">
            {apps.length}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Discovered apps</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider">
            Approved
          </div>
          <div className="text-lg font-mono font-bold text-emerald-700 mt-0.5">
            {approvedCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">SSO / SCIM active</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider">
            Unapproved
          </div>
          <div className="text-lg font-mono font-bold text-amber-700 mt-0.5">
            {unapprovedCount}
          </div>
          <div className="text-[10px] text-amber-600 font-medium">Requires triage</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">
            Restricted
          </div>
          <div className="text-lg font-mono font-bold text-red-700 mt-0.5">
            {restrictedCount}
          </div>
          <div className="text-[10px] text-red-600 font-medium">Blocked tokens</div>
        </div>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-2 border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {(['ALL', 'APPROVED', 'UNAPPROVED', 'RESTRICTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* 4. Pixel-Perfect High-Density Table with Strict Column Widths */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3.5 w-[38%]">Application</th>
                <th className="py-2.5 px-3.5 w-[18%]">Status</th>
                <th className="py-2.5 px-3.5 w-[18%]">Auth Protocol</th>
                <th className="py-2.5 px-3.5 w-[12%]">Seats</th>
                <th className="py-2.5 px-3.5 w-[14%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApps.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* App Info */}
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={app.logo}
                        alt={app.name}
                        className="w-7 h-7 rounded-lg border border-slate-200 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate flex items-center gap-1.5">
                          <span className="truncate">{app.name}</span>
                          {app.riskScore === 'HIGH' && (
                            <span className="shrink-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-red-50 text-red-600 border border-red-200">
                              High Risk
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{app.category}</div>
                      </div>
                    </div>
                  </td>

                  {/* Governance Status */}
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : app.status === 'UNAPPROVED'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {app.status === 'APPROVED' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                      {app.status === 'UNAPPROVED' && <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />}
                      {app.status === 'RESTRICTED' && <XCircle className="w-2.5 h-2.5 text-red-600" />}
                      {app.status}
                    </span>
                  </td>

                  {/* Auth Method (No wrap) */}
                  <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-700 font-medium">
                    {app.authMethod}
                  </td>

                  {/* Connected Seats */}
                  <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    {app.connectedUsersCount} users
                  </td>

                  {/* Inspect Action */}
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 transition-colors"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No applications found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Slide-Over Inspector Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 p-5 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedApp.logo}
                  alt={selectedApp.name}
                  className="w-9 h-9 rounded-lg border border-slate-200 object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{selectedApp.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedApp.category}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Governance Status Switcher */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-900">Governance Policy Control</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                    selectedApp.status === 'APPROVED'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Approve
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'UNAPPROVED')}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                    selectedApp.status === 'UNAPPROVED'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Unapproved
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'RESTRICTED')}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                    selectedApp.status === 'RESTRICTED'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Block
                </button>
              </div>
            </div>

            {/* Granted Scopes */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-900">Granted Scopes</div>
              <div className="flex flex-wrap gap-1">
                {selectedApp.scopes.map((scope) => (
                  <span
                    key={scope}
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>

            {/* Connected User Accounts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-900">
                  Connected Users ({selectedApp.users.length})
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Last 30 Days</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {selectedApp.users.map((u) => (
                  <div key={u.email} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                    </div>
                    <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[9px] font-mono font-bold rounded">
                      {u.loginMethod}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revoke All Tokens Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`All active tokens for ${selectedApp.name} have been revoked.`);
                  setSelectedApp(null);
                }}
                className="w-full py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                Revoke All Tokens for {selectedApp.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
