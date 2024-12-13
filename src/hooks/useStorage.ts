import { useEffect, useState } from "react";

const Storage = {
  getItem: async (key: string) => (await chrome.storage.local.get(key))[key],
  setItem: (key: string, value: string) => chrome.storage.local.set({ [key]: value }),
  removeItem: (key: string) => chrome.storage.local.remove(key),
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

export const getStorage = async <T>(name: string, defaultValue: T): Promise<T> => {
  const data = await Storage.getItem(name);
  if (!data) return defaultValue;
  return Storage.deserialize(data);
};

export const setStorage = <T>(name: string, data: T) => {
  Storage.setItem(name, Storage.serialize(data));
};

const useStorage = <T>(name: string, defaultValue: T) => {
  const [localData, setLocalData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // set data to storage
  const setData = (data: T) => setStorage(name, data);

  // Init load data
  useEffect(() => {
    getStorage(name, defaultValue).then((data) => {
      setLocalData(data);
      setIsLoading(false);
    });
  }, [name, defaultValue]);

  // On chrome storage change => load data
  useEffect(() => {
    const onChange: Parameters<typeof chrome.storage.local.onChanged.addListener>[0] = (changes) => {
      if (!changes[name]) return; // other changed
      setLocalData(Storage.deserialize(changes[name].newValue));
    };

    chrome.storage.local.onChanged.addListener(onChange);
    return () => chrome.storage.local.onChanged.removeListener(onChange);
  }, [name]);

  return { data: localData, setData, isLoading };
};

export default useStorage;
