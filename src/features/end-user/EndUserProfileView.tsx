'use client';

import React, { useState } from 'react';
import { User, UserSession, Organization } from '@/types/auth';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  KeyRound,
  Fingerprint,
  Building2,
  Lock,
  Mail,
  CheckCircle2,
  Trash2,
  LogOut,
  Globe,
  Plus,
  Edit2,
  Check
} from 'lucide-react';

interface Props {
  user: User;
  organization: Organization;
  sessions: UserSession[];
  onRevokeSession: (sessionId: string) => void;
  onToggle2FA: (enable: boolean) => void;
}

export function EndUserProfileView({
  user,
  organization,
  sessions,
  onRevokeSession,
  onToggle2FA
}: Props) {
  const [activeSessions, setActiveSessions] = useState(sessions.filter(s => !s.isRevoked));
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passUpdated, setPassUpdated] = useState(false);

  // Passkeys for normal user
  const [passkeys, setPasskeys] = useState([
    { id: 'pk_01', name: 'MacBook Touch ID', type: 'Apple Secure Enclave', added: 'Aug 15, 2026' },
    { id: 'pk_02', name: 'iPhone Face ID', type: 'iCloud Keychain', added: 'Aug 20, 2026' },
  ]);

  const handleRevoke = (id: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    onRevokeSession(id);
  };

  const handleAddPasskey = () => {
    const newPk = {
      id: `pk_${Date.now()}`,
      name: 'New Biometric Passkey',
      type: 'FIDO2 Authenticator',
      added: 'Just now',
    };
    setPasskeys(prev => [newPk, ...prev]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* 1. User Profile Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-16 h-16 rounded-full border-2 border-slate-200 object-cover shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{user.fullName}</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {organization.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Email Verified
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-500 font-medium">Member since Jan 2026</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Profile update modal')}
            className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 2. Account Security & 2FA Status */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Security & Sign-In Methods</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your two-factor authentication and passwordless biometric keys.
          </p>
        </div>

        {/* 2FA Status Row */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 mt-0.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  user.twoFactorEnabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {user.twoFactorEnabled ? 'Active & Protected' : 'Not Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Requires a 6-digit rolling code from your Authenticator app when signing in.
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggle2FA(!user.twoFactorEnabled)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors self-start sm:self-center ${
              user.twoFactorEnabled
                ? 'text-red-600 hover:text-red-700 bg-red-50 border border-red-200'
                : 'text-white bg-blue-600 hover:bg-blue-500 shadow-xs'
            }`}
          >
            {user.twoFactorEnabled ? 'Turn Off 2FA' : 'Enable 2FA'}
          </button>
        </div>

        {/* Passkeys (Biometrics) Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Passkeys & Hardware Keys ({passkeys.length})</h3>
            </div>

            <button
              onClick={handleAddPasskey}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Passkey
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {passkeys.map((p) => (
              <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.type} • Added {p.added}</div>
                </div>

                <button
                  onClick={() => setPasskeys(prev => prev.filter(k => k.id !== p.id))}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. My Connected Devices (Active Sessions) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Where You're Signed In</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            These devices currently have active access to your account.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {activeSessions.map((s) => (
            <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 mt-0.5">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{s.browser}</span>
                    {s.isCurrent && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        This Device
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    <span>{s.os}</span>
                    <span> • </span>
                    <span>{s.city}, {s.country}</span>
                    <span> • </span>
                    <span>IP: {s.ipAddress}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Last active: <span className="text-slate-600 font-medium">{s.lastActiveAt}</span>
                  </div>
                </div>
              </div>

              {!s.isCurrent && (
                <button
                  onClick={() => handleRevoke(s.id)}
                  className="self-start sm:self-center px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                >
                  Sign Out Device
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
