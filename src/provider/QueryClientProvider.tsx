import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode } from "react";

type PropTypes = {
  children: ReactNode;
};

const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      cacheTime: CACHE_TIME,
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
  throttleTime: 1000 * 10,
});

const QueryClientProvider = ({ children }: PropTypes) => {
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
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
