'use client';

import React, { useState } from 'react';
import {
  Fingerprint,
  Key,
  Plus,
  Trash2,
  CheckCircle2,
  Laptop,
  Smartphone,
  X,
  Check,
  Edit2
} from 'lucide-react';

interface Passkey {
  id: string;
  name: string;
  type: string;
  created: string;
  lastUsed: string;
  icon: any;
}

export function PasskeysView() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([
    {
      id: 'pk_01',
      name: 'MacBook Touch ID',
      type: 'Apple Touch ID',
      created: '2026-08-15',
      lastUsed: 'Today at 09:14 AM',
      icon: Laptop,
    },
    {
      id: 'pk_02',
      name: 'YubiKey 5C NFC',
      type: 'Hardware Security Key',
      created: '2026-08-01',
      lastUsed: 'Yesterday',
      icon: Key,
    },
    {
      id: 'pk_03',
      name: 'iPhone Face ID',
      type: 'iCloud Keychain',
      created: '2026-08-20',
      lastUsed: '3 days ago',
      icon: Smartphone,
    }
  ]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [passkeyNickname, setPasskeyNickname] = useState('');
  const [isPromptingBio, setIsPromptingBio] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Edit Nickname
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyNickname.trim()) return;

    setIsPromptingBio(true);

    setTimeout(() => {
      setIsPromptingBio(false);
      setShowRegisterModal(false);

      const newPk: Passkey = {
        id: `pk_${Date.now()}`,
        name: passkeyNickname.trim(),
        type: 'Touch ID / Biometric',
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Just now',
        icon: Fingerprint,
      };

      setPasskeys(prev => [newPk, ...prev]);
      setPasskeyNickname('');
      setSuccessBanner(`Passkey "${newPk.name}" added successfully.`);
      setTimeout(() => setSuccessBanner(null), 3000);
    }, 1000);
  };

  const handleRemovePasskey = (id: string) => {
    setPasskeys(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveNickname = (id: string) => {
    if (!editName.trim()) return;
    setPasskeys(prev => prev.map(p => p.id === id ? { ...p, name: editName.trim() } : p));
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Passkeys</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {passkeys.length} Registered
          </span>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Passkey</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. Passkeys List */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        {passkeys.map((p) => {
          const Icon = p.icon;
          const isEditing = editingId === p.id;
          return (
            <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-0.5 text-xs border border-blue-500 rounded focus:outline-hidden font-medium"
                      />
                      <button
                        onClick={() => handleSaveNickname(p.id)}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditName(p.name);
                        }}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {p.type} • Last active: {p.lastUsed}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemovePasskey(p.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Passkey Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Add Biometric Passkey</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartRegistration} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Passkey Nickname</label>
                <input
                  type="text"
                  value={passkeyNickname}
                  onChange={(e) => setPasskeyNickname(e.target.value)}
                  placeholder="e.g. Work MacBook Touch ID"
                  required
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPromptingBio}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
                >
                  {isPromptingBio ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
