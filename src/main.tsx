import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/api";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { useAuthStore } from "./stores/authStore";
import { ThemeProvider } from "@/components/theme-provider";

// Create router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // Nanti di-inject di komponen App
    queryClient, // Inject queryClient agar bisa dipakai di loader
  },
  defaultPreload: "intent", // Aktifkan prefetching saat hover
  // Karena kita pakai Query, kita set staleTime router ke 0
  // biar Query yang handle caching
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// PWA registration handled by vite-plugin-pwa via virtual module

function App() {
  const auth = useAuthStore();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          // INILAH KUNCINYA: Inject auth ke seluruh rute
          context={{ auth }}
        />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
