import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import App from "./App.tsx";
import IntlProvider from "./IntlProvider.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <IntlProvider>
          <App />
        </IntlProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);
