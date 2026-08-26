# 07 - Security, Compliance & Cryptographic Standards

**Project Name:** Enterprise Authentication SaaS  
**Short Name:** EA SaaS  
**Standard Benchmarks:** NIST SP 800-63B, OWASP Top 10 (2025/2026), SOC2 Type II (Common Criteria)  

---

## 1. Cryptographic Security Standards

| Component | Standard / Algorithm | Parameters / Configuration |
| :--- | :--- | :--- |
| **Password Hashing** | Argon2id | Memory: 64MB, Iterations: 3, Parallelism: 4 threads, Salt: 16 bytes CSPRNG |
| **Access Tokens** | RS256 / EdDSA JWT | 2048-bit RSA / Curve25519, Expiration: 900s (15 min) |
| **Refresh Tokens** | Cryptographic Opaque | 256-bit CSPRNG hex string, stored hashed using SHA-256 |
| **2FA / TOTP** | RFC 6238 TOTP | Secret: 160-bit Base32, Timestep: 30s, Hash: HMAC-SHA1/SHA256, Window: ±1 step |
| **Recovery Codes** | Hashed Backup Array | 8 distinct 10-character alphanumeric codes hashed with SHA-256 |
| **Transit Encryption** | TLS 1.3 | Strict Transport Security (HSTS) with 2-year max-age & preloading |

---

## 2. OWASP Top 10 Mitigation Matrix

### A01: Broken Access Control
- **Mitigation:** Strict multi-tenant Row-Level Security (RLS) and server-side RBAC validation on every single API endpoint and Server Action. Client-side hiding of UI elements is considered purely cosmetic.

### A02: Cryptographic Failures
- **Mitigation:** Passwords and backup codes are never stored in plaintext. Session tokens and 2FA secrets are encrypted at rest with AES-256-GCM.

### A03: Injection (SQL / NoSQL)
- **Mitigation:** Zero raw SQL concatenation. All database operations use parameterized type-safe queries.

### A07: Identification & Authentication Failures
- **Mitigation:** Redis-based sliding-window brute-force rate limiter (5 failed attempts per 15 minutes), forced 2FA challenge triggers on new device IPs, and strict session revocation blacklists.

---

## 3. SOC2 Compliance & Audit Readiness

Every audit event is cryptographically timestamped and records:
1. **Actor Identity:** User UUID, verified email, active tenant ID.
2. **Network Origin:** IP Address, reverse DNS lookup, User-Agent header.
3. **Forensic Diff:** Structured JSON containing `previous_state` and `new_state` for any modified resource (e.g. role changes, 2FA status changes).
4. **Immutability:** Audit records are strictly append-only; database permissions forbid `UPDATE` or `DELETE` operations on the `audit_logs` table.
