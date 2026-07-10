# Google Sheets Integration Guide

Google Sheets is not the official medical-record database. It is used only for catalog, price, package, promotion, branch availability, staff schedule and approved management-report workflows.

Phase 1 includes the environment contract and local mock provider setting. Phase 3 will add the full staging workflow:

1. Import sheet rows as pending changes.
2. Validate required columns.
3. Compare old and new values.
4. Require authorized approval.
5. Create a new database version.
6. Publish on the effective date.
7. Record audit events and sync logs.

Never export medical history, doctor notes, clinical photographs, detailed diagnoses, consent signatures, passwords or authentication data.
