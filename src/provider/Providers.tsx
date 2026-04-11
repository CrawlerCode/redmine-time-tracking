import { TooltipProvider } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";
import IntlProvider from "./IntlProvider";
import QueryClientProvider from "./QueryClientProvider";
import RedmineApiProvider from "./RedmineApiProvider";
import { SettingsProvider } from "./SettingsProvider";
import { TimerApiProvider } from "./TimerApiProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider>
      <SettingsProvider>
        <RedmineApiProvider>
          <IntlProvider>
            <TimerApiProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </TimerApiProvider>
          </IntlProvider>
        </RedmineApiProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default Providers;
