'use client';

import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Code2,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  env: 'Production' | 'Staging' | 'Development';
  scopes: string[];
  lastUsed: string;
  createdAt: string;
}

export function ApiKeysView() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key_01',
      name: 'Production Backend Service',
      prefix: 'ea_live_sk_9f82...3a19',
      env: 'Production',
      scopes: ['read:users', 'write:users'],
      lastUsed: '2m ago',
      createdAt: '2026-08-10',
    },
    {
      id: 'key_02',
      name: 'CI/CD Staging Key',
      prefix: 'ea_test_sk_1c44...8d90',
      env: 'Staging',
      scopes: ['read:users'],
      lastUsed: '3h ago',
      createdAt: '2026-08-20',
    },
  ]);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'Production' | 'Staging' | 'Development'>('Production');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read:users', 'write:users']);

  // Newly Created Secret Display Modal
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const AVAILABLE_SCOPES = [
    { id: 'read:users', label: 'Read Users' },
    { id: 'write:users', label: 'Write Users' },
    { id: 'scim:sync', label: 'SCIM Directory' },
    { id: 'audit:read', label: 'Read Audit Logs' },
  ];

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes(prev =>
      prev.includes(scopeId)
        ? prev.filter(s => s !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const rawSecret = `ea_${newKeyEnv.toLowerCase()}_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const maskedPrefix = `${rawSecret.substring(0, 14)}...${rawSecret.substring(rawSecret.length - 4)}`;

    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      prefix: maskedPrefix,
      env: newKeyEnv,
      scopes: selectedScopes.length > 0 ? selectedScopes : ['read:users'],
      lastUsed: 'Never used',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setApiKeys(prev => [newKey, ...prev]);
    setShowCreateModal(false);
    setGeneratedSecret(rawSecret);
    setNewKeyName('');
    setSelectedScopes(['read:users', 'write:users']);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">API Keys</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {apiKeys.length} Active
          </span>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Key</span>
        </button>
      </div>

      {/* 2. Keys List */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        {apiKeys.map((k) => (
          <div key={k.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">{k.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    k.env === 'Production'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {k.env}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                  {k.prefix} • Last used {k.lastUsed}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(k.prefix, k.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
              >
                {copiedId === k.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === k.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleDeleteKey(k.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                title="Revoke Key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {apiKeys.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            No API keys generated.
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Create API Key</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Backend Auth Service"
                  required
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Environment</label>
                <select
                  value={newKeyEnv}
                  onChange={(e) => setNewKeyEnv(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium font-mono text-xs"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Scopes</label>
                <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {AVAILABLE_SCOPES.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(s.id)}
                        onChange={() => handleToggleScope(s.id)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secret Reveal Modal */}
      {generatedSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">API Key Created</h3>
            </div>
            <p className="text-xs text-slate-500">
              Copy this secret now. It will not be shown again.
            </p>

            <div className="p-2.5 bg-slate-900 text-white rounded-lg font-mono text-xs break-all">
              {generatedSecret}
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(generatedSecret);
                setCopiedSecret(true);
                setTimeout(() => {
                  setCopiedSecret(false);
                  setGeneratedSecret(null);
                }, 1500);
              }}
              className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {copiedSecret ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSecret ? 'Copied Secret' : 'Copy and Close'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
