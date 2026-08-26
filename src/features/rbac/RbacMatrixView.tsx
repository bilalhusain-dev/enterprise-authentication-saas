'use client';

import React, { useState } from 'react';
import { PermissionDefinition } from '@/types/auth';
import {
  Shield,
  Check,
  X,
  Plus,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface Props {
  permissions: PermissionDefinition[];
  onTogglePermission: (permissionId: string, role: 'owner' | 'admin' | 'member' | 'viewer') => void;
}

export function RbacMatrixView({ permissions, onTogglePermission }: Props) {
  const [showCustomRoleModal, setShowCustomRoleModal] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = Array.from(new Set(permissions.map(p => p.category)));

  const handleToggle = (permId: string, role: 'owner' | 'admin' | 'member' | 'viewer') => {
    if (role === 'owner') return;
    onTogglePermission(permId, role);
    setToastMessage(`Updated permissions for ${role.toUpperCase()} role.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName.trim()) return;
    setShowCustomRoleModal(false);
    setToastMessage(`Role "${customRoleName.trim()}" created.`);
    setCustomRoleName('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Roles & Permissions</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            4 Built-in Roles
          </span>
        </div>

        <button
          onClick={() => setShowCustomRoleModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Role</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 font-mono">OWNER</span>
            <Lock className="w-3 h-3 text-slate-400" />
          </div>
          <div className="text-[11px] text-slate-500">Root admin with full immutable access.</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-slate-800 font-mono">ADMIN</span>
          <div className="text-[11px] text-slate-500">Can manage users, sessions, and SSO.</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-slate-800 font-mono">MEMBER</span>
          <div className="text-[11px] text-slate-500">Developer with self 2FA management.</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-slate-800 font-mono">VIEWER</span>
          <div className="text-[11px] text-slate-500">Read-only audit and log access.</div>
        </div>
      </div>

      {/* 3. Granular Permissions Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5 w-1/2">Permission Capability</th>
                <th className="py-2.5 px-2 text-center w-1/8">Owner</th>
                <th className="py-2.5 px-2 text-center w-1/8">Admin</th>
                <th className="py-2.5 px-2 text-center w-1/8">Member</th>
                <th className="py-2.5 px-2 text-center w-1/8">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <React.Fragment key={cat}>
                  <tr className="bg-slate-50/50">
                    <td colSpan={5} className="py-1.5 px-3.5 font-bold font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {cat}
                    </td>
                  </tr>

                  {permissions.filter(p => p.category === cat).map((perm) => (
                    <tr key={perm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3.5">
                        <div className="font-semibold text-slate-900 text-xs">{perm.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{perm.description}</div>
                      </td>

                      {/* Owner */}
                      <td className="py-2 px-2 text-center">
                        <span className="inline-flex p-1 rounded bg-blue-50 text-blue-600">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </td>

                      {/* Admin */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleToggle(perm.id, 'admin')}
                          className={`p-1 rounded transition-colors ${
                            perm.roles.admin
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {perm.roles.admin ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Member */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleToggle(perm.id, 'member')}
                          className={`p-1 rounded transition-colors ${
                            perm.roles.member
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {perm.roles.member ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Viewer */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleToggle(perm.id, 'viewer')}
                          className={`p-1 rounded transition-colors ${
                            perm.roles.viewer
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {perm.roles.viewer ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Role Modal */}
      {showCustomRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Create Custom Role</h3>
              </div>
              <button
                onClick={() => setShowCustomRoleModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Name</label>
                <input
                  type="text"
                  value={customRoleName}
                  onChange={(e) => setCustomRoleName(e.target.value)}
                  placeholder="e.g. Compliance Auditor"
                  required
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomRoleModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
