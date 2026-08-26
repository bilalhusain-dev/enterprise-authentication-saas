'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Smartphone,
  Key,
  Copy,
  Check,
  CheckCircle2,
  Download,
  Clock
} from 'lucide-react';

interface Props {
  is2FAEnabled: boolean;
  onToggle2FA: (enable: boolean) => void;
}

export function TwoFactorView({ is2FAEnabled, onToggle2FA }: Props) {
  const [totpCode, setTotpCode] = useState(['', '', '', '', '', '']);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 30-Second Rolling Token Simulator
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [simulatedRollingToken, setSimulatedRollingToken] = useState('849 201');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSeconds = new Date().getSeconds();
      const rem = 30 - (currentSeconds % 30);
      setSecondsRemaining(rem);

      if (rem === 30 || rem === 1) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSimulatedRollingToken(`${code.substring(0, 3)} ${code.substring(3)}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mockSecret = 'HXDM V3S2 FZ6W G7P9';
  const backupCodes = [
    'a982-f471-bc01',
    '33d8-11ea-90bf',
    'e7c2-901b-55a4',
    '88f1-aa42-0019',
    'c091-23ba-ff77',
    '55a1-77b3-88cc',
    'bb02-44df-9901',
    '12f9-88aa-33ee',
  ];

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...totpCode];
    newCode[index] = value;
    setTotpCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`totp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = totpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setErrorMsg(null);
    setVerificationSuccess(true);
    onToggle2FA(true);
    setTimeout(() => setVerificationSuccess(false), 3000);
  };

  const handleCopySecret = () => {
    navigator.clipboard?.writeText(mockSecret.replace(/\s/g, ''));
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard?.writeText(backupCodes.join('\n'));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-emergency-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
          <span className={`px-2 py-0.2 text-[10px] font-mono font-bold rounded-full border ${
            is2FAEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {is2FAEnabled ? 'Protected' : 'Not Active'}
          </span>
        </div>

        {is2FAEnabled ? (
          <button
            onClick={() => onToggle2FA(false)}
            className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-2xs"
          >
            Turn Off 2FA
          </button>
        ) : (
          <button
            onClick={handleVerify}
            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
          >
            Enable 2FA
          </button>
        )}
      </div>

      {verificationSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Two-Factor Authentication successfully verified.</span>
        </div>
      )}

      {/* 2. Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: Scan QR Code */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
          <div className="text-xs font-bold text-slate-900">1. Scan QR Code</div>

          <div className="flex flex-col items-center gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="p-2 bg-white rounded border border-slate-200 shrink-0 shadow-2xs">
              <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="30" height="30" fill="#0F172A" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="#0F172A" />
                <rect x="60" y="10" width="30" height="30" fill="#0F172A" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="#0F172A" />
                <rect x="10" y="60" width="30" height="30" fill="#0F172A" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="#0F172A" />
                <rect x="50" y="50" width="10" height="10" fill="#0F172A" />
                <rect x="70" y="60" width="15" height="10" fill="#0F172A" />
                <rect x="60" y="80" width="25" height="10" fill="#0F172A" />
              </svg>
            </div>

            <div className="text-center w-full">
              <div className="font-mono font-bold text-slate-800 text-xs bg-white px-2 py-1 rounded border border-slate-200">
                {mockSecret}
              </div>
              <button
                onClick={handleCopySecret}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 mt-1.5"
              >
                {copiedSecret ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSecret ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Enter Code */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
          <div className="text-xs font-bold text-slate-900">2. Enter 6-Digit Code</div>

          <p className="text-[11px] text-slate-500">
            Enter the rolling code from your Authenticator app:
          </p>

          <div className="flex items-center justify-between gap-1 pt-1">
            {totpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`totp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                placeholder="•"
                className="w-8 h-10 text-center text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
              />
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
          )}

          <button
            onClick={handleVerify}
            className="w-full mt-2 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
          >
            Verify & Activate
          </button>
        </div>

        {/* Live Rolling Token Indicator */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-900">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold">Authenticator Preview</span>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl text-center space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400">
              Rolling Token
            </div>
            <div className="text-xl font-mono font-bold tracking-widest text-emerald-400">
              {simulatedRollingToken}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="w-14 bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${((30 - secondsRemaining) / 30) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{secondsRemaining}s</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium">
            30-second rolling security window
          </div>
        </div>
      </div>

      {/* 3. Emergency Backup Recovery Codes */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900">Emergency Backup Codes (8)</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyBackupCodes}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              {copiedBackup ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedBackup ? 'Copied' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleDownloadBackupCodes}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 font-bold text-center">
          {backupCodes.map((code) => (
            <div key={code} className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              {code}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
