'use client';

import React, { useState } from 'react';
import { UserSession } from '@/types/auth';
import {
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

interface Props {
  sessions: UserSession[];
  onRevokeSession: (sessionId: string) => void;
  onRevokeAllOther: () => void;
}

export function ActiveSessionsView({ sessions, onRevokeSession, onRevokeAllOther }: Props) {
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);
  const [selectedSessionForInspect, setSelectedSessionForInspect] = useState<UserSession | null>(null);

  const currentSession = sessions.find(s => s.isCurrent && !s.isRevoked);
  const otherSessions = sessions.filter(s => !s.isCurrent && !s.isRevoked);
  const revokedSessions = sessions.filter(s => s.isRevoked);

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Active Sessions & Devices</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {sessions.filter(s => !s.isRevoked).length} Active
          </span>
        </div>

        {otherSessions.length > 0 && (
          <button
            onClick={() => setShowRevokeAllModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-2xs"
          >
            <span>Sign Out Other Devices</span>
          </button>
        )}
      </div>

      {/* 2. Current Device Card */}
      {currentSession && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{currentSession.browser} on {currentSession.os}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                    Current Device
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                  <span>{currentSession.city}, {currentSession.country}</span>
                  <span>•</span>
                  <span>IP: {currentSession.ipAddress}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedSessionForInspect(currentSession)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              Inspect
            </button>
          </div>
        </div>
      )}

      {/* 3. Other Devices List */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Other Signed In Devices ({otherSessions.length})
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          {otherSessions.map((s) => {
            const isMobile = s.browser.toLowerCase().includes('safari') || s.os.toLowerCase().includes('ios') || s.os.toLowerCase().includes('android');
            return (
              <div key={s.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    {isMobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {s.browser} on {s.os}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {s.city}, {s.country} • IP: {s.ipAddress} • Last active {s.lastActiveAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedSessionForInspect(s)}
                    className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => onRevokeSession(s.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            );
          })}

          {otherSessions.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              No other active devices signed in.
            </div>
          )}
        </div>
      </div>

      {/* Revoke All Modal */}
      {showRevokeAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">Sign Out All Other Devices?</h3>
            </div>
            <p className="text-xs text-slate-500">
              This will immediately revoke active access tokens across all {otherSessions.length} other devices.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevokeAllModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRevokeAllOther();
                  setShowRevokeAllModal(false);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
              >
                Sign Out All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Slide-Over Drawer */}
      {selectedSessionForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm h-full bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Device Details</h3>
                <span className="text-[10px] font-mono text-slate-400">{selectedSessionForInspect.id}</span>
              </div>
              <button
                onClick={() => setSelectedSessionForInspect(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Browser</span>
                <span className="font-bold text-slate-800">{selectedSessionForInspect.browser}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">OS</span>
                <span className="font-bold text-slate-800">{selectedSessionForInspect.os}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Location</span>
                <span className="font-bold text-slate-800">{selectedSessionForInspect.city}, {selectedSessionForInspect.country}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">IP Address</span>
                <span className="font-bold text-slate-800">{selectedSessionForInspect.ipAddress}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Last Active</span>
                <span className="font-bold text-slate-800">{selectedSessionForInspect.lastActiveAt}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onRevokeSession(selectedSessionForInspect.id);
                  setSelectedSessionForInspect(null);
                }}
                className="w-full py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                Sign Out This Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
