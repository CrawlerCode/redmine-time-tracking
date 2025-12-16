import { getErrorMessage } from "@/utils/error";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientOptions, PersistQueryClientProvider, persistQueryClientRestore } from "@tanstack/react-query-persist-client";
import { isAxiosError } from "axios";
import { lazy, PropsWithChildren, Suspense, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { toast } from "sonner";
import { browser } from "wxt/browser";
import { useStorage } from "../hooks/useStorage";

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
    };
  }
}

const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: CACHE_TIME,
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.displayErrorToast === false) return;

      if (!isAxiosError(error)) {
        toast.error(
          <FormattedMessage
            id="general.error.unknown-error"
            values={{
              name: error.name,
            }}
          />,
          {
            description: getErrorMessage(error),
            duration: 1000 * 60, // 1 minute
          }
        );
        return;
      }

      const failedQueries = queryClient
        .getQueryCache()
        .getAll()
        .filter((q) => q.state.error && isAxiosError(q.state.error) && q.meta?.displayErrorToast !== false);

      toast.error(<FormattedMessage id="general.error.api-error" />, {
        id: "api-error",
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
        duration: 1000 * 60, // 1 minute
      });
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
    },
    onError: (error) => {
      const title = isAxiosError(error) ? (
        <FormattedMessage id="general.error.api-error" />
      ) : (
        <FormattedMessage
          id="general.error.unknown-error"
          values={{
            name: error.name,
          }}
        />
      );
      toast.error(title, {
        description: getErrorMessage(error),
        duration: 1000 * 60 * 5, // 5 minutes
      });
    },
  }),
});

const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => (await browser.storage.local.get(key))[key],
    setItem: (key, value) => browser.storage.local.set({ [key]: value }),
    removeItem: (key) => browser.storage.local.remove(key),
  },
  throttleTime: 1000,
});

const persistOptions: Omit<PersistQueryClientOptions, "queryClient"> = {
  buster: browser.runtime.getManifest().version,
  persister,
  maxAge: CACHE_TIME,
};

export const restoreQueryClient = async () =>
  persistQueryClientRestore({
    queryClient,
    ...persistOptions,
  });

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
      <QueryClientDevtools />
    </PersistQueryClientProvider>
  );
};

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const QueryClientDevtools = () => {
  const { data: showDevtools, setData: setShowDevtools } = useStorage("tanstackQueryDevtools", false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools(!showDevtools);
  }, [showDevtools, setShowDevtools]);

  if (!showDevtools) return null;

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtoolsProduction />
    </Suspense>
  );
};

export default QueryClientProvider;
