# GigScope AI — Application Security & Privacy Architecture

## 1. Threat Model & Mitigations

### 1.1 Server-Side Request Forgery (SSRF)
Because GigScope AI performs live web research by querying search indices and retrieving external pages, SSRF protection is mandatory:

- **Protocol Whitelisting**: Only `http:` and `https:` schemes are permitted. `file:`, `ftp:`, `gopher:`, etc., are strictly rejected.
- **IP Address Filtering**: All private, loopback, link-local, and multicast IP ranges are blocked:
  - `127.0.0.0/8` (Loopback)
  - `10.0.0.0/8` (RFC 1918 Private)
  - `172.16.0.0/12` (RFC 1918 Private)
  - `192.168.0.0/16` (RFC 1918 Private)
  - `169.254.0.0/16` (Link-local / Cloud Metadata)
  - `::1` (IPv6 Loopback)
  - `fc00::/7` (IPv6 Unique Local)
- **DNS Resolution Revalidation**: Hostnames are resolved via `dns.lookup` before connection to prevent DNS rebinding attacks.
- **Redirect Destination Verification**: Every redirect location is re-validated through the full SSRF filter before being fetched.
- **Payload & Timeout Bounds**: Web fetches are capped at 512 KB and time out after 8,000 milliseconds.

---

### 1.2 Prompt-Injection Protection
External web snippets and user-submitted drafts are treated as **untrusted data**:
- All input text is strictly demarcated within structural delimiters.
- Prompts instruct the AI to treat input strictly as reference data and never execute instructions found within retrieved text.
- Outputs are validated using strict Zod schemas.

---

### 1.3 Rate Limiting & Resource Protection
- In-memory sliding window rate limiter protects server endpoints.
- Defaults to 30 requests per minute per IP address.
- Returns standard `Retry-After` and `X-RateLimit-*` headers upon violation.
- Periodic 5-minute memory sweep purges expired client records.

---

### 1.4 Secret Management & Privacy
- All API keys and provider credentials are kept strictly server-side.
- No `NEXT_PUBLIC_` prefixes on secret credentials.
- Drafts are processed statelessly in memory and never persisted to external databases.
