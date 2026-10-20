# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported | End of Life |
|---------|-----------|-------------|
| Dashboard (main branch) | ✅ Yes | Rolling |
| Dashboard (v1.x) | ✅ Yes | TBD |
| Firmware (main) | ✅ Yes | Rolling |
| Firmware (stable tags) | ✅ Yes | 2 years |
| Documentation | ✅ Yes | Rolling |

**Always use the latest stable release for production deployments.**

---

## Reporting a Vulnerability

**DO NOT open a public GitHub issue for security vulnerabilities.**

### Report Privately
**Email:** security@capcollective.org

**Include:**
- Description of the vulnerability
- Steps to reproduce (if possible)
- Affected components (dashboard, firmware, docs, etc.)
- Potential impact assessment
- Suggested fix (if known)
- Your contact information for follow-up

### Response Timeline
| Phase | Target |
|-------|--------|
| **Acknowledgment** | 24 hours |
| **Initial Assessment** | 72 hours |
| **Fix Development** | 7-30 days (based on severity) |
| **Release/Disclosure** | Coordinated with reporter |

### Severity Classification

| Level | Criteria | Response Target |
|-------|----------|-----------------|
| **Critical** | RCE, auth bypass, data breach, safety risk | 24-48 hours |
| **High** | Auth bypass, privilege escalation, major data leak | 1 week |
| **Medium** | XSS, CSRF, info disclosure, DoS | 2-4 weeks |
| **Low** | Minor info leak, minor config issue | Next release |

---

## Disclosure Policy

### Coordinated Disclosure
1. **Reporter** submits vulnerability privately
2. **Team** acknowledges within 24 hours
3. **Team** validates and assesses severity
4. **Team** develops fix + tests
5. **Team** coordinates release date with reporter
6. **Public disclosure** after fix is deployed
7. **Credit** given to reporter (if desired)

### Public Disclosure
- Security advisories published on GitHub Security Advisories
- CVE requested for significant vulnerabilities
- Blog post for critical/high severity
- Changelog updated with security fixes

### No Surprise Releases
We will not disclose vulnerabilities before a fix is available, except in cases of active exploitation where immediate mitigation is necessary.

---

## Security Architecture

### Dashboard (Next.js + Supabase)

#### Authentication & Authorization
- **Supabase Auth:** Email/password, OAuth (Google, GitHub)
- **JWT:** Short-lived access tokens (1hr), refresh tokens
- **RLS:** Row Level Security on all tables
- **Roles:** `student`, `teacher`, `admin`, `data_analyst`
- **MFA:** Optional TOTP (recommended for admins)

#### Data Protection
- **Encryption at rest:** Supabase managed (AES-256)
- **Encryption in transit:** TLS 1.3 (enforced)
- **PII Minimization:** No SSN, DOB, addresses stored
- **Student Data:** FERPA-compliant, school-scoped
- **Secrets:** Environment variables (never in code)

#### Network Security
- **CSP:** Strict Content Security Policy
- **HSTS:** Enforced via Vercel
- **CORS:** Restricted to known origins
- **Rate Limiting:** Vercel Edge + Supabase
- **WAF:** Vercel managed

#### Dependency Management
- **Dependabot:** Automated PRs for updates
- **Audit:** `npm audit` in CI
- **SBOM:** Generated on release
- **License Check:** Only permissive licenses

### Firmware (ESP32/ESP32-S3)

#### Device Security
- **Unique Keys:** Per-device certificates (production)
- **OTA:** Signed firmware only (ECDSA)
- **Bootloader:** Locked, verified boot
- **Debug:** Disabled in production builds
- **JTAG:** Disabled (efuse)

#### Communication Security
- **ESP-NOW:** Encryption enabled (PMK/LMK)
- **WiFi:** WPA3 where supported
- **HTTPS:** TLS 1.2+ for Supabase
- **Cert Pinning:** Root CA pinned in firmware
- **No Plaintext:** No secrets in flash (NVS encrypted)

#### Physical Security
- **GPIO:** Unused pins disabled
- **UART:** Disabled in production
- **JTAG:** Fused off
- **Boot Mode:** Strapping pins secured

### Data Privacy (FERPA/COPPA/GDPR)

#### Student Data
- **Minimization:** Only collect what's needed
- **Consent:** Parental consent for <13 (COPPA)
- **Access:** School-scoped (RLS)
- **Retention:** 1 year post-graduation (configurable)
- **Deletion:** Automated on request/graduation
- **Export:** JSON/CSV on request (GDPR Art. 20)

#### Data Processing Agreement
- Supabase DPA signed
- Subprocessors listed
- SCCs for international transfers
- Breach notification: 72 hours

#### Consent Management
- Granular consent (analytics, photos, data sharing)
- Granular withdrawal
- Age verification (<13 → parental)
- Audit trail

---

## Secure Development Practices

### Code Review Requirements
- [ ] 2 approvals required (1 for docs)
- [ ] Security checklist passed
- [ ] No secrets in diff
- [ ] Dependencies reviewed
- [ ] Tests pass
- [ ] Linting passes

