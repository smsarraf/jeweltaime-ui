# AGENTS.md

## Scope and Big Picture
- This repo has **three parts**: static HTML/CSS pages at root (`home.html`, `shop-right-sidebar.html`), a legacy Express server in `server/`, and the active Vue 3 SPA in `vue-app/`.
- The Vue app is the main product surface. Start there unless a task explicitly targets legacy static pages or OAuth/dev middleware.
- Runtime flow is: Vue UI (`vue-app/src`) -> Axios client (`vue-app/src/utils/auth.js`) -> ERP/API backend (`VITE_API_URL`, default `http://localhost:3000/api/v1`) and selected local Express routes.
- The server (`server/index.js`) mainly provides auth/social routes, Airwallex endpoints, and API proxy-style utilities under `server/routes/` + `server/services/`.

## What To Read First
- Global coding/agent conventions: `.clinerules`.
- Deep Vue guidance and project patterns: `vue-app/AGENTS.md`.
- Env contract: `vue-app/.env.example`.
- Historical migration context (HTML -> Vue): `cline_context.md`.

## Developer Workflows
- Vue app dev/build (run in `vue-app/`):
  - `npm run dev` (Vite dev server)
  - `npm run build`
  - `npm run preview`
- Server dev/start (run in `server/`):
  - `npm run dev` (nodemon)
  - `npm start`
- Root `package.json` also exists for legacy root-server usage; avoid mixing root/server/vue-app installs in one shell session.

## Project-Specific Coding Patterns
- Use Pinia stores in `vue-app/src/stores/` (`defineStore`, state/getters/actions). Example: `cartStore.js` computes totals and mutates cart state via actions.
- Router uses lazy-loaded page components in `vue-app/src/router/index.js`; follow existing route naming and dynamic params (`:id`, `:slug`).
- API/auth behavior is centralized in `vue-app/src/utils/auth.js`:
  - request interceptor injects Bearer token from localStorage
  - response interceptor queues requests during token refresh (avoid per-feature refresh logic)
- Keep Vue features in existing structure: `components/`, `pages/`, `stores/`, `utils/`; prefer extending existing stores/utilities over duplicating API logic in components.

## Integrations and Boundaries
- Social auth strategies are wired in server middleware/routes (`server/services/passport.js`, `server/routes/social-auth.js`, `server/routes/auth.js`).
- Payment integration lives in `server/routes/airwallex.js` + `server/services/airwallexService.js`.
- Domain APIs are split by route files (`categories.js`, `orders.js`, `wishlist.js`, `shipping-addresses.js`, etc.); keep endpoint-specific logic close to its route/service pair.
- Cross-component communication in Vue should happen through Pinia stores and router state, not ad-hoc global variables.

## Agent Execution Tips (This Repo)
- For UI/product changes, modify `vue-app/src` first and only touch root HTML files when explicitly requested.
- When adding API calls, use the shared Axios/auth pipeline so refresh + token handling remain consistent.
- When changing auth/payment flows, inspect both frontend caller and matching server route/service before editing.
- Preserve asset path conventions from Vite public/static usage (`vue-app/public/` and imports from `src/assets/`).

