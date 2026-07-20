# Multi-Agent Approval Matrix

| Review                   | Local source                                | Runtime environment         | Production approval |
| ------------------------ | ------------------------------------------- | --------------------------- | ------------------- |
| Architecture             | Pass with residual DB-runtime risk          | Not tested                  | Withheld            |
| Supabase security        | Static pass                                 | Blocked                     | Withheld            |
| Adversarial security     | Remediated findings                         | Negative-role tests blocked | Withheld            |
| Backup/restore           | Not applicable                              | No evidence                 | Rejected            |
| EMR integrity            | Source improved                             | DB integration blocked      | Withheld            |
| Website UX/accessibility | Automated local pass                        | Physical devices open       | Conditional         |
| Hero reliability         | Five-project local pass                     | Production CDN open         | Conditional         |
| Test quality             | Local suites pass with one documented flake | Real DB tests absent        | Withheld            |
| Performance/reliability  | Static improvements                         | Load/telemetry absent       | Withheld            |
| Release/deployment       | Build pass                                  | Not deployed                | Rejected            |
| Independent final audit  | Local release candidate                     | Evidence chain incomplete   | Rejected            |
