import { TIssue } from "../types/redmine";
import instance from "./axios.config";

export const getAllMyOpenIssues = async (offset = 0, limit = 100): Promise<TIssue[]> => {
  return instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&assigned_to_id=me&sort=updated_on:desc`).then((res) => res.data.issues);
};
