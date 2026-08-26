'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  FileCheck,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Award,
  Globe
} from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/80">
        <Link href="/login" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Image
              src="/app-icon.png"
              alt="Logo"
              width={20}
              height={20}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">
            Enterprise Authentication
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/login" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <Link href="/" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Title Header */}
        <div className="mb-10 pb-8 border-b border-slate-200 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Security Posture: Excellent (98%) • SOC2 Type II Certified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Security & Compliance Center</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Enterprise Authentication SaaS is engineered with a Zero-Trust security model, strict tenant isolation, and cryptographic attestation.
          </p>
        </div>

        {/* 4 Compliance Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-sm">
            <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-xs">SOC 2 Type II</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Verified & Audited</div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-xs">ISO 27001</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Certified Standard</div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-sm">
            <Globe className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-xs">GDPR & CCPA</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Compliant Privacy</div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-sm">
            <Lock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-xs">HIPAA Ready</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">BAA Available</div>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="space-y-6 text-sm text-slate-700">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Cryptographic Identity & Token Architecture</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              We employ military-grade cryptographic standards for every identity transaction across the platform:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Dual-Token RS256 Engine</div>
                <div className="text-xs text-slate-500">Short-lived 15m access tokens paired with 7-day sliding-window refresh tokens.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">FIDO2 / WebAuthn Passkeys</div>
                <div className="text-xs text-slate-500">Hardware-bound public key cryptography eliminating phishing and credential stuffing.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">RFC 6238 TOTP Validation</div>
                <div className="text-xs text-slate-500">Strict 30-second time-based one-time password generator with drift tolerance.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Public JWKS Key Rotation</div>
                <div className="text-xs text-slate-500">Standard RFC 7517 endpoint for instant zero-latency microservice token validation.</div>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Zero-Trust Multi-Tenancy & Data Isolation</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every customer organization exists in a cryptographically isolated tenant domain. Row-level security (RLS) policies guarantee that session tokens, user profiles, and audit events can never be accessed outside their authorized tenant scope.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Immutable Compliance Audit Streams</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              All administrative events (role overrides, session revocations, API key creations, SSO domain mappings) are recorded to an append-only, tamper-evident audit ledger with actor emails, IP addresses, and RFC timestamps available for instant CSV export.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>© 2026 Enterprise Authentication SaaS. All rights reserved.</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          <Link href="/security" className="text-blue-600 font-semibold">Security</Link>
          <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
