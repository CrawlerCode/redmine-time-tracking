import { TAccount, TCreateTimeEntry, TIssue, TSearchResult, TTimeEntryActivity } from "../types/redmine";
import instance from "./axios.config";

export const getMyAccount = async (): Promise<TAccount> => {
  return instance.get("/my/account.json").then((res) => res.data.user);
};

export const getAllMyOpenIssues = async (offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&assigned_to_id=me&sort=updated_on:desc`).then((res) => res.data.issues);
};

export const getOpenIssues = async (ids: number[], offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&issue_id=${ids.join(",")}&sort=updated_on:desc`).then((res) => res.data.issues);
};

export const createTimeEntry = async (entry: TCreateTimeEntry) => {
  return instance
    .post("/time_entries.json", {
      time_entry: entry,
    })
    .then((res) => res.data);
};

export const getTimeEntryActivities = async (): Promise<TTimeEntryActivity[]> => {
  return instance.get("/enumerations/time_entry_activities.json").then((res) => res.data.time_entry_activities);
};

export const searchOpenIssues = async (query: string): Promise<TSearchResult[]> => {
  return instance.get(`/search.json?q=${query}&scope=my_project&titles_only=1&issues=1&open_issues=1`).then((res) => res.data.results);
};
