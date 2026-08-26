'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Mail,
  ArrowRight,
  Fingerprint,
  Building2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState(['', '', '', '', '', '']);
  const [authStage, setAuthStage] = useState<'LOGIN' | '2FA_CHALLENGE' | 'SUCCESS'>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSsoOpen, setIsSsoOpen] = useState(false);

  // Handle Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'alex.morgan@acmecorp.com',
          password: password || 'password123',
          organizationSlug: 'acme-corp'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      if (data.requires2FA) {
        setAuthStage('2FA_CHALLENGE');
      } else {
        completeLogin(data.tokens);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 2FA
  const handleVerify2FA = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = totpCode.join('');
    if (code.length !== 6 && code !== '849201') {
      setErrorMsg('Please enter a valid 6-digit code');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_01_ALEX',
          code: code || '849201'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid 2FA code');
      completeLogin(data.tokens);
    } catch {
      // Demo fallback
      completeLogin({ accessToken: 'demo_token' });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick SSO provider click
  const handleQuickSso = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      completeLogin({ accessToken: `sso_${provider}_token` });
    }, 500);
  };

  const completeLogin = (tokens?: any) => {
    setAuthStage('SUCCESS');
    if (tokens?.accessToken) {
      localStorage.setItem('ea_access_token', tokens.accessToken);
    }
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans antialiased">
      {/* Top Minimal Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm overflow-hidden">
            <Image
              src="/app-icon.png"
              alt="Logo"
              width={22}
              height={22}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Enterprise Authentication</span>
        </div>

        <button
          onClick={() => router.push('/')}
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Skip to Dashboard →
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 p-7 sm:p-9 transition-all">
          {authStage === 'LOGIN' && (
            <div>
              {/* Card Header */}
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to your account</h1>
                <p className="text-xs text-slate-500 mt-1">Welcome back. Enter your work credentials.</p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SSO Buttons */}
              <div className="space-y-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => handleQuickSso('google')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-2.5 shadow-sm hover:border-slate-300 disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSso('microsoft')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-2.5 shadow-sm hover:border-slate-300 disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSsoOpen(!isSsoOpen)}
                  className="w-full py-2 px-3 text-[11px] font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isSsoOpen ? 'Hide enterprise SSO options' : 'Sign in with Okta SAML or Passkey'}</span>
                </button>

                {isSsoOpen && (
                  <div className="pt-1 pb-2 space-y-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleQuickSso('okta')}
                      className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors text-left flex items-center justify-between"
                    >
                      <span>Okta Single Sign-On</span>
                      <span className="text-[10px] text-blue-600">SAML 2.0 →</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSso('passkey')}
                      className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors text-left flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-slate-600" />
                        <span>Biometric Passkey</span>
                      </span>
                      <span className="text-[10px] text-blue-600">Touch ID →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs text-slate-400 font-medium whitespace-nowrap shrink-0">
                  or continue with email
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@acmecorp.com"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions sent to your email.')}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* 2FA Challenge View */}
          {authStage === '2FA_CHALLENGE' && (
            <div className="text-center py-2">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 mb-3.5">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Two-Factor Authentication</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit code from your authenticator app.
              </p>

              {errorMsg && (
                <div className="my-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 6 Digit Grid */}
              <div className="flex justify-center gap-2 my-5">
                {totpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`totp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const newCode = [...totpCode];
                      newCode[idx] = val;
                      setTotpCode(newCode);

                      if (val && idx < 5) {
                        const nextInput = document.getElementById(`totp-input-${idx + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        const prevInput = document.getElementById(`totp-input-${idx - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-10 h-11 text-center text-base font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                ))}
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleVerify2FA}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Code</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <button
                    type="button"
                    onClick={() => setTotpCode(['8', '4', '9', '2', '0', '1'])}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    Auto-Fill Test Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthStage('LOGIN')}
                    className="text-[11px] hover:text-slate-800"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {authStage === 'SUCCESS' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Signed In Successfully</h2>
                <p className="text-xs text-slate-500 mt-0.5">Redirecting to your workspace...</p>
              </div>
              <div className="w-36 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-[pulse_0.8s_infinite]" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div>© 2026 Enterprise Authentication SaaS</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
          <Link href="/security" className="hover:text-slate-700 transition-colors">Security</Link>
          <Link href="/support" className="hover:text-slate-700 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
