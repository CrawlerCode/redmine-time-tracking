import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { ErrorComponent } from "@/components/error/ErrorComponent";
import { Layout } from "@/components/general/Layout";
import Providers from "@/provider/Providers.tsx";
import { queryClient } from "@/provider/QueryClientProvider";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { Settings, useSettings } from "@/provider/SettingsProvider";
import { routeTree } from "@/routeTree.gen";
import { Entrypoint, getEntrypoint } from "@/utils/entrypoint";
import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

const entrypoint = getEntrypoint();

export interface RouteContext {
  entrypoint: Entrypoint;
  settings: Settings;
  queryClient: QueryClient;
  redmineApi: RedmineApiClient;
}

const hashHistory = createHashHistory();
const router = createRouter({
  routeTree,
  history: hashHistory,
  context: {
    entrypoint,
    settings: undefined!,
    queryClient,
    redmineApi: undefined!,
  },
  defaultErrorComponent: ErrorComponent,
  defaultPendingMs: 250,
  defaultPendingMinMs: 250,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();

  return (
    <RouterProvider
      router={router}
      context={{
        settings,
        redmineApi,
      }}
    />
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout entrypoint={entrypoint}>
      <Providers>
        <App />
        <Toaster />
      </Providers>
    </Layout>
  </React.StrictMode>
);
