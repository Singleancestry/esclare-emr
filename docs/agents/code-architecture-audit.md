# Code Architecture Audit

The architecture review found branch permission bleed, multi-step writes that could partially commit, and sensitive reads outside explicit service boundaries. Remediation introduced branch-specific permission maps, request-cached staff context, security-definer transactional RPCs, server-only data modules, and visible failure states.

Source verdict: materially improved and locally coherent. Residual risk: SQL behavior has not been exercised against a disposable Supabase project.
