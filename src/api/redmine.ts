import { formatISO } from "date-fns";
import { TAccount, TCreateTimeEntry, TIssue, TSearchResult, TTimeEntry, TTimeEntryActivity } from "../types/redmine";
import instance from "./axios.config";

export const getMyAccount = async (): Promise<TAccount> => {
  return instance.get("/my/account.json").then((res) => res.data.user);
};

// Issues
export const getAllMyOpenIssues = async (offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&assigned_to_id=me&sort=updated_on:desc`).then((res) => res.data.issues);
};

export const getOpenIssuesByIds = async (ids: number[], offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&issue_id=${ids.join(",")}&sort=updated_on:desc`).then((res) => res.data.issues);
};

export const getOpenIssuesByProject = async (projectId: number, offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&project_id=${projectId}&sort=updated_on:desc`).then((res) => res.data.issues);
};

export const searchOpenIssues = async (query: string): Promise<TSearchResult[]> => {
  return instance.get(`/search.json?q=${query}&scope=my_project&titles_only=1&issues=1&open_issues=1`).then((res) => res.data.results);
};

export const searchProjects = async (query: string): Promise<TSearchResult[]> => {
  return instance.get(`/search.json?q=${query}&scope=my_project&titles_only=1&projects=1`).then((res) => res.data.results);
};

export const updateIssue = async (id: number, issue: Partial<Omit<TIssue, "id">>) => {
  return instance
    .put(`/issues/${id}.json`, {
      issue: issue,
    })
    .then((res) => res.data);
};

// Time entries
export const getAllMyTimeEntries = async (from: Date, to: Date, offset = 0, limit = 100): Promise<TTimeEntry[]> => {
  return instance.get(`/time_entries.json?offset=${offset}&limit=${limit}&user_id=me&from=${formatISO(from, { representation: "date" })}&to=${formatISO(to, { representation: "date" })}`).then((res) => res.data.time_entries);
};

export const createTimeEntry = async (entry: TCreateTimeEntry) => {
  return instance
    .post("/time_entries.json", {
      time_entry: {
        ...entry,
        spent_on: entry.spent_on ? formatISO(entry.spent_on, { representation: "date" }) : undefined,
      },
    })
    .then((res) => res.data);
};

export const getTimeEntryActivities = async (): Promise<TTimeEntryActivity[]> => {
  return instance.get("/enumerations/time_entry_activities.json").then((res) => res.data.time_entry_activities);
};
