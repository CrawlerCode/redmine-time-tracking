import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { HashRouter } from "react-router-dom";
import IntlProvider from "./IntlProvider";
import QueryClientProvider from "./QueryClientProvider";
import RedmineApiProvider from "./RedmineApiProvider";
import SettingsProvider from "./SettingsProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <HashRouter>
      <SettingsProvider>
        <RedmineApiProvider>
          <QueryClientProvider>
            <IntlProvider>
              {children}
              <Toaster />
            </IntlProvider>
          </QueryClientProvider>
        </RedmineApiProvider>
      </SettingsProvider>
    </HashRouter>
  );
};

export default Providers;
