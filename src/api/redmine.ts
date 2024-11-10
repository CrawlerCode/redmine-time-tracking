import { AxiosInstance } from "axios";
import { formatISO } from "date-fns";
import qs from "qs";
import {
  TCreateIssue,
  TCreateTimeEntry,
  TIssue,
  TIssuePriority,
  TIssueStatus,
  TIssueTracker,
  TMembership,
  TPaginatedResponse,
  TProject,
  TReference,
  TRole,
  TSearchResult,
  TTimeEntry,
  TTimeEntryActivity,
  TUpdateIssue,
  TUpdateTimeEntry,
  TUser,
  TVersion,
} from "../types/redmine";

export class RedmineApi {
  private instance: AxiosInstance;
  constructor(instance: AxiosInstance) {
    this.instance = instance;
    this.instance.interceptors.response.use(
      (response) => {
        const contentType = response.headers["content-type"];
        if (contentType && !contentType.startsWith("application/json")) {
          throw new Error(`Invalid content-type '${contentType}'. Expected 'application/json'`);
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized");
        }
        if (error.response?.status === 403) {
          throw new Error("Forbidden");
        }
        return Promise.reject(error);
      }
    );
  }

  // Issues
  async getOpenIssues(
    { projectId, issueIds, assignedTo }: { projectId?: number; issueIds?: number[]; assignedTo?: number | "me" },
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      issues: TIssue[];
    }>
  > {
    return this.instance
      .get(
        `/issues.json?${qs.stringify({
          project_id: projectId,
          issue_id: issueIds?.join(","),
          assigned_to_id: assignedTo,
          status_id: "open",
          sort: "updated_on:desc",
          offset,
          limit,
        })}`
      )
      .then((res) => res.data);
  }

  async searchOpenIssues(
    query: string,
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      results: TSearchResult[];
    }>
  > {
    return this.instance
      .get(
        `/search.json?${qs.stringify({
          q: query,
          scope: "my_project",
          titles_only: 1,
          issues: 1,
          open_issues: 1,
          offset,
          limit,
        })}`
      )
      .then((res) => res.data); // available since Redmine 3.3.0
  }

  async getIssue(id: number): Promise<TIssue> {
    return this.instance.get(`/issues/${id}.json?include=allowed_statuses`).then((res) => res.data.issue);
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
        issue: {
          ...issue,
          assigned_to_id: issue.assigned_to_id === null ? "" : issue.assigned_to_id, // Use empty string instead of null to remove the assignee
          start_date: issue.start_date ? formatISO(issue.start_date, { representation: "date" }) : issue.start_date,
          due_date: issue.due_date ? formatISO(issue.due_date, { representation: "date" }) : issue.due_date,
        },
      })
      .then((res) => res.data);
  }

  async getIssuePriorities(): Promise<TIssuePriority[]> {
    return this.instance.get("/enumerations/issue_priorities.json").then((res) => res.data.issue_priorities);
  }

  async getIssueTrackers(): Promise<TIssueTracker[]> {
    return this.instance.get("/trackers.json").then((res) => res.data.trackers);
  }

  async getIssueStatuses(): Promise<TIssueStatus[]> {
    return this.instance.get("/issue_statuses.json").then((res) => res.data.issue_statuses);
  }

  // Projects
  async getAllMyProjects({ offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }): Promise<
    TPaginatedResponse<{
      projects: TProject[];
    }>
  > {
    return this.instance
      .get(
        `/projects.json?${qs.stringify({
          offset,
          limit,
        })}`
      )
      .then((res) => res.data);
  }

  async getProject(id: number): Promise<TProject> {
    return this.instance.get(`/projects/${id}.json?include=trackers,issue_categories,time_entry_activities`).then((res) => res.data.project);
  }

  async searchProjects(query: string): Promise<TSearchResult[]> {
    return this.instance.get(`/search.json?q=${query}&scope=my_project&titles_only=1&projects=1`).then((res) => res.data.results);
  }

  async getProjectMemberships(
    id: number,
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      memberships: TMembership[];
    }>
  > {
    return this.instance
      .get(
        `/projects/${id}/memberships.json?${qs.stringify({
          offset,
          limit,
        })}`
      )
      .then((res) => res.data);
  }

  async getProjectVersions(id: number): Promise<TVersion[]> {
    return this.instance.get(`/projects/${id}/versions.json`).then((res) => res.data.versions);
  }

  /* async getProjectCategories(id: number): Promise<TIssueCategory[]> {
    return this.instance.get(`/projects/${id}/issue_categories.json`).then((res) => res.data.issue_categories);
  } */

  // Time entries
  async getAllMyTimeEntries(
    from: Date,
    to: Date,
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      time_entries: TTimeEntry[];
    }>
  > {
    return this.instance
      .get(
        `/time_entries.json?${qs.stringify({
          user_id: "me",
          from: formatISO(from, { representation: "date" }),
          to: formatISO(to, { representation: "date" }),
          offset,
          limit,
        })}`
      )
      .then((res) => res.data);
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

  async updateTimeEntry(id: number, entry: TUpdateTimeEntry) {
    return this.instance
      .put(`/time_entries/${id}.json`, {
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
