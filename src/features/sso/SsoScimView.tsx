'use client';

import React, { useState } from 'react';
import {
  Building2,
  RefreshCw,
  CheckCircle2,
  Plus,
  Copy,
  Check,
  X
} from 'lucide-react';

interface IdPDirectory {
  id: string;
  provider: string;
  domain: string;
  status: 'SYNCED' | 'IDLE' | 'CONFIGURING';
  syncedUsers: number;
  lastSync: string;
  protocol: string;
}

export function SsoScimView() {
  const [directories, setDirectories] = useState<IdPDirectory[]>([
    {
      id: 'scim_okta_01',
      provider: 'Okta Enterprise SSO',
      domain: 'acmecorp.okta.com',
      status: 'SYNCED',
      syncedUsers: 142,
      lastSync: '4m ago',
      protocol: 'SAML 2.0 + SCIM v2.0',
    },
    {
      id: 'scim_azure_02',
      provider: 'Microsoft Entra ID (Azure AD)',
      domain: 'login.microsoftonline.com/acme',
      status: 'SYNCED',
      syncedUsers: 89,
      lastSync: '12m ago',
      protocol: 'OIDC + SCIM v2.0',
    },
    {
      id: 'scim_google_03',
      provider: 'Google Workspace',
      domain: 'workspace.google.com/acme.com',
      status: 'IDLE',
      syncedUsers: 0,
      lastSync: 'Pending setup',
      protocol: 'SAML 2.0',
    }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('Okta');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // SCIM & SAML parameters
  const scimUrl = 'https://api.ea-auth.com/scim/v2/org_01H9A_ACME';
  const scimBearer = 'scim_bearer_sec_9f82194a820c74b291848bc1029';
  const samlAcsUrl = 'https://api.ea-auth.com/sso/saml/acs/org_01H9A_ACME';
  const samlEntityId = 'https://api.ea-auth.com/sso/saml/metadata/org_01H9A_ACME';

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setDirectories(prev => prev.map(d => ({ ...d, lastSync: 'Just now', syncedUsers: d.syncedUsers + 1 })));
      setToastMsg('SCIM directory synchronization completed.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 1000);
  };

  const handleConnectProvider = (e: React.FormEvent) => {
    e.preventDefault();
    const newDir: IdPDirectory = {
      id: `scim_${Date.now()}`,
      provider: `${selectedProvider} SSO`,
      domain: `${selectedProvider.toLowerCase()}.identity.corp`,
      status: 'SYNCED',
      syncedUsers: 18,
      lastSync: 'Just now',
      protocol: 'SAML 2.0 + SCIM v2.0',
    };

    setDirectories(prev => [newDir, ...prev]);
    setShowConnectModal(false);
    setToastMsg(`Linked ${selectedProvider} Identity Provider.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header with Compact Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Single Sign-On (SSO) & SCIM</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {directories.length} Directories
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect IdP</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 2. Identity Provider Directories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {directories.map((d) => (
          <div key={d.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{d.provider}</h3>
                <span className="text-[10px] font-mono text-slate-400">{d.protocol}</span>
              </div>
              <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full border ${
                d.status === 'SYNCED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {d.status}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-600 truncate bg-slate-50 px-2 py-1 rounded border border-slate-200">
              {d.domain}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100 font-mono">
              <span className="font-bold text-slate-800">{d.syncedUsers} Users</span>
              <span className="text-[10px] text-slate-400 font-sans font-medium">{d.lastSync}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. SSO & SCIM Provisioning Endpoints */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
        <div className="text-xs font-bold text-slate-900">
          Provisioning Endpoints & Secrets
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-bold">SCIM BASE URL</span>
              <button
                onClick={() => handleCopy(scimUrl, 'scim_url')}
                className="text-blue-600 hover:text-blue-700 font-sans text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedField === 'scim_url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === 'scim_url' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <span className="text-blue-700 font-bold truncate block">{scimUrl}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-bold">SCIM BEARER TOKEN</span>
              <button
                onClick={() => handleCopy(scimBearer, 'scim_token')}
                className="text-blue-600 hover:text-blue-700 font-sans text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedField === 'scim_token' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === 'scim_token' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <span className="text-slate-800 font-bold truncate block">{scimBearer}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-bold">SAML ACS URL</span>
              <button
                onClick={() => handleCopy(samlAcsUrl, 'saml_acs')}
                className="text-blue-600 hover:text-blue-700 font-sans text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedField === 'saml_acs' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === 'saml_acs' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <span className="text-slate-800 font-bold truncate block">{samlAcsUrl}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-bold">SAML ENTITY ID</span>
              <button
                onClick={() => handleCopy(samlEntityId, 'saml_entity')}
                className="text-blue-600 hover:text-blue-700 font-sans text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedField === 'saml_entity' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === 'saml_entity' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <span className="text-slate-800 font-bold truncate block">{samlEntityId}</span>
          </div>
        </div>
      </div>

      {/* Connect IdP Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Connect Identity Provider</h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnectProvider} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Okta">Okta Enterprise</option>
                  <option value="Microsoft Entra ID">Microsoft Entra ID (Azure AD)</option>
                  <option value="Google Workspace">Google Workspace</option>
                  <option value="Ping Identity">Ping Identity</option>
                  <option value="JumpCloud">JumpCloud Directory</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">SSO Domain</label>
                <input
                  type="text"
                  placeholder="e.g. company.okta.com"
                  defaultValue="acmecorp.identity.corp"
                  required
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
