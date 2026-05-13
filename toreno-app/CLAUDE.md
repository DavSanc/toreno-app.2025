# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Toreno Pastelería — a bakery/pastry shop web app. Monorepo with a Node.js/Express REST API backend and a React/Vite frontend.

## Commands

### Backend (`/backend`)
```bash
cd backend
npm run dev      # nodemon watch mode (development)
npm start        # node src/server.js (production)
```

### Frontend (`/frontend`)
```bash
cd frontend
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Environment Variables

Backend requires a `.env` file in `/backend`:
```
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

## Architecture

### Backend (`/backend/src`)
- `server.js` — Express app entry point. Currently the DB-connected routes (`/api/auth`, `/api/products`, `/api/orders`) are **commented out**; the server serves hardcoded product data from `/api/products`. The full route implementations exist in `routes/` and `controllers/` but are not wired up yet.
- `config/database.js` — PostgreSQL connection pool via `pg`. Uses `DATABASE_URL` with SSL.
- `middleware/authMiddleware.js` — JWT verification; attaches `req.user = { id, username, role }`.
- `middleware/roleMiddleware.js` — Role-based access control with four roles: `admin`, `gerente`, `cajero`, `pastelero`. Exports `checkRole(...roles)` and convenience shortcuts (`isAdmin`, `isAdminOrGerente`, `isAdminOrCajero`, `isPastelero`).
- `controllers/` — Business logic, direct SQL queries via `pool` (no ORM). Order creation uses transactions.
- `routes/` — Express routers. Auth: `POST /login` is public; `POST /register` requires admin. Products: GET routes are public; mutations require auth + role. Orders: all routes require auth.
- `models/` — Files exist but are empty; SQL is written directly in controllers.

### Frontend (`/frontend/src`)
- `App.jsx` — Root component. Fetches products from `http://localhost:3001/api` on mount via axios and renders them in a grid. Backend URL is hardcoded.
- `components/Header.jsx` — Nav bar with brand and login button (not yet wired to auth).
- `components/Hero.jsx` — Hero section.
- `components/ProductCard.jsx` — Card for a single product.
- Tailwind CSS v4 with custom brand colors: `toreno-green` (#8BC34A) and `toreno-dark` (#689F38).

### Key Current State
- The backend's full auth/products/orders routing is implemented but **commented out** in `server.js`. To enable it, uncomment the imports and `app.use(...)` lines and ensure the DB is reachable.
- The frontend has no authentication UI yet; the "Acceder" button in `Header.jsx` is a placeholder.
- No test suite is set up.
