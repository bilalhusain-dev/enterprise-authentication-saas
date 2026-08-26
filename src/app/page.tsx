import EnterpriseAuthApp from '@/components/EnterpriseAuthApp';

export const metadata = {
  title: 'Enterprise Authentication SaaS (EA SaaS) — Silicon Valley IAM Platform',
  description: 'Production-ready Multi-Tenant IAM with Granular RBAC, TOTP 2FA, Session Revocation, and Immutable Compliance Audit Logs.',
};

export default function Home() {
  return <EnterpriseAuthApp />;
}
