# Security Policy

## Supported Versions

EvidenceAI is currently in active development. Security fixes are applied to the latest version on the `main` branch.

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ Yes |
| Older commits | ❌ No |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in EvidenceAI (e.g., API key exposure, injection risks, authentication bypass, or anything that could harm users), please report it privately:

📧 **Email**: bayajidalam2001@gmail.com  
**Subject**: `[SECURITY] EvidenceAI Vulnerability Report`

### What to Include
- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact (what an attacker could do)
- Your suggested fix (optional but appreciated)

### What to Expect
- **Acknowledgement** within 48 hours
- **Status update** within 7 days on whether the issue is accepted or declined
- If accepted: a fix will be prioritized and you'll be credited in the changelog (unless you prefer to stay anonymous)
- If declined: a clear explanation of why

---

## Known Limitations

As an open-source learning project, be aware:
- The app requires real API keys (`GEMINI_API_KEY`, `CHROMA_API_KEY`, `TAVILY_API_KEY`) — **never commit your `.env` file**
- There is currently no user authentication — do not deploy publicly with sensitive documents
- PDF content is stored in ChromaDB Cloud — do not upload confidential files

---

## Responsible Disclosure

We appreciate responsible disclosure and will acknowledge your contribution. Thank you for helping keep EvidenceAI safe! 🙏
