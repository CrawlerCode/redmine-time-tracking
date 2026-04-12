import { RedmineAuthenticationError } from "@/api/redmine/RedmineAuthenticationError";
import { Settings } from "@/provider/SettingsProvider";
import axios, { AxiosInstance, isAxiosError } from "axios";
import { formatISO } from "date-fns";
import qs from "qs";
import { browser } from "wxt/browser";
import { MissingRedmineConfigError } from "./MissingRedmineConfigError";
import {
  TCreateIssue,
  TCreateTimeEntry,
  TIssue,
  TIssuePriority,
  TIssueStatus,
  TIssueTracker,
  TMembership,
  TOAuthTokenResponse,
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
} from "./types";

export class RedmineApiClient {
  private instance: AxiosInstance;
  public id = crypto.randomUUID();
  private auth?: Settings["auth"];

  constructor(redmineURL: string, auth?: Settings["auth"]) {
    this.auth = auth;
    this.instance = axios.create({
      baseURL: redmineURL,
      headers: {
        ...(auth?.method === "apiKey" && { "X-Redmine-API-Key": auth.apiKey }),
        ...(auth?.method === "oauth2" && { Authorization: `Bearer ${auth.oauth2?.accessToken}` }),
        "Cache-Control": "no-cache, no-store, max-age=0",
        Expires: "0",
      },
    });
    this.instance.interceptors.request.use((config) => {
      if (!config.baseURL) {
        throw new MissingRedmineConfigError();
      }
      if (auth?.method === "oauth2" && !auth.oauth2?.accessToken && config.url !== "/oauth/token") {
        throw new RedmineAuthenticationError("Authorization required");
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => {
        const contentType = response.headers["content-type"];
        if (contentType && !contentType.startsWith("application/json")) {
          throw new Error(`Invalid content-type '${contentType}'. Expected 'application/json'`);
        }
        return response;
      },
      (error) => {
        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            const message = error.response.headers["www-authenticate"].match(/error_description="([^"]+)"/)?.[1];
            throw new RedmineAuthenticationError(message);
          }

          if (error.response?.status === 403) {
            throw new Error("Forbidden");
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Issues
  async getIssues(
    { projectId, issueIds, statusId, assignedTo }: { projectId?: number; issueIds?: number[]; statusId?: number | "open" | "closed" | "*"; assignedTo?: number | "me" },
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      issues: TIssue[];
    }>
  > {
    if (issueIds?.length === 0) {
      return {
        issues: [],
        total_count: 0,
        offset,
        limit,
      };
    }
    return this.instance
      .get(
        `/issues.json?${qs.stringify({
          project_id: projectId,
          issue_id: issueIds?.join(","),
          assigned_to_id: assignedTo,
          status_id: statusId,
          sort: "updated_on:desc",
          offset,
          limit,
        })}`
      )
      .then((res) => res.data);
  }

  async searchIssues(
    {
      query,
      projectId,
      scope,
      titlesOnly,
      openIssuesOnly,
    }: {
      query: string;
      titlesOnly?: boolean;
      openIssuesOnly?: boolean;
    } & (
      | {
          projectId: number;
          scope?: "subprojects";
        }
      | {
          projectId?: never;
          scope?: "all" | "my_projects" | "bookmarks"; // "bookmarks" available since Redmine 5.1.0
        }
    ),
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      results: TSearchResult[];
    }>
  > {
    return this.instance
      .get(
        `${projectId ? `/projects/${projectId}` : ""}/search.json?${qs.stringify({
          issues: 1,
          q: query,
          scope,
          ...(titlesOnly ? { titles_only: 1 } : {}),
          ...(openIssuesOnly ? { open_issues: 1 } : {}),
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
  async getProjects({ offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }): Promise<
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
  async getTimeEntries(
    {
      userId,
      from,
      to,
    }: {
      userId?: "me" | number;
      from?: Date;
      to?: Date;
    },
    { offset, limit }: { offset: number; limit: number } = { offset: 0, limit: 100 }
  ): Promise<
    TPaginatedResponse<{
      time_entries: TTimeEntry[];
    }>
  > {
    return this.instance
      .get(
        `/time_entries.json?${qs.stringify({
          user_id: userId,
          ...(from && { from: formatISO(from, { representation: "date" }) }),
          ...(to && { to: formatISO(to, { representation: "date" }) }),
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
  async getRoles(): Promise<TReference[]> {
    return this.instance.get(`/roles.json`).then((res) => res.data.roles);
  }

  async getRole(id: number): Promise<TRole> {
    return this.instance.get(`/roles/${id}.json`).then((res) => res.data.role);
  }

  async getCurrentUser(): Promise<TUser> {
    return this.instance.get("/users/current.json?include=memberships").then((res) => res.data.user);
  }

  // Auth
  getAuthorizeUrl({ clientId, redirectUri, scope }: { clientId: string; redirectUri: string; scope: string }): string {
    return `${this.instance.defaults.baseURL}/oauth/authorize?${qs.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
    })}`;
  }

  async getAccessToken({ code, redirectUri, clientId, clientSecret }: { code: string; redirectUri: string; clientId: string; clientSecret: string }) {
    return this.instance
      .post<TOAuthTokenResponse>("/oauth/token", {
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      })
      .then((res) => res.data);
  }

  async refreshAccessToken({ refreshToken, clientId, clientSecret }: { refreshToken: string; clientId: string; clientSecret: string }) {
    return this.instance
      .post<TOAuthTokenResponse>("/oauth/token", {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      })
      .then((res) => res.data);
  }

  async startOAuth2Authorization() {
    if (!this.auth?.oauth2?.clientId || !this.auth?.oauth2?.clientSecret) {
      throw new Error("OAuth2 Client ID and Client Secret are required for OAuth2 authentication");
    }

    const redirectUri = browser.identity.getRedirectURL();
    const authorizeUrl = this.getAuthorizeUrl({
      clientId: this.auth.oauth2.clientId,
      redirectUri,
      scope: "view_project search_project view_members view_issues view_time_entries",
    });

    // Authorize and get the code
    const redirectURLString = await browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authorizeUrl,
    });
    if (!redirectURLString) {
      throw new Error("No redirect URL received");
    }
    const redirectURL = new URL(redirectURLString);
    if (redirectURL.searchParams.get("error")) {
      if (redirectURL.searchParams.get("error") === "access_denied") {
        throw new Error("Authorization was denied. Please allow access to connect your Redmine account.");
      }
      const errorDescription = redirectURL.searchParams.get("error_description") || "Unknown error";
      throw new Error(`Authorization error: ${errorDescription}`);
    }
    const code = redirectURL.searchParams.get("code");
    if (!code) {
      throw new Error("Authorization code not found");
    }

    // Exchange the code for tokens
    const tokenResponse = await this.getAccessToken({
      code,
      redirectUri,
      clientId: this.auth.oauth2.clientId,
      clientSecret: this.auth.oauth2.clientSecret,
    });

    return {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: (tokenResponse.created_at + tokenResponse.expires_in) * 1000,
    };
  }
}
