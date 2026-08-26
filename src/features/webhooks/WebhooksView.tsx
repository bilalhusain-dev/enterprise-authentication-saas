'use client';

import React, { useState } from 'react';
import {
  Webhook,
  Plus,
  CheckCircle2,
  Send,
  Trash2,
  X
} from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: string;
  lastDelivery: string;
}

const AVAILABLE_EVENTS = [
  'user.created',
  'user.deleted',
  'session.revoked',
  'scim.user.provisioned',
  'scim.user.deprovisioned',
  'security.2fa.enforced',
];

export function WebhooksView() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: 'wh_01',
      url: 'https://backend.acmecorp.com/api/webhooks/ea-auth',
      events: ['user.created', 'session.revoked'],
      secret: 'whsec_9f82194a...1029',
      status: 'HEALTHY',
      lastDelivery: '200 OK (142ms)',
    },
    {
      id: 'wh_02',
      url: 'https://security.acmecorp.com/ingest/audit-stream',
      events: ['security.2fa.enforced', 'session.revoked'],
      secret: 'whsec_110a2938...ac44',
      status: 'HEALTHY',
      lastDelivery: '200 OK (8m ago)',
    }
  ]);

  // Modal & Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['user.created', 'session.revoked']);

  // Testing State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestPing = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('Test webhook delivered: HTTP 200 OK.');
      setTimeout(() => setTestResult(null), 3000);
    }, 600);
  };

  const handleToggleEvent = (eventName: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventName)
        ? prev.filter(e => e !== eventName)
        : [...prev, eventName]
    );
  };

  const handleCreateEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newEp: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      url: newUrl.trim(),
      events: selectedEvents.length > 0 ? selectedEvents : ['user.created'],
      secret: `whsec_${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      status: 'HEALTHY',
      lastDelivery: 'Pending first dispatch',
    };

    setEndpoints(prev => [newEp, ...prev]);
    setNewUrl('');
    setSelectedEvents(['user.created', 'session.revoked']);
    setShowAddModal(false);
  };

  const handleDeleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(ep => ep.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Webhooks</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {endpoints.length} Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestPing}
            disabled={isTesting || endpoints.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce text-blue-600' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Endpoint</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* 2. Endpoints List */}
      <div className="space-y-2.5">
        {endpoints.map((ep) => (
          <div key={ep.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Webhook className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-900 truncate">{ep.url}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.2 text-[9px] font-bold font-mono rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {ep.status} • {ep.lastDelivery}
                </span>
                <button
                  onClick={() => handleDeleteEndpoint(ep.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {ep.events.map((e) => (
                <span key={e} className="px-1.5 py-0.2 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[9px] font-mono">
                  {e}
                </span>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-100 flex items-center justify-between">
              <span>Secret: {ep.secret}</span>
              <button
                onClick={handleTestPing}
                className="text-blue-600 hover:text-blue-700 font-sans text-xs font-semibold"
              >
                Send test event →
              </button>
            </div>
          </div>
        ))}

        {endpoints.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400 bg-white border border-slate-200 rounded-xl">
            No webhook endpoints configured.
          </div>
        )}
      </div>

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Add Webhook Endpoint</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEndpoint} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payload URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://api.yourcompany.com/webhooks"
                  required
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Events</label>
                <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200 max-h-36 overflow-y-auto">
                  {AVAILABLE_EVENTS.map((e) => (
                    <label key={e} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(e)}
                        onChange={() => handleToggleEvent(e)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span className="font-mono text-[10px]">{e}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
                >
                  Save Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
