import { PropsWithChildren } from "react";
import IntlProvider from "./IntlProvider";
import QueryClientProvider from "./QueryClientProvider";
import RedmineApiProvider from "./RedmineApiProvider";
import SettingsProvider from "./SettingsProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider>
      <SettingsProvider>
        <RedmineApiProvider>
          <IntlProvider>{children}</IntlProvider>
        </RedmineApiProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default Providers;
