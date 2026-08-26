'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  HelpCircle,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  LifeBuoy,
  FileQuestion
} from 'lucide-react';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSubmitted(true);
  };

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
        <div className="mb-10 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>24/7 Enterprise Assistance</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support & Help Center</h1>
          <p className="text-sm text-slate-500 mt-2">
            Have questions about SAML SSO setup, SCIM 2.0 directory sync, or API integration? We are here to help.
          </p>
        </div>

        {/* 3 Quick Help Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-600 mb-2.5" />
            <div className="font-bold text-slate-900 text-xs mb-1">Documentation</div>
            <p className="text-xs text-slate-500 mb-3">Step-by-step guides for Okta, Azure AD, and React/Next.js SDKs.</p>
            <Link href="/" className="text-xs font-medium text-blue-600 hover:underline">
              Explore Docs →
            </Link>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <Clock className="w-5 h-5 text-emerald-600 mb-2.5" />
            <div className="font-bold text-slate-900 text-xs mb-1">Guaranteed SLAs</div>
            <p className="text-xs text-slate-500 mb-3">Enterprise Tier response time under 15 minutes for critical incidents.</p>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              99.99% Uptime
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <Mail className="w-5 h-5 text-indigo-600 mb-2.5" />
            <div className="font-bold text-slate-900 text-xs mb-1">Direct Engineering</div>
            <p className="text-xs text-slate-500 mb-3">Dedicated Slack/Teams channels with our core IAM security architects.</p>
            <a href="mailto:support@ea-auth.com" className="text-xs font-medium text-indigo-600 hover:underline">
              support@ea-auth.com →
            </a>
          </div>
        </div>

        {/* Interactive Support Ticket Form */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-9 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Submit an Enterprise Support Request</h2>
          <p className="text-xs text-slate-500 mb-6">Our security and systems engineering team will respond directly to your work email.</p>

          {isSubmitted ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Support Ticket Created Successfully</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ticket Reference <strong className="text-slate-800 font-mono">#EA-98214</strong> has been dispatched. Our engineer will respond to <strong>{email}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@acmecorp.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  >
                    <option value="Low">Low - General Question</option>
                    <option value="Medium">Medium - Configuration Assistance</option>
                    <option value="High">High - Production Degradation</option>
                    <option value="Urgent">Urgent - Authentication Outage (Immediate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. SCIM 2.0 Okta directory sync question"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what you are trying to configure or any error messages you received..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>© 2026 Enterprise Authentication SaaS. All rights reserved.</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          <Link href="/security" className="hover:text-slate-900 transition-colors">Security</Link>
          <Link href="/support" className="text-blue-600 font-semibold">Support</Link>
        </div>
      </footer>
    </div>
  );
}
