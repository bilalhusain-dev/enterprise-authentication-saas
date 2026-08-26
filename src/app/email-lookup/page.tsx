'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Download, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  ExternalLink,
  Info,
  Clock,
  Layers,
  Lock,
  Flame,
  Shield,
  HelpCircle
} from 'lucide-react';

interface AuditResult {
  id: string;
  name: string;
  category: 'Social Media' | 'Developer & IT' | 'Productivity & Work' | 'Media & Entertainment' | 'Services & Cloud' | 'Adult & 18+ Platforms';
  status: 'REGISTERED' | 'NOT_REGISTERED' | 'HANDLE_MATCH_ONLY' | 'ENDPOINT_PROTECTED' | 'FLAGGED';
  method: string;
  confidence: string;
  details: string;
  directUrl?: string;
  iconLetter: string;
}

interface AuditSummary {
  totalProbed: number;
  registeredCount: number;
  handleMatchCount: number;
  notRegisteredCount: number;
  protectedCount: number;
  flaggedCount: number;
  exposureRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function EmailAuditPage() {
  const [emailInput, setEmailInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'REGISTERED' | 'HANDLE_MATCH_ONLY' | 'NOT_REGISTERED' | 'ENDPOINT_PROTECTED' | 'FLAGGED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const [auditData, setAuditData] = useState<{
    email: string;
    auditId: string;
    auditTimestamp: string;
    summary: AuditSummary;
    results: AuditResult[];
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunAudit = async (targetEmail?: string) => {
    const emailToAudit = targetEmail || emailInput;
    if (!emailToAudit || !emailToAudit.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g. info@abc.com or user@gmail.com).');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setScanProgress(10);
    setAuditLogs([]);
    setCurrentStepText('Initializing OSINT Accuracy Probe Engine...');

    const timestamp = new Date().toLocaleTimeString();
    const logs: string[] = [
      `[${timestamp}] [SYS-INIT] Target Identifier Loaded: ${emailToAudit}`,
      `[${timestamp}] [SECURITY] Dispatching live HTTP queries across 20+ endpoints...`,
      `[${timestamp}] [ACCURACY] Differentiating Direct Email Verification vs Public Handle Match...`
    ];
    setAuditLogs(logs);

    try {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          const next = prev + 15;
          const currTime = new Date().toLocaleTimeString();
          if (next >= 40 && next < 70) {
            setCurrentStepText('Probing Gravatar, GitHub & Duolingo Direct Email Endpoints...');
            setAuditLogs((prevLogs) => [
              ...prevLogs,
              `[${currTime}] [PROBE] Direct email hash verification for Gravatar, GitHub & Duolingo...`
            ]);
          } else if (next >= 70) {
            setCurrentStepText('Checking Adult Platforms (Positioned at bottom)...');
            setAuditLogs((prevLogs) => [
              ...prevLogs,
              `[${currTime}] [PROBE] Checking OnlyFans, Fansly, Pornhub & Chaturbate handle endpoints...`
            ]);
          }
          return next;
        });
      }, 250);

