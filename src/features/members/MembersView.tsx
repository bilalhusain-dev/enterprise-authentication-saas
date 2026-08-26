'use client';

import React, { useState } from 'react';
import { OrganizationMember, UserRole } from '@/types/auth';
import {
  Users,
  UserPlus,
  Search,
  Check,
  Copy,
  X,
  CheckCircle2
} from 'lucide-react';

interface Props {
  members: OrganizationMember[];
  onInviteMember: (email: string, role: UserRole) => void;
  onChangeRole: (memberId: string, newRole: UserRole) => void;
}

export function MembersView({ members, onInviteMember, onChangeRole }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('member');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    onInviteMember(inviteEmail.trim(), inviteRole);

    const generatedLink = `https://ea-auth.com/invites/join?token=inv_tok_${Math.random().toString(36).substring(2, 12)}&email=${encodeURIComponent(inviteEmail.trim())}`;
    setInviteLink(generatedLink);
    setInviteEmail('');
    setToastMsg(`Invitation link generated for ${inviteRole.toUpperCase()} seat.`);
  };

  const handleCopyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Users & Directory</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {members.length} Users
          </span>
        </div>

        <button
          onClick={() => {
            setShowInviteModal(true);
            setInviteLink(null);
            setToastMsg(null);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite User</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 2. Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2 border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {['ALL', 'OWNER', 'ADMIN', 'MEMBER', 'VIEWER'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === r
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {r === 'ALL' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* 3. High-Density Members Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">User</th>
                <th className="py-2.5 px-3.5">Role</th>
                <th className="py-2.5 px-3.5">2FA Security</th>
                <th className="py-2.5 px-3.5">Joined</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.user.avatarUrl}
                        alt={m.user.fullName}
                        className="w-7 h-7 rounded-full border border-slate-200 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{m.user.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{m.user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    {m.role === 'owner' ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200 font-mono">
                        OWNER
                      </span>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => onChangeRole(m.id, e.target.value as UserRole)}
                        className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-[11px] font-bold rounded px-2 py-1 focus:outline-hidden focus:border-blue-600 cursor-pointer font-mono"
                      >
                        <option value="admin">ADMIN</option>
                        <option value="member">MEMBER</option>
                        <option value="viewer">VIEWER</option>
                      </select>
                    )}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      m.user.twoFactorEnabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {m.user.twoFactorEnabled ? '2FA ACTIVE' : 'NO 2FA'}
                    </span>
                  </td>

                  <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {m.joinedAt.split('T')[0]}
                  </td>

                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    {m.role !== 'owner' && (
                      <button
                        onClick={() => setToastMsg(`Invitation resent to ${m.user.email}`)}
                        className="text-slate-400 hover:text-blue-600 text-[11px] font-semibold"
                      >
                        Resend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Invite Team User</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteLink ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Invitation Link Ready
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1 font-mono break-all bg-white p-2 rounded border border-emerald-200">
                    {inviteLink}
                  </div>
                </div>

                <button
                  onClick={handleCopyInviteLink}
                  className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied to Clipboard' : 'Copy Invitation Link'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@company.com"
                    required
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-hidden focus:border-blue-600 font-mono text-xs"
                  >
                    <option value="admin">ADMIN</option>
                    <option value="member">MEMBER</option>
                    <option value="viewer">VIEWER</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
                  >
                    Generate Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
