# Admin Boilerplate

A modern, production-ready Admin Dashboard template built with React, Vite, and TypeScript. Designed for scalability and developer experience.

## 🚀 Tech Stack

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Routing**: [TanStack Router](https://tanstack.com/router/latest)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Auth) & [TanStack Query](https://tanstack.com/query/latest) (Server State)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
-   **Tables**: [TanStack Table](https://tanstack.com/table/latest) (Headless UI)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **HTTP Client**: [Axios](https://axios-http.com/)

## ✨ Key Features

### 🛡️ Core
-   **Authentication**: Complete login flow with persistent state and protected routes.
-   **Role-Based Access**: Scalable permission system (ready for implementation).
-   **Global Error Handling**: Centralized error boundaries and 404 pages.
-   **PWA Ready**: Offline support and installable.

### 🧩 UI Components
-   **Data Table**:
    -   Server-side pagination, sorting, and filtering.
    -   **Faceted Filters**: Advanced filtering (like Gmail/Linear).
    -   **Table Skeleton**: Smooth loading states.
-   **Forms**:
    -   **Reusable Wrappers**: `FormInput`, `FormSelect`, `FormTextarea`, `FormCheckbox`.
    -   **File Upload**: Drag & drop zone with image/PDF previews (`FormFileUpload`).
    -   **Validation**: Zod schema integration.
-   **Global Feedback**:
    -   **Toaster**: Success/Error notifications (Sonner).
    -   **Confirm Dialog**: Standardized modal for dangerous actions.
    -   **NProgress**: Top transition bar for route changes.

### 🎨 Theming
-   **Dark Mode**: System-aware dark mode with toggle.
-   **Responsive Layout**: Collapsible sidebar, mobile menu, and user dropdown.

## 📂 Project Structure

```
src/
├── components/
│   ├── common/         # App-specific reusable components (DataTable, FileUpload, etc.)
│   │   └── form/       # React Hook Form wrappers
│   └── ui/             # Shadcn UI primitives (Button, Input, etc.)
├── hooks/              # Custom hooks (useDebounce, useLocalStorage)
├── lib/                # Utilities (cn, formatters)
├── pages/              # Application views/routes
├── services/           # API integration layers
├── stores/             # Global state (Zustand)
├── types/              # TypeScript definitions
├── validations/        # Zod schemas
└── styles/             # Global CSS
```

## 🛠️ Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd admin-boilerplate
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Build for production:
    ```bash
    npm run build
    ```

## 🧩 Component Usage Examples

### Data Table
```tsx
<DataTable
  columns={columns}
  data={data}
  facets={[
    {
      key: "status",
      title: "Status",
      options: [{ label: "Active", value: "active" }]
    }
  ]}
/>
```

### Form Wrappers
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormInput control={form.control} name="email" label="Email" />
    <FormFileUpload control={form.control} name="avatar" label="Avatar" />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

## 📜 License

MIT
