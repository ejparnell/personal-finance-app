# TBD

A gamified job‑hunting tracker that lets users earn **HopeBux** for real‑world application tasks and spend them on virtual Pokémon‑style booster packs.

---

## ✨ Features

- Track job applications, interviews, offers, and follow‑ups
- Earn **HopeBux** (1 / 5 / 10) for apply → reach‑out → interview
- Open booster packs; collect, view, and trade cards
- Real‑time dashboards for pipeline stats and card inventory
- Social or email sign‑in (NextAuth.js)
- Mobile‑first responsive UI

---

## 🛠 Tech Stack

| Layer      | Tech                                               |
| ---------- | -------------------------------------------------- |
| Frontend   | **Next.js 15**, React, TypeScript, SWR/React Query |
| Backend    | Next.js Route Handlers, Node, TypeScript           |
| Database   | MongoDB Atlas + Mongoose                           |
| Auth       | NextAuth.js                                        |
| Tooling    | ESLint, Prettier, Jest, Playwright, Husky          |
| Deployment | Vercel (preview & production)                      |

---

## 🏗 Architecture Overview

```code
User ──> Frontend (Next.js) ──> API Routes ──> MongoDB Atlas

```

_Core collections:_ `User`, `Profile`, `Job`, `Card`, `OwnedCard`, `PointLedger`.

---

## 🔑 Environment Variables

| Key               | Purpose                                 |
| ----------------- | --------------------------------------- |
| `MONGODB_URI`     | Atlas connection string                 |
| `NEXTAUTH_SECRET` | JWT secret for NextAuth                 |
| `NEXTAUTH_URL`    | App URL (e.g., `http://localhost:3000`) |

---

## 📜 Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start dev server                   |
| `pnpm build`      | Build for production               |
| `pnpm start`      | Run prod server                    |
| `pnpm lint`       | Run ESLint + Prettier checks       |
| `pnpm format`     | Auto‑format all code in `src/**/*` |
| `pnpm test`       | Unit tests (Jest)                  |
| `pnpm e2e`        | End‑to‑end tests (Playwright)      |
| `pnpm seed:cards` | Import Pokémon reference card data |

---

## 🌐 API Endpoints (v0)

| Method | URL               | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| GET    | `/api/jobs`       | List user jobs                           |
| POST   | `/api/jobs`       | Create a job                             |
| PATCH  | `/api/jobs/:id`   | Update a job                             |
| DELETE | `/api/jobs/:id`   | Soft‑delete a job                        |
| POST   | `/api/packs/open` | Open booster pack (atomic HopeBux debit) |
| GET    | `/api/cards`      | Filter cards (`?type=grass&rarity=rare`) |

Full reference in `docs/api.md` (TBD).

---

## 🧪 Testing

- **Unit tests** (Jest + ts‑jest) – ≥ 80 % coverage gate
- **Component tests** (React Testing Library)
- **E2E tests** (Playwright) – smoke flow: apply → earn → open pack

---

## 🛡 Security Notes

- Helmet‑style headers via `next.config.js`
- Secure, HTTP‑only cookies in production
- Rate‑limiting on `/api/packs/open`
- Zod validation on every request body

---

## 📈 Roadmap

- [ ] **v0.1** – Core loop (apply → HopeBux → pack‑opening)
- [ ] **v0.2** – Card trading & friends list
- [ ] **v1.0** – Mobile PWA + push notifications
- [ ] **v1.1** – Daily quests & streak bonuses

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
