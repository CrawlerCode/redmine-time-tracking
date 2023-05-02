import { Issue } from "../types/redmine";
import instance from "./axios.config";

export const getAllMyOpenIssues = async (offset = 0): Promise<Issue[]> => {
  return instance.get(`/issues.json?limit=100&offset=${offset}&status_id=open&assigned_to_id=me`).then((res) => res.data.issues);
};
