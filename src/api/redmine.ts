import { AxiosInstance } from "axios";
import { formatISO } from "date-fns";
import { TAccount, TCreateTimeEntry, TIssue, TIssuesPriority, TMembership, TProject, TReference, TSearchResult, TTimeEntry, TTimeEntryActivity, TUpdateIssue, TVersion } from "../types/redmine";

export class RedmineApi {
  private instance: AxiosInstance;
  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async getMyAccount(): Promise<TAccount> {
    return this.instance.get("/my/account.json").then((res) => res.data.user);
  }

  // Issues
  async getAllMyOpenIssues(offset = 0, limit = 100): Promise<TIssue[]> {
    return this.instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&assigned_to_id=me&sort=updated_on:desc`).then((res) => res.data.issues);
  }

  async getOpenIssuesByIds(ids: number[], offset = 0, limit = 100): Promise<TIssue[]> {
    return this.instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&issue_id=${ids.join(",")}&sort=updated_on:desc`).then((res) => res.data.issues);
  }

  async getOpenIssuesByProject(projectId: number, offset = 0, limit = 100): Promise<TIssue[]> {
    return this.instance.get(`/issues.json?offset=${offset}&limit=${limit}&status_id=open&project_id=${projectId}&sort=updated_on:desc`).then((res) => res.data.issues);
  }

  async searchOpenIssues(query: string): Promise<TSearchResult[]> {
    return this.instance.get(`/search.json?q=${query}&scope=my_project&titles_only=1&issues=1&open_issues=1`).then((res) => res.data.results);
  }

  async updateIssue(id: number, issue: TUpdateIssue) {
    return this.instance
      .put(`/issues/${id}.json`, {
        issue: issue,
      })
      .then((res) => res.data);
  }

  async getIssuePriorities(): Promise<TIssuesPriority[]> {
    return this.instance.get("/enumerations/issue_priorities.json").then((res) => res.data.issue_priorities);
  }

  // Projects
  async getAllMyProjects(offset = 0, limit = 100): Promise<TProject[]> {
    return this.instance.get(`/projects.json?offset=${offset}&limit=${limit}`).then((res) => res.data.projects);
  }

  async searchProjects(query: string): Promise<TSearchResult[]> {
    return this.instance.get(`/search.json?q=${query}&scope=my_project&titles_only=1&projects=1`).then((res) => res.data.results);
  }

  async getProjectMemberships(id: number, offset = 0, limit = 100): Promise<TMembership[]> {
    return this.instance.get(`/projects/${id}/memberships.json?offset=${offset}&limit=${limit}`).then((res) => res.data.memberships);
  }

  async getProjectVersions(id: number): Promise<TVersion[]> {
    return this.instance.get(`/projects/${id}/versions.json`).then((res) => res.data.versions);
  }

  // Time entries
  async getAllMyTimeEntries(from: Date, to: Date, offset = 0, limit = 100): Promise<TTimeEntry[]> {
    return this.instance
      .get(`/time_entries.json?offset=${offset}&limit=${limit}&user_id=me&from=${formatISO(from, { representation: "date" })}&to=${formatISO(to, { representation: "date" })}`)
      .then((res) => res.data.time_entries);
  }

  async createTimeEntry(entry: TCreateTimeEntry) {
    return this.instance
      .post("/time_entries.json", {
        time_entry: {
          ...entry,
          spent_on: entry.spent_on ? formatISO(entry.spent_on, { representation: "date" }) : undefined,
        },
      })
      .then((res) => res.data);
  }

  async getTimeEntryActivities(): Promise<TTimeEntryActivity[]> {
    return this.instance.get("/enumerations/time_entry_activities.json").then((res) => res.data.time_entry_activities);
  }

  // Other
  async getAllRoles(): Promise<TReference[]> {
    return this.instance.get(`/roles.json`).then((res) => res.data.roles);
  }
}
