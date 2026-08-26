'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types/auth';
import { Search, Download, X } from 'lucide-react';

interface Props {
  auditLogs: AuditLog[];
}

export function AuditLogsView({ auditLogs }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Event,Actor,Target,Severity,IP,CreatedAt\n';
    const rows = filteredLogs.map(l =>
      `"${l.id}","${l.event}","${l.actorEmail}","${l.targetResource}","${l.severity}","${l.ipAddress}","${l.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Audit Logs</h2>
          <span className="px-2 py-0.2 text-[10px] font-mono font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            SOC2 Compliant
          </span>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2 border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-1">
          {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedSeverity === sev
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sev === 'ALL' ? 'All' : sev.charAt(0) + sev.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event, actor, IP..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* 3. High-Density Logs Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Event</th>
                <th className="py-2.5 px-3.5">Actor</th>
                <th className="py-2.5 px-3.5">Target</th>
                <th className="py-2.5 px-3.5">IP Address</th>
                <th className="py-2.5 px-3.5">Timestamp</th>
                <th className="py-2.5 px-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const formattedTime = log.createdAt.includes('T')
                  ? log.createdAt.replace('T', ' ').substring(0, 19)
                  : log.createdAt;

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          log.severity === 'CRITICAL' ? 'bg-red-500' : log.severity === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className="font-mono font-bold text-slate-900 text-xs">{log.event}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {log.actorEmail}
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {log.targetResource}
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.ipAddress}
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {formattedTime}
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLogForDetails(log)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Slide-Over */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm h-full bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Audit Event Details</h3>
                <span className="text-[10px] font-mono text-slate-400">{selectedLogForDetails.id}</span>
              </div>
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Event</span>
                <span className="font-bold text-slate-800">{selectedLogForDetails.event}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Actor</span>
                <span className="font-bold text-slate-800">{selectedLogForDetails.actorEmail}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Target</span>
                <span className="font-bold text-slate-800">{selectedLogForDetails.targetResource}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">IP Address</span>
                <span className="font-bold text-slate-800">{selectedLogForDetails.ipAddress}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="text-slate-400 font-sans font-medium">Timestamp</span>
                <span className="font-bold text-slate-800">{selectedLogForDetails.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
