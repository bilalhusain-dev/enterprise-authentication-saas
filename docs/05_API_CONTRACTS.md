# 05 - API Contracts & Zod Validation Schemas

**Project Name:** Enterprise Authentication SaaS  
**Short Name:** EA SaaS  
**Specification Standard:** RESTful / OpenAPI 3.0 Compatible with Type-Safe Zod  

---

## 1. Authentication Endpoints

### 1.1 `POST /api/v1/auth/login`
Authenticates a user with email and password.

#### Request Schema (Zod)
```typescript
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid corporate email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember_device: z.boolean().default(false),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
```

#### Success Response (200 OK - Direct Login)
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "alex.morgan@acmecorp.com",
      "full_name": "Alex Morgan",
      "two_factor_enabled": false
    },
    "token": "eyJhbGciOiJSUzI1NiIs...",
    "expires_in": 900
  }
}
```

#### 2FA Required Response (200 OK with Challenge)
```json
{
  "status": "2fa_required",
  "data": {
    "challenge_token": "tmp_ch_8f94d1b8e4a90c",
    "delivery_method": "totp"
  }
}
```

---

## 2. Active Session Management Endpoints

### 2.1 `GET /api/v1/security/sessions`
Retrieves all active devices and sessions for the authenticated user.

#### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "current_session_id": "sess_01H9A3XJ...",
    "sessions": [
      {
        "id": "sess_01H9A3XJ...",
        "browser": "Chrome 124.0",
        "os": "macOS Sonoma",
        "ip_address": "192.0.2.1",
        "city": "London",
        "country": "GB",
        "is_current": true,
        "last_active_at": "2026-08-26T14:15:00Z",
        "created_at": "2026-08-26T09:00:00Z"
      },
      {
        "id": "sess_01H9A5PQ...",
        "browser": "Safari Mobile",
        "os": "iOS 18",
        "ip_address": "198.51.100.45",
        "city": "New York",
        "country": "US",
        "is_current": false,
        "last_active_at": "2026-08-25T22:10:00Z",
        "created_at": "2026-08-20T11:30:00Z"
      }
    ]
  }
}
```

### 2.2 `POST /api/v1/security/sessions/revoke`
Revokes an individual session or triggers emergency bulk revocation.

#### Request Schema
```typescript
export const RevokeSessionSchema = z.object({
  session_id: z.string().uuid().optional(),
  revoke_all_other: z.boolean().default(false),
});
```

---

## 3. Compliance Audit Log Endpoints

### 3.1 `GET /api/v1/organizations/:orgId/audit-logs`
Streams filtered audit logs for compliance audits.

#### Query Parameters Schema
```typescript
export const AuditLogsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(25),
  event: z.string().optional(),
  actor_id: z.string().uuid().optional(),
  severity: z.enum(["INFO", "WARNING", "CRITICAL"]).optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
});
```
