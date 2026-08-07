# TODO - Unified CICS Administration Dashboard

## Goal
Consolidate "Manage Academic Programs", "Manage Faculty", and "Manage News" into the Dashboard's "Add New Content" workflow as tabs, with a design that matches the site's navy/gold/cream aesthetic.

- [ ] 1. Rewrite `src/pages/Dashboard.jsx` into a unified admin hub with content-type tabs (Content, Academic Programs, Faculty, News) and per-tab "Add New" buttons + modal forms.
- [ ] 2. Update `src/App.jsx` so `/dashboard/programs`, `/dashboard/faculty`, `/dashboard/news` route to the unified dashboard with the correct tab auto-selected (keep `/dashboard` default to Content tab).
- [ ] 3. Add/verify CSS styles in `src/App.css` for the admin tab bar, unified cards, tables, and modal treatments.
- [ ] 4. Verify build (`npm run build`).