      const response = await fetch('/api/email-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToAudit })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Server returned error status');
      }

      const data = await response.json();

      setScanProgress(100);
      setCurrentStepText('Audit Complete. Precise Results Loaded.');
      const finalTime = new Date().toLocaleTimeString();
      setAuditLogs((prevLogs) => [
        ...prevLogs,
        `[${finalTime}] [SUCCESS] High accuracy audit finished for ${data.results.length} platforms.`,
        `[${finalTime}] [RESULTS] Verified Email: ${data.summary.registeredCount} | Unconfirmed Handle Match: ${data.summary.handleMatchCount} | Security Protected: ${data.summary.protectedCount}`
      ]);

      setTimeout(() => {
        setAuditData(data);
        setIsLoading(false);
      }, 300);

    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Unknown error during execution.';
      setErrorMsg(`Audit Execution Failed: ${message}`);
    }
  };

  const handleReset = () => {
    setEmailInput('');
    setAuditData(null);
    setErrorMsg(null);
    setScanProgress(0);
    setAuditLogs([]);
  };

  const handleExportCSV = () => {
    if (!auditData) return;
    const headers = ['Ref ID', 'Platform Name', 'Category', 'Status', 'Detection Method', 'Confidence', 'Details'];
    const rows = auditData.results.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.category}"`,
      r.status,
      `"${r.method}"`,
      r.confidence,
      `"${r.details}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Report_${auditData.email}_${auditData.auditId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Sort results so Adult sites are ALWAYS at the very bottom
  const sortedResults = auditData ? [...auditData.results].sort((a, b) => {
    const isAAdult = a.category === 'Adult & 18+ Platforms';
    const isBAdult = b.category === 'Adult & 18+ Platforms';
    if (isAAdult && !isBAdult) return 1;
    if (!isAAdult && isBAdult) return -1;
    return 0;
  }) : [];

  // Filtering logic
  const filteredResults = sortedResults.filter((r) => {
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-6 text-slate-800">
      
      {/* Official Government / Admin Portal Header */}
      <div className="bg-slate-900 text-white rounded-t-lg border-b-4 border-blue-600 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 border border-slate-700 p-2.5 rounded-md text-blue-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600/30 text-blue-300 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-blue-500/40">
                  ACCURATE OSINT PROBE DIRECTORY
                </span>
                <span className="text-slate-400 text-xs font-mono">SYS-VER: 4.0.0</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Email Account Registration & Verification Portal
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                High-Accuracy Email OSINT Audit Service (Separating Direct Email Verification vs Public Handle Match)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-800/80 p-2.5 rounded border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>VERIFIED ENGINE ONLINE</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>SSL SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Explanation Notice Bar */}
      <div className="bg-amber-50 border-x border-b border-amber-300 px-4 py-2.5 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <strong>Accuracy Notice:</strong> To eliminate false positives, this portal strictly separates 
          <span className="font-bold text-emerald-800"> ✅ Direct Verified Email Matches (100% Accurate)</span> from 
          <span className="font-bold text-amber-800"> ⚠️ Handle Match Only (Unconfirmed Email)</span> and 
          <span className="font-bold text-blue-800"> 🔒 Security Protected Endpoints</span>. Adult platforms are positioned at the bottom of the table.
        </div>
      </div>

      {/* Search Input Section Card */}
      <div className="bg-white border-x border-b border-slate-300 p-5 shadow-xs mb-6">
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Target Email Identifier / Address <span className="text-red-600">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleRunAudit()}
                placeholder="Enter email e.g. info@abc.com or user@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <button
              onClick={() => handleRunAudit()}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>PROBING ENDPOINTS...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>RUN ACCURATE AUDIT</span>
                </>
              )}
            </button>

            {auditData && (
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded border border-slate-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sample Preset Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Quick Test Inputs:
            </span>
            <button
              type="button"
              onClick={() => { setEmailInput('info@abc.com'); handleRunAudit('info@abc.com'); }}
              className="text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
            >
              info@abc.com
            </button>
            <button
              type="button"
              onClick={() => { setEmailInput('contact@company.org'); handleRunAudit('contact@company.org'); }}
              className="text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
            >
              contact@company.org
            </button>
            <button
              type="button"
              onClick={() => { setEmailInput('user@gmail.com'); handleRunAudit('user@gmail.com'); }}
              className="text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
            >
              user@gmail.com
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Progress Bar & Live Execution Engine */}
        {isLoading && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-semibold text-slate-700">{currentStepText}</span>
              <span className="font-bold text-blue-900">{scanProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
              <div
                className="bg-slate-900 h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Terminal Log Toggle */}
        {auditLogs.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showLogs ? 'Hide System Audit Logs' : 'Show Live System Audit Logs'}</span>
              {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showLogs && (
              <div className="mt-2 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded border border-slate-800 max-h-40 overflow-y-auto space-y-1">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight">{log}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audit Data Display Section */}
      {auditData && (
        <div className="space-y-6">

          {/* Verification Record Header Card */}
          <div className="bg-slate-50 border border-slate-300 p-4 rounded shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                HIGH ACCURACY AUDIT FILE RECORD
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                Target: {auditData.email}
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-3 mt-1 font-mono">
                <span>AUDIT RECORD ID: {auditData.auditId}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(auditData.auditTimestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Official Report Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrintReport}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Official Report</span>
              </button>
            </div>
          </div>

          {/* 4 Standard Summary Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

            {/* Card 1: Direct Email Verified (100% Accurate) */}
            <div className="bg-white border border-slate-300 p-4 rounded shadow-xs border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Verified Email Matches</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                {auditData.summary.registeredCount}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">100% Confirmed Exact Email</div>
            </div>

            {/* Card 2: Handle Matches Only (Unconfirmed Email) */}
            <div className="bg-white border border-slate-300 p-4 rounded shadow-xs border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Handle Match Only</span>
                <HelpCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-700">
                {auditData.summary.handleMatchCount}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">Public Handle (Email Unconfirmed)</div>
            </div>

            {/* Card 3: Security Protected Platforms */}
            <div className="bg-white border border-slate-300 p-4 rounded shadow-xs border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Security Protected</span>
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-blue-700">
                {auditData.summary.protectedCount}
              </div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">Meta/X Privacy OAuth Required</div>
            </div>

            {/* Card 4: Exposure Index */}
            <div className={`bg-white border border-slate-300 p-4 rounded shadow-xs border-l-4 ${
              auditData.summary.exposureRisk === 'HIGH' ? 'border-l-red-600' :
              auditData.summary.exposureRisk === 'MEDIUM' ? 'border-l-amber-500' : 'border-l-blue-600'
            }`}>
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Exposure Index</span>
                <ShieldAlert className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-sm font-bold uppercase font-mono px-2 py-0.5 rounded border ${
                  auditData.summary.exposureRisk === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                  auditData.summary.exposureRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-blue-100 text-blue-800 border-blue-300'
                }`}>
                  {auditData.summary.exposureRisk} EXPOSURE
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">
                {auditData.summary.flaggedCount > 0 ? `${auditData.summary.flaggedCount} Leaked Indexes Match` : 'Verified Live Footprint'}
              </div>
            </div>

          </div>

          {/* Filtering and Data Toolbar */}
          <div className="bg-white border border-slate-300 p-3 rounded shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 border-b md:border-b-0 pb-2 md:pb-0">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                ALL ({sortedResults.length})
              </button>

              <button
                onClick={() => setStatusFilter('REGISTERED')}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                  statusFilter === 'REGISTERED'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                VERIFIED EMAIL ({auditData.summary.registeredCount})
              </button>

              <button
                onClick={() => setStatusFilter('HANDLE_MATCH_ONLY')}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                  statusFilter === 'HANDLE_MATCH_ONLY'
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                HANDLE ONLY ({auditData.summary.handleMatchCount})
              </button>

              <button
                onClick={() => setStatusFilter('ENDPOINT_PROTECTED')}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                  statusFilter === 'ENDPOINT_PROTECTED'
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                }`}
              >
                PROTECTED ({auditData.summary.protectedCount})
              </button>

              <button
                onClick={() => setStatusFilter('NOT_REGISTERED')}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                  statusFilter === 'NOT_REGISTERED'
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                }`}
              >
                NOT FOUND ({auditData.summary.notRegisteredCount})
              </button>
            </div>

            {/* Category Dropdown & Quick Search */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-auto font-semibold"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Developer & IT">Developer & IT</option>
                  <option value="Productivity & Work">Productivity & Work</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Services & Cloud">Services & Cloud</option>
                  <option value="Adult & 18+ Platforms">🔞 Adult & 18+ Platforms (Bottom)</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Search table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-36"
              />
            </div>

          </div>

          {/* Formal Government / Admin Style Data Table */}
          <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3.5 border-r border-slate-300 w-12 text-center">Ref</th>
                    <th className="py-3 px-3.5 border-r border-slate-300">Platform / Service Name</th>
                    <th className="py-3 px-3.5 border-r border-slate-300">Category</th>
                    <th className="py-3 px-3.5 border-r border-slate-300">Detection Method</th>
                    <th className="py-3 px-3.5 border-r border-slate-300">Accurate Audit Status</th>
                    <th className="py-3 px-3.5 border-r border-slate-300">Confidence</th>
                    <th className="py-3 px-3.5 text-center">Verification Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-mono text-xs">
                        No platform records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((item, index) => {
                      const isEven = index % 2 === 0;
                      const isAdultCategory = item.category === 'Adult & 18+ Platforms';
                      return (
                        <tr
                          key={item.id}
                          className={`${isAdultCategory ? 'bg-slate-100/80 hover:bg-amber-100/50' : isEven ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40 transition-colors`}
                        >
                          {/* Ref ID */}
                          <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono text-slate-500 text-[11px] text-center">
                            #{String(index + 1).padStart(2, '0')}
                          </td>

                          {/* Platform Name */}
                          <td className="py-2.5 px-3.5 border-r border-slate-200 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded ${isAdultCategory ? 'bg-slate-800 text-rose-300' : 'bg-slate-900 text-white'} font-mono font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                {item.iconLetter}
                              </span>
                              <span className="flex items-center gap-1">
                                {item.name}
                                {isAdultCategory && <Flame className="w-3 h-3 text-rose-600 inline" />}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 text-[11px]">
                            {item.category === 'Adult & 18+ Platforms' ? (
                              <span className="text-slate-700 font-semibold flex items-center gap-1">
                                🔞 Adult Platforms (Bottom)
                              </span>
                            ) : item.category}
                          </td>

                          {/* Detection Method */}
                          <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono text-slate-500 text-[11px]">
                            {item.method}
                          </td>

                          {/* Status Badge */}
                          <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono">
                            {item.status === 'FLAGGED' && (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                                FLAGGED BREACH
                              </span>
                            )}
                            {item.status === 'REGISTERED' && (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ✅ VERIFIED EMAIL MATCH
                              </span>
                            )}
                            {item.status === 'HANDLE_MATCH_ONLY' && (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded" title="Public username handle exists, but email cannot be guaranteed without OAuth">
                                <HelpCircle className="w-3 h-3 text-amber-700" />
                                ⚠️ HANDLE MATCH ONLY
                              </span>
                            )}
                            {item.status === 'NOT_REGISTERED' && (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 rounded">
                                <XCircle className="w-3 h-3 text-slate-400" />
                                NOT FOUND
                              </span>
                            )}
                            {item.status === 'ENDPOINT_PROTECTED' && (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-blue-50 text-blue-800 border border-blue-300 px-2 py-0.5 rounded">
                                <Shield className="w-3 h-3 text-blue-600" />
                                🔒 SECURITY PROTECTED
                              </span>
                            )}
                          </td>

                          {/* Confidence */}
                          <td className="py-2.5 px-3.5 border-r border-slate-200 font-mono text-slate-600 text-[11px]">
                            {item.confidence}
                          </td>

                          {/* Action Direct Link */}
                          <td className="py-2.5 px-3.5 text-center">
                            {item.directUrl ? (
                              <a
                                href={item.directUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-medium underline"
                              >
                                <span>Verify</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-100 border-t border-slate-300 px-4 py-2 text-xs text-slate-500 flex justify-between items-center font-mono">
              <div>Showing {filteredResults.length} of {sortedResults.length} Verified Real Platform Records</div>
              <div>OSINT Accuracy Standard: Strict Separation (Email vs Handle)</div>
            </div>
          </div>

          {/* Official Audit Disclaimer Box */}
          <div className="bg-slate-50 border border-slate-300 p-4 rounded text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              WHY DOES ACCURACY DIFFER BETWEEN SITES? (TECHNICAL EXPLANATION)
            </div>
            <p className="leading-relaxed text-[11px]">
              1. <strong>Direct Email Verification (100% Accurate):</strong> Gravatar, Duolingo, GitHub email search, and Breach registries directly verify your specific email address.<br />
              2. <strong>Public Handle Match (Unconfirmed Email):</strong> Sites like Reddit, Medium, or OnlyFans only show if a username (e.g. <code>u/username</code>) exists. Someone else with the same name may own that handle.<br />
              3. <strong>Security Protected (Privacy Shield):</strong> Major platforms (Facebook, Instagram, X/Twitter, Spotify) block public email lookup behind OAuth login to protect user privacy.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