### CI/CD Security
```yaml
# GitHub Actions
- secrets: only in repository/organization secrets
- permissions: minimal (contents: read, id-token: write)
- supply chain: npm provenance, SLSA level 2 target
- container: distroless, non-root, read-only rootfs
```

### Secrets Management
| Secret Type | Storage | Rotation |
|-------------|---------|----------|
| Supabase Keys | GitHub Secrets / Vercel Env | 90 days |
| JWT Secrets | GitHub Secrets | 90 days |
| OTA Signing Keys | Hardware Secure Element | Annual |
| WiFi Credentials | NVS (encrypted) | Per deployment |
| Third-party API Keys | GitHub Secrets | Per provider policy |

**Never commit secrets.** Use `git-secrets` pre-commit hook.

---

## Incident Response Plan

### Phases

#### 1. Detection
- Automated alerts (Sentry, Supabase, Vercel)
- User reports (security@, conduct@)
- Log anomalies (automated)
- External notifications (CERT, vendors)

#### 2. Triage (0-1 hour)
- Severity assessment
- Team assembly (Security Lead + 2)
- Communication channel opened (Slack/War Room)
- Initial containment

#### 3. Containment (1-4 hours)
- Isolate affected systems
- Preserve evidence
- Implement mitigations
- Notify stakeholders (internal)

#### 4. Eradication (4-24 hours)
- Root cause analysis
- Remove threat actors
- Patch vulnerabilities
- Verify clean state

#### 5. Recovery (24-72 hours)
- Restore from clean backups
- Validate integrity
- Monitor for recurrence
- Gradual traffic restoration

#### 6. Post-Incident (1-2 weeks)
- Post-mortem (blameless)
- Action items with owners
- Documentation updates
- Process improvements
- Customer communication (if needed)

### Communication Plan

| Audience | Channel | Timing |
|----------|---------|--------|
| **Internal Team** | Slack #security-incident | Immediate |
| **Leadership** | Email + Slack | 1 hour |
| **Affected Users** | Email + Dashboard banner | 4 hours (if data breach) |
| **Public** | Blog + GitHub Advisory | After fix deployed |
| **Regulators** | Legal team | 72 hours (GDPR) |

---

## Security Checklist for Contributors

### Before Submitting PR
- [ ] No secrets, keys, tokens in code
- [ ] No hardcoded IPs, passwords, URLs
- [ ] Input validation on all user inputs
- [ ] Parameterized queries (no SQL injection)
- [ ] XSS prevention (escape output, CSP)
- [ ] CSRF protection (SameSite cookies, tokens)
- [ ] Proper error handling (no stack traces to user)
- [ ] Logging: no PII, no secrets
- [ ] Dependencies: latest, no critical CVEs
- [ ] Tests: security-relevant paths covered

### For Firmware Changes
- [ ] No debug logs in production build
- [ ] Stack protection enabled
- [ ] Buffer overflow protections
- [ ] Integer overflow checks
- [ ] Crypto: use libsodium/mbedTLS, not custom
- [ ] RNG: hardware RNG for keys
- [ ] OTA: signed, verified, rollback capable

---

## Bug Bounty Program

### Scope
| In Scope | Out of Scope |
|----------|--------------|
| Dashboard (production) | Third-party services |
| Firmware (OTA, comms) | Social engineering |
| API endpoints | Physical attacks |
| Auth/Authorization | DoS (volumetric) |
| Data handling | Self-XSS (no impact) |

### Rewards (USD)
| Severity | Reward |
|----------|--------|
| Critical | $500-2,000 |
| High | $200-500 |
| Medium | $50-200 |
| Low | $25-50 |
| **Bonus:** First reporter, quality report, suggested fix | +50% |

### Rules
- One reward per vulnerability
- First valid report gets reward
- No double-dipping (CVE + bounty)
- Must follow coordinated disclosure
- No testing on production without permission
- Respect privacy, don't access other users' data

### Submission
Email: bounty@capcollective.org with:
- Vulnerability details
- Proof of concept (safe)
- Impact assessment
- Your payment info (PayPal/GitHub Sponsors)

---

## Security Resources

### Training (Required for Core Team)
- **OWASP Top 10** (annual)
- **Secure Code Review** (annual)
- **Incident Response** (annual)
- **Threat Modeling** (bi-annual)

### Tools
- **SAST:** GitHub CodeQL (enabled)
- **DAST:** Not currently (planned)
- **SCA:** Dependabot + npm audit
- **Secrets:** GitHub Secret Scanning + git-secrets
- **Container:** Trivy (planned)

### Standards
- **OWASP ASVS** Level 2 target
- **NIST CSF** aligned
- **CIS Benchmarks** for infrastructure
- **SLSA Level 2** target for supply chain

---

## Contact

- **Security Issues:** security@capcollective.org
- **Bug Bounty:** bounty@capcollective.org
- **General Security Questions:** security@capcollective.org
- **PGP Key:** [keys.openpgp.org](https://keys.openpgp.org/search?q=security%40capcollective.org)

---

*Last updated: October 2024 | Version 1.0*
