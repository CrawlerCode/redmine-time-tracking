import { useEffect, useState } from "react";

const useStorage = <T>(name: string, defaultValue: T) => {
  const [localData, setLocalData] = useState(defaultValue);

  // load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getChromeStorage(name, defaultValue);
        setLocalData(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    };

    // init load
    loadData();

    // load on custom event "local-storage"
    window.addEventListener("local-storage", loadData);
    return () => {
      window.removeEventListener("local-storage", loadData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set data to storage
  const setData = (data: T) => {
    setLocalData(data);
    setChromeStorage(name, data);
    // fire custom event "local-storage"
    window.dispatchEvent(new Event("local-storage"));
  };

  return { data: localData, setData };
};

export const getChromeStorage = <T>(name: string, defaultValue: T) => {
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

export const setChromeStorage = <T>(name: string, data: T) => {
  chrome.storage.local.set({ [name]: JSON.stringify(data) });
};

export default useStorage;
