import { TCreateTimeEntry, TIssue, TTimeEntryActivity } from "../types/redmine";
import instance from "./axios.config";

export const getAllMyOpenIssues = async (offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&assigned_to_id=me&sort=updated_on:desc`).then((res) => res.data.issues);
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
