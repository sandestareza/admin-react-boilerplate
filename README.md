# Admin Boilerplate

A modern, production-ready Admin Dashboard template built with React, Vite, and TypeScript.

## 🚀 Data Stacks

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Auth) & [TanStack Query](https://tanstack.com/query/latest) (Server State)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (Centralized instance with interceptors)
- **PWA**: [Vite PWA](https://vite-pwa-org.netlify.app/) (Offline support & installable)

## ✨ Key Features

- 🔐 **Authentication**: Login flow with persistent state.
- 🌓 **Dark Mode**: System-aware dark mode with toggle.
- 📱 **Responsive Admin Layout**: Collapsible sidebar, mobile menu, and user dropdown.
- 📦 **Product Management**: Full CRUD implementation using JSONPlaceholder (Service Pattern).
- 🧩 **Service Architecture**: API logic decoupled in `src/services`.
- ⚡ **PWA Ready**: Installable, custom install prompt, and auto-update capable.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd admin-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Shadcn + Custom)
├── lib/            # Utilities (api client, utils, etc.)
├── pages/          # Application views/routes
├── services/       # API integration layers (e.g., productService)
├── stores/         # Global state (Zustand)
├── validations/    # Zod schemas
└── styles/         # Global CSS
```

## 📜 Scripts

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
