import Providers from "@/provider/Providers.tsx";
import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { RedmineApi } from "./api/redmine";
import { ErrorComponent } from "./components/error/ErrorComponent";
import { Layout } from "./components/general/Layout";
import "./index.css";
import { queryClient } from "./provider/QueryClientProvider";
import { useRedmineApi } from "./provider/RedmineApiProvider";
import { Settings, useSettings } from "./provider/SettingsProvider";
import { routeTree } from "./routeTree.gen";
import { getWindowLocationType } from "./utils/popout";

export interface RouteContext {
  settings: Settings;
  queryClient: QueryClient;
  redmineApi: RedmineApi;
}

const hashHistory = createHashHistory();
const router = createRouter({
  routeTree,
  history: hashHistory,
  context: {
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

const locationType = getWindowLocationType();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout locationType={locationType}>
      <Providers suspense={locationType === "options"}>
        <App />
      </Providers>
    </Layout>
  </React.StrictMode>
);
