import { useEffect, useState } from "react";

const useStorage = <T>(name: string, defaultValue: T) => {
  const [localData, setLocalData] = useState(defaultValue);

  // load data from storage
  const loadData = async () => {
    try {
      const data = await getChromeStorage(name, defaultValue);
      setLocalData(data);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  // set data to storage
  const setData = async (data: T) => {
    setLocalData(data);
    await setChromeStorage(name, data);
  };

  /**
   * Init load
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * On chrome storage change => load data
   */
  useEffect(() => {
    const onChange = () => {
      loadData();
    };
    chrome.storage.local.onChanged.addListener(onChange);
    return () => chrome.storage.local.onChanged.removeListener(onChange);
  }, []);

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

export const setChromeStorage = async <T>(name: string, data: T) => {
  await chrome.storage.local.set({ [name]: JSON.stringify(data) });
};

export default useStorage;
