import { useEffect, useState } from "react";

const useStorage = <T>(name: string, defaultValue: T) => {
  const [storageData, setStorageData] = useState(defaultValue);

  // load data from storage
  useEffect(() => {
    chrome.storage.local.get(name).then((result) => {
      if (result[name]) {
        try {
          setStorageData(JSON.parse(result[name]));
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set data to storage
  const setData = (data: T) => {
    setStorageData(data);
    chrome.storage.local.set({ [name]: JSON.stringify(data) });
  };

  return { data: storageData, setData };
};

export const getStorage = <T>(name: string, defaultValue: T) => {
  return new Promise<T>((resolve, reject) => {
    chrome.storage.local.get(name).then((result) => {
      try {
        resolve(result[name] ? JSON.parse(result[name]) : defaultValue);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default useStorage;
