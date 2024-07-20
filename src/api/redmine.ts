import { AxiosInstance } from "axios";
import { formatISO } from "date-fns";
import {
  TCreateIssue,
  TCreateTimeEntry,
  TIssue,
  TIssuePriority,
  TIssueTracker,
  TMembership,
  TProject,
  TReference,
  TRole,
  TSearchResult,
  TTimeEntry,
  TTimeEntryActivity,
  TUpdateIssue,
  TUser,
  TVersion,
} from "../types/redmine";

export class RedmineApi {
  private instance: AxiosInstance;
  constructor(instance: AxiosInstance) {
    this.instance = instance;
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

  async createIssue(issue: TCreateIssue) {
    return this.instance
      .post("/issues.json", {
        issue: {
          ...issue,
          start_date: issue.start_date ? formatISO(issue.start_date, { representation: "date" }) : undefined,
          due_date: issue.due_date ? formatISO(issue.due_date, { representation: "date" }) : undefined,
        },
      })
      .then((res) => res.data);
  }

  async updateIssue(id: number, issue: TUpdateIssue) {
    return this.instance
      .put(`/issues/${id}.json`, {
        issue: issue,
      })
      .then((res) => res.data);
  }

  async getIssuePriorities(): Promise<TIssuePriority[]> {
    return this.instance.get("/enumerations/issue_priorities.json").then((res) => res.data.issue_priorities);
  }

  async getIssueTrackers(): Promise<TIssueTracker[]> {
    return this.instance.get("/trackers.json").then((res) => res.data.trackers);
  }

  /* async getIssueStatuses(): Promise<TIssueStatus[]> {
    return this.instance.get("/issue_statuses.json").then((res) => res.data.issue_statuses);
  } */

  // Projects
  async getAllMyProjects(offset = 0, limit = 100): Promise<TProject[]> {
    return this.instance.get(`/projects.json?offset=${offset}&limit=${limit}`).then((res) => res.data.projects);
  }

  async getProject(id: number): Promise<TProject> {
    return this.instance.get(`/projects/${id}.json?include=trackers,issue_categories,time_entry_activities`).then((res) => res.data.project);
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

  /* async getProjectCategories(id: number): Promise<TIssueCategory[]> {
    return this.instance.get(`/projects/${id}/issue_categories.json`).then((res) => res.data.issue_categories);
  } */

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

  // Roles and permissions
  async getAllRoles(): Promise<TReference[]> {
    return this.instance.get(`/roles.json`).then((res) => res.data.roles);
  }

  async getRole(id: number): Promise<TRole> {
    return this.instance.get(`/roles/${id}.json`).then((res) => res.data.role);
  }

  async getMyUser(): Promise<TUser> {
    return this.instance.get("/users/current.json?include=memberships").then((res) => res.data.user);
  }
}
