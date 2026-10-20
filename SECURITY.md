# Security Policy

## Supported Versions

We take security seriously. The following versions of Cap Collective are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **security@capcollective.org** (or through GitHub's private vulnerability reporting).

### What to Include

Please include as much information as possible:

- Type of issue (e.g., buffer overflow, SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Development**: Varies by complexity
- **Disclosure Coordination**: We will coordinate with you on disclosure timing

## Security Considerations for Schools

Cap Collective is designed for educational environments. Special security considerations include:

### Student Data Privacy
- No personally identifiable information (PII) is collected by default
- Student names in spreadsheets are local-only (not uploaded to cloud)
- Sensor data is anonymous (bin IDs only)
- Supabase anon key used (no user authentication by default)
- Compliant with FERPA, COPPA, GDPR for educational use

### IoT Device Security
- ESP-NOW communication is local (no internet exposure for nodes)
- Radio Tower is the only device connecting to WiFi/Supabase
- WiFi credentials stored in firmware (rotate per deployment)
- Supabase Row Level Security (RLS) policies recommended
- Firmware OTA updates not implemented (physical access required)

### Dashboard Security
- Next.js deployed to Vercel/Netlify with HTTPS enforced
- Supabase anon key in environment variables (not committed)
- No authentication by default - add auth for multi-school deployments
- Rate limiting on API routes recommended

### Physical Safety (Not Cybersecurity)
See `04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md` for:
- Machine operation safety
- Ventilation requirements
- PPE requirements
- Emergency procedures
- Temperature limits (never exceed 200°C)

## Dependency Security

We use automated tools to monitor dependencies:

- **GitHub Dependabot** - Automated PRs for vulnerable dependencies
- **npm audit** - Run in CI for dashboard dependencies
- **PlatformIO** - Checks firmware library vulnerabilities

To audit locally:
```bash
# Dashboard
cd cap-collective-dashboard
npm audit

# Firmware (PlatformIO)
cd firmware/node1_cap_counter
pio lib list --outdated
```

## Disclosure Policy

When a security vulnerability is confirmed, we will:

1. Develop and test a fix
2. Prepare a security advisory
3. Release a patch version
4. Publicly disclose after users have time to update (typically 30 days)
5. Credit the reporter (unless they request anonymity)

## Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption of services
- Only interact with accounts you own or with explicit permission
- Do not exploit vulnerabilities beyond what's needed to prove concept
- Report findings promptly through our security email

---

**For immediate safety concerns (fire, injury, chemical exposure), contact local emergency services first.**
