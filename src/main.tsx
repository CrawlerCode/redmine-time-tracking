import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import App from "./App.tsx";
import "./index.css";
import IntlProvider from "./provider/IntlProvider.tsx";
import QueryClientProvider from "./provider/QueryClientProvider.tsx";
import RedmineApiProvider from "./provider/RedmineApiProvider.tsx";
import SettingsProvider from "./provider/SettingsProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <SettingsProvider>
        <RedmineApiProvider>
          <QueryClientProvider>
            <IntlProvider>
              <App />
            </IntlProvider>
          </QueryClientProvider>
        </RedmineApiProvider>
      </SettingsProvider>
    </HashRouter>
  </React.StrictMode>
);
