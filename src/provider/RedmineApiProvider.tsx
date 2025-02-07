import axios from "axios";
import { ReactNode, createContext, use } from "react";
import { RedmineApi } from "../api/redmine";
import { useSettings } from "./SettingsProvider";

const RedmineApiContext = createContext<RedmineApi | null>(null);

const RedmineApiProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();

  return (
    <RedmineApiContext
      value={
        new RedmineApi(
          axios.create({
            baseURL: settings.redmineURL,
            headers: {
              "X-Redmine-API-Key": settings.redmineApiKey,
              "Cache-Control": "no-cache, no-store, max-age=0",
              Expires: "0",
            },
          })
        )
      }
    >
      {children}
    </RedmineApiContext>
  );
};

export const useRedmineApi = () => use(RedmineApiContext)!;

export default RedmineApiProvider;
