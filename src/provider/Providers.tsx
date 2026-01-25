import { PropsWithChildren, Suspense } from "react";
import IntlProvider from "./IntlProvider";
import QueryClientProvider from "./QueryClientProvider";
import RedmineApiProvider from "./RedmineApiProvider";
import SettingsProvider from "./SettingsProvider";

interface ProvidersProps extends PropsWithChildren {
  suspense?: boolean;
}

const Providers = ({ suspense, children }: ProvidersProps) => {
  const providers = (
    <QueryClientProvider>
      <SettingsProvider>
        <RedmineApiProvider>
          <IntlProvider>{children}</IntlProvider>
        </RedmineApiProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );

  if (suspense) {
    return <Suspense>{providers}</Suspense>;
  }

  return providers;
};

export default Providers;
