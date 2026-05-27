# Velora Auth 🌤️

A **premium‑grade, sky‑blue pastel authentication web app** built with **React**, **Vite**, **Tailwind CSS v4**, and the **FreeAPI Authentication Module**.  It provides a sleek, animated sign‑in / sign‑up experience that works flawlessly in both light and dark modes.

---

## ✨ What It Does
- **User Registration** – username, email, password, role selection.
- **User Login** – username or email + password with “remember me”.
- **Session Persistence** – JWT stored in `localStorage` (handled by the `AuthContext`).
- **Current User Retrieval** – fetches the logged‑in user profile.
- **Logout** – clears stored token and redirects to the login page.
- **Beautiful UI** – glass‑morphic cards, ambient animated blobs, smooth form transitions, and a sliding overlay panel for desktop.
- **Dark / Light Theme** – toggles automatically based on the `dark` class (e.g., from a `ThemeProvider` or OS preference).

---

## 🛠️ Tech Stack
| Layer | Library / Tool | Reason |
|------|----------------|--------|
| **Framework** | **React 18** (with **React Router DOM**) | Component‑based UI & routing |
| **Build** | **Vite** | Lightning‑fast dev server + ESBuild compilation |
| **Styling** | **Tailwind CSS v4** + custom CSS variables | Utility‑first design, easy theming, dark‑mode support |
| **Animations** | **Framer Motion** | Spring‑based, GPU‑accelerated animations |
| **Notifications** | **React Hot Toast** | Non‑blocking success / error toasts |
| **Icons** | **Lucide React** | Modern, lightweight SVG icons |
| **HTTP** | **Axios** | Promise‑based API calls |
| **Utility** | **shadcn/ui** (auth‑switch component) | Re‑usable UI primitives |
| **Type Safety** | **TypeScript** | Strong typing across the whole codebase |

---

## 📂 Project Structure (high‑level)
```
src/
├─ components/            # Reusable UI components (Button, Navbar, ProtectedRoute …)
│   └─ ui/auth-switch.tsx   # Premium sign‑in / sign‑up component (sliding overlay)
├─ context/               # AuthContext – provides login, register, logout utilities
├─ hooks/                 # useAuth – thin wrapper around AuthContext
├─ pages/                 # Dashboard, NotFound, etc.
├─ services/              # authService.ts – Axios wrapper for FreeAPI endpoints
├─ utils/                 # validators, class‑names helper (cn), etc.
├─ App.tsx                # Router & page transition wrapper
├─ index.css              # Tailwind imports + custom CSS vars (color palette & dark mode)
└─ main.tsx               # App entry point
```

---

## 🚀 How It Works
1. **Bootstrap** – Vite loads `index.css` which defines the pastel colour palette and a `@custom-variant dark` rule that enables class‑based dark mode.
2. **Routing** – `BrowserRouter` renders `/login`, `/register`, `/dashboard`, etc. The `ProtectedRoute` component guards private routes.
3. **Auth Context**
   - `AuthProvider` holds the JWT token in `localStorage` and exposes `login`, `register`, `logout`, `currentUser`.
   - `useAuth` hook gives components easy access to these functions.
4. **Auth Service** – `src/services/authService.ts` communicates with the FreeAPI endpoints:
   ```ts
   POST   /api/v1/users/register   → register
   POST   /api/v1/users/login      → login (returns JWT)
   POST   /api/v1/users/logout     → logout (server side)
   GET    /api/v1/users/current-user → fetch profile
   ```
5. **UI Flow** – `AuthSwitch` (the component we added via `shadcn`) renders two panels:
   - **Mobile** – a tab switcher with `AnimatePresence` for smooth fade‑in/out.
   - **Desktop** – a side‑by‑side layout where a **gradient overlay panel** slides left/right using Framer Motion’s `x` transform (GPU‑accelerated).  All colours use `dark:` variants, so the overlay, inputs, text, and blobs automatically adapt when the user toggles the theme.
6. **Form Validation** – Custom validators (`validateEmail`, `validateUsername`, `validatePassword`) provide instant feedback; errors are displayed with animated `<motion.p>` components.
7. **Feedback** – Success and error messages are shown via `react-hot-toast`.

---

## 🖥️ Run the Project Locally
```bash
# Clone the repo (already done)
cd "FreeAPI-auth"

# Install dependencies
npm install

# Start the dev server (Vite)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) – you’ll see the animated auth page.

### Build for Production
```bash
npm run build   # Vite creates an optimized bundle in /dist
```

---

## ⚙️ Environment Variables
Create a `.env` at the project root (Vite automatically prefixes with `VITE_`):
```
VITE_FREEAPI_BASE_URL=https://api.freeapi.app/api/v1
```
The `authService` uses this variable to build request URLs.

---

## 📦 Scripts
| Script | Description |
|--------|--------------|
| `dev`  | Starts Vite dev server with hot‑module reloading |
| `build`| Produces a highly‑optimized static bundle |
| `preview`| Serves the production build locally |
| `lint` | Runs ESLint/Prettier checks |

---

## 🎨 Design Choices
- **Palette** – Sky‑blue pastel (`#8ECAE6`, `#BDE0FE`, `#A9D6E5`) combined with a deep nebula dark theme (`#0D1B2A`).
- **Glass‑morphism** – Semi‑transparent card backgrounds + subtle border glow.
- **Ambient Blobs** – `motion.div` elements with large blurred circles create a living background.
- **Micro‑animations** – Input focus, button hover, form slide‑in/out, and overlay spring provide a premium feel.

---

## 🙏 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feat/awesome‑feature`)
3. Make your changes and run `npm run lint` to keep the code clean
4. Open a Pull Request – describe the change and why it improves the UI/UX or functionality.

---

## 📜 License
MIT – feel free to use, modify, and ship this starter as you wish.

---

*Happy building with Velora Auth!*
