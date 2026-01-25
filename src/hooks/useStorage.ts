import { queryClient } from "@/provider/QueryClientProvider";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";
import { browser } from "wxt/browser";

const Storage = {
  getItem: async (key: string) => (await browser.storage.local.get<Record<string, string | undefined>>(key))[key],
  setItem: (key: string, value: string) => browser.storage.local.set({ [key]: value }),
  removeItem: (key: string) => browser.storage.local.remove(key),
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

export const getStorage = async <T>(name: string, defaultValue: T): Promise<T> => {
  const data = await Storage.getItem(name);
  if (!data) return defaultValue;
  return Storage.deserialize(data);
};

export const setStorage = async <T>(name: string, data: T) => {
  await Storage.setItem(name, Storage.serialize(data));
};

export const removeStorage = async (name: string) => {
  await Storage.removeItem(name);
};

const storageOptions = <T>(name: string, defaultValue: T) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["storage", name],
    queryFn: () => getStorage(name, defaultValue),
    staleTime: 0, // Always refetch the latest data
  });

/**
 * A hook to manage persistent storage using Chrome's local storage.
 * The data is cached using React Query to benefit from queryClient persister to improve performance.
 * It subscribes to changes to keep the data in sync across different instances (e.g., different tabs or windows).
 */
export const useStorage = <T>(name: string, defaultValue: T) => {
  const query = useQuery(storageOptions(name, defaultValue));

  const updateQueryDataEvent = useEffectEvent((data: T) => {
    queryClient.setQueryData(["storage", name], data, { updatedAt: Date.now() });
  });

  useEffect(() => {
    const onChange: Parameters<typeof browser.storage.local.onChanged.addListener>[0] = (changes) => {
      if (!changes[name]) return; // other changed
      updateQueryDataEvent(Storage.deserialize(changes[name].newValue as string));
    };

    browser.storage.local.onChanged.addListener(onChange);
    return () => browser.storage.local.onChanged.removeListener(onChange);
  }, [name]);

  return {
    isLoading: query.isLoading,
    data: query.data ?? defaultValue,
    setData: async (data: T) => {
      queryClient.setQueryData(["storage", name], data, { updatedAt: Date.now() });
      await setStorage(name, data);
    },
  };
};

/**
 * The suspense version of useStorage hook.
 */
export const useSuspenseStorage = <T>(name: string, defaultValue: T) => {
  const query = useSuspenseQuery(storageOptions(name, defaultValue));

  const updateQueryDataEvent = useEffectEvent((data: T) => {
    queryClient.setQueryData(["storage", name], data, { updatedAt: Date.now() });
  });

  useEffect(() => {
    const onChange: Parameters<typeof browser.storage.local.onChanged.addListener>[0] = (changes) => {
      if (!changes[name]) return; // other changed
      updateQueryDataEvent(Storage.deserialize(changes[name].newValue as string));
    };

    browser.storage.local.onChanged.addListener(onChange);
    return () => browser.storage.local.onChanged.removeListener(onChange);
  }, [name]);

  return {
    data: query.data,
    setData: async (data: T) => {
      queryClient.setQueryData(["storage", name], data, { updatedAt: Date.now() });
      await setStorage(name, data);
    },
  };
};
