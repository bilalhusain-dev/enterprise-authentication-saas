'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2, Globe, Mail } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>GDPR & CCPA Compliant</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: August 26, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
              Information We Collect
            </h2>
            <p className="mb-4">
              Enterprise Authentication SaaS ("EA SaaS", "we", "our") acts as an enterprise Identity Provider (IdP) and authentication platform. We collect only the information necessary to provide zero-trust identity verification, multi-factor authentication, and compliance auditing.
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li><strong className="text-slate-800">Identity Data:</strong> Full name, corporate email address, hashed credentials, and role memberships.</li>
              <li><strong className="text-slate-800">Security Credentials:</strong> Encrypted TOTP secret keys, WebAuthn/FIDO2 public keys (private keys never leave your device).</li>
              <li><strong className="text-slate-800">Session & Device Telemetry:</strong> IP address, geolocation (city/country), browser user-agent, operating system, and session token hashes.</li>
              <li><strong className="text-slate-800">Audit Logs:</strong> Timestamps, actor identifiers, target resources, and event categories for compliance records.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
              How We Use Information
            </h2>
            <p className="mb-4">We process customer identity data strictly for the following purposes:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Identity & Access Control</div>
                <div className="text-xs text-slate-500">Issuing cryptographic RS256 JWT tokens, SAML SSO assertions, and SCIM directory syncing.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Threat & Anomaly Detection</div>
                <div className="text-xs text-slate-500">Detecting brute-force attacks, concurrent anomalous logins, and revoking suspicious sessions.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Compliance Auditing</div>
                <div className="text-xs text-slate-500">Maintaining immutable SOC2 Type II and ISO 27001 audit logs for enterprise customer review.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="font-semibold text-slate-900 text-xs mb-1">Webhook Dispatching</div>
                <div className="text-xs text-slate-500">Delivering cryptographically signed HMAC-SHA256 event notifications to customer endpoints.</div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
              Data Protection & Encryption Standards
            </h2>
            <p className="mb-4">
              All stored information is protected using industry-leading cryptographic controls:
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-800">Encryption in Transit:</strong> TLS 1.3 with strict HSTS (HTTP Strict Transport Security) for all HTTP & API communication.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-800">Encryption at Rest:</strong> AES-256 encryption across all tenant database instances and persistent storage volumes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-800">Tenant Isolation:</strong> Logical and schema-level row isolation ensuring zero cross-tenant data leakage.</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">4</span>
              Your Rights (GDPR & CCPA)
            </h2>
            <p className="mb-3">
              Depending on your jurisdiction, you have the right to access, export, rectify, or erase your personal data:
            </p>
            <p className="text-xs text-slate-600">
              To request a complete cryptographic data export or initiate account deletion, organization administrators can trigger an automated export via the Audit Logs console or contact our Data Protection Officer at <a href="mailto:privacy@ea-auth.com" className="text-blue-600 font-semibold hover:underline">privacy@ea-auth.com</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>© 2026 Enterprise Authentication SaaS. All rights reserved.</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="text-blue-600 font-semibold">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          <Link href="/security" className="hover:text-slate-900 transition-colors">Security</Link>
          <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
