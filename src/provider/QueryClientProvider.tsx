import { TRedmineError } from "@/types/redmine";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AxiosError, isAxiosError } from "axios";
import { lazy, ReactNode, Suspense, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { toast, ToastT } from "sonner";
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
    onError: (error, query) => {
      if (query.meta?.displayErrorToast === false) return;

      const description = isAxiosError(error) ? (error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") || error.message : error instanceof Error ? error.message : String(error);
      const previousToast = toast.getToasts().find((t) => t.id === "failed-to-load-data") as ToastT | undefined;
      toast.error(<FormattedMessage id="general.error.fail-to-load-data" />, {
        id: "failed-to-load-data",
        description: (
          <>
            {previousToast?.description}
            <p>{description}</p>
          </>
        ),
        action: {
          label: <FormattedMessage id="general.retry" />,
          onClick: (e) => {
            if (previousToast?.action && typeof previousToast.action === "object" && "onClick" in previousToast.action) {
              previousToast.action.onClick(e);
            }
            queryClient.refetchQueries({
              queryKey: query.queryKey,
              exact: true,
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
      const description = isAxiosError(error) ? (error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") || error.message : error instanceof Error ? error.message : String(error);
      toast.error(title, {
        description,
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
