'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, Send, RefreshCw, Layers } from 'lucide-react';

export function SdkIntegrationView() {
  const [selectedLanguage, setSelectedLanguage] = useState<'nextjs' | 'react' | 'nodejs' | 'python'>('nextjs');
  const [copied, setCopied] = useState(false);

  // Interactive Test Console State
  const [selectedEndpoint, setSelectedEndpoint] = useState<'introspect' | 'userinfo' | 'scim_users' | 'revoke'>('introspect');
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedResponse, setSimulatedResponse] = useState<any>({
    status: 200,
    statusText: 'OK',
    latencyMs: 1.8,
    data: {
      active: true,
      scope: 'read:users write:users scim:sync',
      client_id: 'ea_client_acme_corp',
      sub: 'usr_01_ALEX',
      tenant_id: 'org_01H9A_ACME',
      exp: 1787739900,
      token_type: 'Bearer',
      algorithm: 'RS256'
    }
  });

  const snippets = {
    nextjs: `// app/api/protected/route.ts (Next.js 15 App Router)
import { verifyEnterpriseSession } from '@ea-saas/nextjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Edge-verified RS256 token validation in < 2ms
  const session = await verifyEnterpriseSession(request, {
    requiredPermissions: ['members:read', 'audit:read']
  });

  if (!session.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    tenantId: session.organizationId,
    userId: session.userId,
    role: session.role
  });
}`,
    react: `// components/EnterpriseAuthGuard.tsx (React / Next.js Client)
import { useEnterpriseAuth, SignInButton, UserButton } from '@ea-saas/react';

export function Header() {
  const { user, isLoaded, isSignedIn, activeOrg } = useEnterpriseAuth();

  if (!isLoaded) return <Skeleton className="h-8 w-24" />;

  return (
    <header className="flex justify-between items-center p-4">
      <span>Workspace: {activeOrg?.name}</span>
      {isSignedIn ? (
        <UserButton enforce2FA={true} />
      ) : (
        <SignInButton provider="okta_saml" />
      )}
    </header>
  );
}`,
    nodejs: `// server.js (Node.js Express / Fastify)
const express = require('express');
const { eaAuthMiddleware } = require('@ea-saas/node');

const app = express();

app.use('/api/v1', eaAuthMiddleware({
  publicKeyUrl: 'https://api.ea-auth.com/.well-known/jwks.json',
  redisRevocationUrl: process.env.REDIS_URL
}));

app.get('/api/v1/data', (req, res) => {
  res.json({ message: 'Authenticated', tenant: req.auth.tenantId });
});`,
    python: `# main.py (Python FastAPI)
from fastapi import FastAPI, Depends, Security
from ea_auth_fastapi import EnterpriseSecurity, TenantContext

app = FastAPI()
auth_security = EnterpriseSecurity(jwks_url="https://api.ea-auth.com/.well-known/jwks.json")

@app.get("/api/v1/secure-metrics")
async def get_metrics(context: TenantContext = Security(auth_security.require_permission("audit:read"))):
    return {
        "tenant_id": context.org_id,
        "actor": context.user_email,
        "status": "authorized"
    }`
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(snippets[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulator = (endpoint: 'introspect' | 'userinfo' | 'scim_users' | 'revoke') => {
    setSelectedEndpoint(endpoint);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (endpoint === 'introspect') {
        setSimulatedResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 1.6,
          data: {
            active: true,
            scope: 'read:users write:users scim:sync',
            client_id: 'ea_client_acme_corp',
            sub: 'usr_01_ALEX',
            tenant_id: 'org_01H9A_ACME',
            exp: 1787739900,
            token_type: 'Bearer',
            algorithm: 'RS256'
          }
        });
      } else if (endpoint === 'userinfo') {
        setSimulatedResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 2.1,
          data: {
            id: 'usr_01_ALEX',
            email: 'alex.morgan@acmecorp.com',
            full_name: 'Alex Morgan',
            roles: ['owner', 'admin'],
            two_factor_enabled: true,
            organization: {
              id: 'org_01H9A_ACME',
              name: 'Acme Global Technologies',
              plan: 'Enterprise'
            }
          }
        });
      } else if (endpoint === 'scim_users') {
        setSimulatedResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 3.4,
          data: {
            schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
            totalResults: 4,
            itemsPerPage: 4,
            startIndex: 1,
            Resources: [
              { id: 'usr_01_ALEX', userName: 'alex.morgan@acmecorp.com', active: true },
              { id: 'usr_02_SARAH', userName: 'sarah.connor@acmecorp.com', active: true }
            ]
          }
        });
      } else {
        setSimulatedResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 0.9,
          data: {
            revoked: true,
            session_id: 'sess_acme_02_IPHONE',
            redis_blacklist_ttl_sec: 900,
            message: 'Session purged across all global Edge instances'
          }
        });
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Developer SDKs & API Test Console</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Interactive Sandbox
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Drop-in client SDKs and live REST endpoint test simulator.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors shadow-xs self-start md:self-auto"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy Snippet'}
        </button>
      </div>

      {/* Language Tabs */}
      <div className="flex items-center gap-1.5">
        {[
          { id: 'nextjs', label: 'Next.js 15 App Router' },
          { id: 'react', label: 'React Hooks' },
          { id: 'nodejs', label: 'Node.js Express' },
          { id: 'python', label: 'Python FastAPI' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedLanguage(tab.id as any)}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              selectedLanguage === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Snippet Box */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
            <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
            <span className="ml-1.5 text-slate-300 text-[11px] font-bold">{selectedLanguage.toUpperCase()}</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono">Verified Production SDK</span>
        </div>

        <pre className="p-3.5 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
          {snippets[selectedLanguage]}
        </pre>
      </div>

      {/* Interactive REST API Test Console */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">Live API Endpoint Simulator</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            Latency: {simulatedResponse.latencyMs}ms
          </span>
        </div>

        {/* Endpoint Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'introspect', label: 'POST /v1/auth/introspect' },
            { id: 'userinfo', label: 'GET /v1/userinfo' },
            { id: 'scim_users', label: 'GET /scim/v2/Users' },
            { id: 'revoke', label: 'POST /v1/sessions/revoke' },
          ].map((ep) => (
            <button
              key={ep.id}
              onClick={() => handleRunSimulator(ep.id as any)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded border transition-colors flex items-center gap-1.5 ${
                selectedEndpoint === ep.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Play className="w-2.5 h-2.5" />
              {ep.label}
            </button>
          ))}
        </div>

        {/* Live Output Box */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-blue-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Executing cryptographic token verification...</span>
            </div>
          ) : (
            <pre>{JSON.stringify(simulatedResponse, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
