# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x   | ✅ Yes    |
| < 1.0   | ❌ No     |

---

## Reporting a Vulnerability

**Do NOT report security vulnerabilities through public GitHub issues.**

Report via email to **security@capcollective.org** (or GitHub's private vulnerability reporting).

### Include:
- Type of issue (buffer overflow, SQL injection, XSS, auth bypass, etc.)
- File paths and source locations
- Steps to reproduce
- Proof-of-concept code (if possible)
- Impact assessment

### Response Timeline
- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 7 days
- **Fix Development:** Varies by complexity
- **Coordinated Disclosure:** After users have time to update (typically 30 days)

---

## Security Considerations for Schools

### Student Data Privacy
- No PII collected by default
- Student names in spreadsheets are local-only
- Sensor data is anonymous (bin IDs only)
- Supabase anon key used (no user auth by default)
- FERPA, COPPA, GDPR compliant for educational use

### IoT Device Security
- ESP-NOW communication is local (no internet exposure for nodes)
- Radio Tower is the only device connecting to WiFi/Supabase
- WiFi credentials stored in firmware (rotate per deployment)
- Supabase RLS policies recommended
- Firmware OTA updates not implemented (physical access required)

### Dashboard Security
- Next.js deployed to Vercel/Netlify with HTTPS enforced
- Supabase anon key in environment variables (not committed)
- No authentication by default — add auth for multi-school deployments
- Rate limiting on API routes recommended

### Physical Safety
See [Safety Documentation](../program/safety.md) for:
- Machine operation safety
- Ventilation requirements
- PPE requirements
- Emergency procedures
- Temperature limits (never exceed 200°C)

---

## Dependency Security

Automated monitoring via:
- **GitHub Dependabot** — Automated PRs for vulnerable dependencies
- **npm audit** — Run in CI for dashboard dependencies
- **PlatformIO** — Checks firmware library vulnerabilities

Local audit:
```bash
# Dashboard
cd cap-collective-dashboard
npm audit

# Firmware
cd firmware/node1_cap_counter
pio lib list --outdated
```

---

## Disclosure Policy

When a vulnerability is confirmed:
1. Develop and test a fix
2. Prepare a security advisory
3. Release a patch version
4. Publicly disclose after 30 days
5. Credit the reporter (unless anonymity requested)

---

## Safe Harbor

We support safe harbor for researchers who:
- Avoid privacy violations, data destruction, service interruption
- Only interact with owned accounts or with permission
- Don't exploit beyond proof of concept
- Report findings promptly

---

**For immediate safety concerns (fire, injury, chemical exposure), contact local emergency services first.**