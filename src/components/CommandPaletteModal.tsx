'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  Smartphone,
  Fingerprint,
  KeyRound,
  FileText,
  Key,
  Webhook,
  Terminal,
  Layers,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onSelectOrg: (orgId: string) => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectTab,
  onSelectOrg
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigationItems = [
    { id: 'overview', name: 'Overview Dashboard', category: 'Identity & Access', icon: LayoutDashboard },
    { id: 'saas-apps', name: 'SaaS App Governance & Shadow IT', category: 'Identity & Access', icon: Layers },
    { id: 'members', name: 'Team Members & Directory', category: 'Identity & Access', icon: Users },
    { id: 'rbac', name: 'Roles & RBAC Matrix', category: 'Identity & Access', icon: Shield },
    { id: 'sso-scim', name: 'Enterprise SSO & SCIM Sync', category: 'Identity & Access', icon: Building2 },
    { id: 'sessions', name: 'Active Sessions & Device Revocation', category: 'Security & Zero-Trust', icon: Smartphone },
    { id: 'passkeys', name: 'Passkeys & FIDO2 WebAuthn', category: 'Security & Zero-Trust', icon: Fingerprint },
    { id: '2fa', name: 'Two-Factor Authentication (2FA / TOTP)', category: 'Security & Zero-Trust', icon: KeyRound },
    { id: 'audit-logs', name: 'Compliance Audit Logs', category: 'Security & Zero-Trust', icon: FileText },
    { id: 'api-keys', name: 'API Keys & Machine Access', category: 'Developer Platform', icon: Key },
    { id: 'webhooks', name: 'Webhooks & Event Subscriptions', category: 'Developer Platform', icon: Webhook },
    { id: 'sdk', name: 'Developer SDKs & API Sandbox', category: 'Developer Platform', icon: Terminal },
  ];

  const organizations = [
    { id: 'org_01H9A_ACME', name: 'Switch to Acme Global Technologies' },
    { id: 'org_02H9A_CYBER', name: 'Switch to CyberDyne Defense AI' },
    { id: 'org_03H9A_STRIPE_EU', name: 'Switch to Stripe Payments EU Gateway' },
  ];

  const filteredNav = navigationItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden space-y-0">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 relative">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, feature, or organization..."
            className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Navigation Items */}
          {filteredNav.length > 0 && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation & Views
              </div>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Organizations */}
          {filteredOrgs.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Multi-Tenant Workspaces
              </div>
              {filteredOrgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    onSelectOrg(org.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span>{org.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}

          {filteredNav.length === 0 && filteredOrgs.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching commands or resources found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>Navigate: <kbd className="px-1 bg-white border border-slate-200 rounded">↑</kbd> <kbd className="px-1 bg-white border border-slate-200 rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 bg-white border border-slate-200 rounded">↵</kbd></span>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-600">Enterprise Auth Command Engine</span>
        </div>
      </div>
    </div>
  );
}
