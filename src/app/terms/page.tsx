'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileCheck, CheckCircle2, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Navigation Header */}
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

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Document Header */}
        <div className="mb-10 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Enterprise Master Services Agreement</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: August 26, 2026 • Version 2.4
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
              Agreement & Scope of Services
            </h2>
            <p className="mb-3">
              By accessing or using the Enterprise Authentication SaaS platform, API endpoints, or SDKs, you ("Customer", "Organization") agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or legal entity, you represent that you have the authority to bind such entity.
            </p>
            <p className="text-slate-600">
              EA SaaS provides enterprise identity infrastructure, including SAML Single Sign-On, SCIM 2.0 Directory Sync, WebAuthn Passkeys, TOTP Multi-Factor Authentication, Role-Based Access Control (RBAC), and Compliance Audit Logging.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
              Service Level Agreement (99.99% Uptime SLA)
            </h2>
            <p className="mb-4">
              We understand that authentication is mission-critical infrastructure. EA SaaS guarantees a monthly uptime commitment of <strong className="text-slate-900">99.99%</strong> for all core authentication and token issuance APIs.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Global Edge Availability</div>
                <div className="text-xs text-slate-500">Multi-region active-active deployment with sub-50ms token verification latency worldwide.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">SLA Service Credits</div>
                <div className="text-xs text-slate-500">If monthly uptime falls below 99.99%, enterprise customers receive proportional billing credits.</div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
              Customer Responsibilities & Security
            </h2>
            <p className="mb-3">
              Organizations are responsible for:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li>Safeguarding their root administrator credentials and production API keys.</li>
              <li>Configuring appropriate session timeout policies and multi-factor enforcement for high-privilege roles.</li>
              <li>Immediately revoking compromised sessions or employee tokens via the active sessions console.</li>
              <li>Ensuring that employee onboarding and offboarding adhere to corporate compliance guidelines.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">4</span>
              Intellectual Property & Open-Source Licensing
            </h2>
            <p className="text-slate-600">
              The core reference architecture and client SDKs are released under the MIT Open Source License. Enterprise trademarks, hosted infrastructure, and managed cloud SLAs remain the exclusive property of Enterprise Authentication SaaS.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>© 2026 Enterprise Authentication SaaS. All rights reserved.</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="text-blue-600 font-semibold">Terms</Link>
          <Link href="/security" className="hover:text-slate-900 transition-colors">Security</Link>
          <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
