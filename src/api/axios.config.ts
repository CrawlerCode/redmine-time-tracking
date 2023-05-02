import axios from "axios";
import { getSettings } from "../hooks/useSettings";

const instance = axios.create();

export const loadRedmineConfig = async () => {
  const settings = await getSettings();
  instance.defaults.baseURL = settings.redmineURL;
  instance.defaults.headers["X-Redmine-API-Key"] = settings.redmineApiKey;
};

loadRedmineConfig();

export default instance;
