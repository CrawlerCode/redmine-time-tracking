import axios, { InternalAxiosRequestConfig } from "axios";
import { getSettings } from "../hooks/useSettings";

const instance = axios.create();

instance.interceptors.request.use(
  async (config) => {
    if (!config.baseURL) {
      await loadRedmineConfig(config);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loadRedmineConfig = async (config?: InternalAxiosRequestConfig) => {
  const settings = await getSettings();

  // set instance config
  instance.defaults.baseURL = settings.redmineURL;
  instance.defaults.headers["X-Redmine-API-Key"] = settings.redmineApiKey;

  // set current config
  if (config) {
    config.baseURL = settings.redmineURL;
    config.headers["X-Redmine-API-Key"] = settings.redmineApiKey;
  }
};

export default instance;
