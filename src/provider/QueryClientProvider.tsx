import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode, Suspense, lazy, useEffect } from "react";
import useStorage from "../hooks/useStorage";

type PropTypes = {
  children: ReactNode;
};

const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      gcTime: CACHE_TIME,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  },
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
