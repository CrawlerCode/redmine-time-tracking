import { getErrorMessage } from "@/utils/error";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { lazy, ReactNode, Suspense, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { toast } from "sonner";
import useStorage from "../hooks/useStorage";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      /**
       * Should display an error toast when the query fails
       *
       * @default true
       */
      displayErrorToast?: boolean;
    };
    mutationMeta: {
      /**
       * Should display a success toast when the mutation succeeds
       */
      successMessage?: string;
      /**
       * Error message to display in the toast when the mutation fails
       *
       * @default "An unknown error occurred"
       */
      errorMessage?: string;
    };
  }
}

const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: CACHE_TIME,
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (_, query) => {
      if (query.meta?.displayErrorToast === false) return;

      const failedQueries = queryClient
        .getQueryCache()
        .getAll()
        .filter((q) => q.state.error && q.meta?.displayErrorToast !== false);

      toast.error(<FormattedMessage id="general.error.fail-to-load-data" />, {
        id: "failed-to-load-data",
        dismissible: false,
        description: Object.entries(
          failedQueries.reduce((errors: Record<string, number>, q) => {
            const message = getErrorMessage(q.state.error);
            if (message) errors[message] = (errors[message] ?? 0) + 1;
            return errors;
          }, {})
        ).map(([msg, count]) => (
          <p key={msg}>
            {msg}
            {count > 1 ? ` (${count}x)` : null}
          </p>
        )),
        action: {
          label: <FormattedMessage id="general.retry" />,
          onClick: () => {
            failedQueries.forEach((q) => {
              queryClient.refetchQueries({ queryKey: q.queryKey, exact: true });
            });
          },
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
    },
    onError: (error, _variables, _context, mutation) => {
      const title = mutation.meta?.errorMessage || <FormattedMessage id="general.error.unknown-error-occurred" />;
      toast.error(title, {
        description: getErrorMessage(error),
        duration: 1000 * 60 * 5, // 5 minutes
      });
    },
  }),
});

const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => (await chrome.storage.local.get(key))[key],
    setItem: (key, value) => chrome.storage.local.set({ [key]: value }),
    removeItem: (key) => chrome.storage.local.remove(key),
  },
  throttleTime: 1000,
});

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

type PropTypes = {
  children: ReactNode;
};

const QueryClientProvider = ({ children }: PropTypes) => {
  const { data: showDevtools, setData: setShowDevtools } = useStorage("tanstackQueryDevtools", false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools(!showDevtools);
  }, [showDevtools, setShowDevtools]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        buster: chrome.runtime.getManifest().version,
        persister: persister,
        maxAge: CACHE_TIME,
      }}
    >
      {children}
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
