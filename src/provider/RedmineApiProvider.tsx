import { ReactNode, createContext, use } from "react";
import { RedmineApiClient } from "../api/redmine/RedmineApiClient";
import { useSettings } from "./SettingsProvider";

const RedmineApiContext = createContext<RedmineApiClient | null>(null);

const RedmineApiProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();

  return <RedmineApiContext value={new RedmineApiClient(settings.redmineURL, settings.redmine.auth)}>{children}</RedmineApiContext>;
};

export const useRedmineApi = () => use(RedmineApiContext)!;

export default RedmineApiProvider;
