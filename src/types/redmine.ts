export type TReference = {
  id: number;
  name: string;
};

// Issues
export type TIssueStatus = {
  id: number;
  name: string;
  is_closed: boolean;
};

export type TIssue = {
  id: number;
  project: TReference;
  tracker: TReference;
  status: TIssueStatus;
  priority: TReference;
  category?: TReference;
  author: TReference;
  assigned_to?: TReference;
  subject: string;
  description: string;
  done_ratio: number;
  fixed_version?: TReference;
  start_date?: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  estimated_hours?: number;
  spent_hours?: number; // available since Redmine 5.0.0
  parent?: {
    id: number;
  };
  total_estimated_hours?: number;
  total_spent_hours?: number;
  is_private?: boolean;
  created_on: string;
  updated_on: string;
  closed_on?: string;
  allowed_statuses?: TIssueStatus[]; // available since Redmine 5.0.0
};

export type TCreateIssue = {
  project_id: number;
  tracker_id: number;
  status_id: number;
  priority_id: number;
  category_id?: number;
  assigned_to_id?: number;
  subject: string;
  description?: string;
  fixed_version_id?: number;
  parent_issue_id?: number;
  is_private?: boolean;
  start_date?: Date;
  due_date?: Date;
  estimated_hours?: number;
  done_ratio?: number;
};

export type TUpdateIssue = Partial<TCreateIssue> & {
  notes?: string;
  private_notes?: boolean;
};

export type TIssuePriority = {
  id: number;
  name: string;
  is_default: boolean;
  active: boolean; // available since Redmine 4.1.0
};

export type TIssueTracker = {
  id: number;
  name: string;
  default_status?: TReference; // available since Redmine 3.0.0
  description?: string;
  enabled_standard_fields?: ("assigned_to_id" | "category_id" | "fixed_version_id" | "parent_issue_id" | "start_date" | "due_date" | "estimated_hours" | "done_ratio" | "description")[]; // available since Redmine 5.0.0
};

export type TSearchResult = {
  id: number;
  title: string;
  type: "issue" | "issue-closed" | "project" | string;
  url: string;
  description: string;
};

// Projects
export type TProject = {
  id: number;
  name: string;
  description: string;
  identifier: string;
  inherit_members: boolean; // available since Redmine 4.1.0
  is_public: boolean;
  status: number;
  parent?: TReference;
  default_version?: TReference; // available since Redmine 4.1.1
  trackers?: TReference[];
  issue_categories?: TReference[];
  time_entry_activities?: TReference[]; // available since Redmine 3.4.0
  created_on: string;
  updated_on: string;
};

export type TMembership = {
  id: number;
  project: TReference;
  user?: TReference;
  group?: TReference;
  roles: {
    id: number;
    name: string;
    inherited?: boolean;
  }[];
};

export type TVersion = {
  id: number;
  project: TReference;
  name: string;
  status: "open" | "closed" | "locked";
  due_date?: string; // YYYY-MM-DD
  description: string;
  sharing: "none" | "descendants" | "hierarchy" | "tree" | "system";
  wiki_page_title: string;
  created_on: string;
  updated_on: string;
};

/* export type TIssueCategory = {
  id: number;
  name: string;
  project: TReference;
  assigned_to?: TReference;
}; */

// Time entries
export type TTimeEntry = {
  id: number;
  project: TReference;
  issue?: {
    id: number;
  };
  user: TReference;
  activity: TReference;
  hours: number;
  comments: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
};

export type TTimeEntryActivity = {
  id: number;
  name: string;
  is_default: boolean;
  active?: boolean; // available since Redmine 4.1.0
};

export type TCreateTimeEntry = {
  issue_id: number;
  user_id: number;
  spent_on: Date;
  activity_id: number;
  hours: number;
  comments?: string;
};

export type TUpdateTimeEntry = Partial<TCreateTimeEntry> & {
  project_id?: number;
};

// Roles and permissions
export type TRole = {
  id: number;
  name: string;
  assignable: boolean;
  issues_visibility?: "all" | "default" | "own"; // available since Redmine 4.0.0
  time_entries_visibility?: "all" | "own"; // available since Redmine 4.0.0
  users_visibility?: "all" | "members_of_visible_projects"; // available since Redmine 4.0.0
  permissions: (
    | "add_project"
    | "edit_project"
    | "close_project"
    | "delete_project"
    | "select_project_modules"
    | "manage_members"
    | "manage_versions"
    | "add_subprojects"
    | "manage_public_queries"
    | "save_queries"
    | "view_issues"
    | "add_issues"
    | "edit_issues"
    | "edit_own_issues"
    | "copy_issues"
    | "manage_issue_relations"
    | "manage_subtasks"
    | "set_issues_private"
    | "set_own_issues_private"
    | "add_issue_notes"
    | "edit_issue_notes"
    | "edit_own_issue_notes"
    | "view_private_notes"
    | "set_notes_private"
    | "delete_issues"
    | "view_issue_watchers"
    | "add_issue_watchers"
    | "delete_issue_watchers"
    | "import_issues"
    | "manage_categories"
    | "view_time_entries"
    | "log_time"
    | "edit_time_entries"
    | "edit_own_time_entries"
    | "manage_project_activities"
    | "log_time_for_other_users"
    | "import_time_entries"
    | "view_news"
    | "manage_news"
    | "comment_news"
    | "view_documents"
    | "add_documents"
    | "edit_documents"
    | "delete_documents"
    | "view_files"
    | "manage_files"
    | "view_wiki_pages"
    | "view_wiki_edits"
    | "export_wiki_pages"
    | "edit_wiki_pages"
    | "rename_wiki_pages"
    | "delete_wiki_pages"
    | "delete_wiki_pages_attachments"
    | "view_wiki_page_watchers"
    | "add_wiki_page_watchers"
    | "delete_wiki_page_watchers"
    | "protect_wiki_pages"
    | "manage_wiki"
    | "view_changesets"
    | "browse_repository"
    | "commit_access"
    | "manage_related_issues"
    | "manage_repository"
    | "view_messages"
    | "add_messages"
    | "edit_messages"
    | "edit_own_messages"
    | "delete_messages"
    | "delete_own_messages"
    | "view_message_watchers"
    | "add_message_watchers"
    | "delete_message_watchers"
    | "manage_boards"
    | "view_calendar"
    | "view_gantt"
  )[];
};

export type TUser = {
  id: number;
  login: string; // username
  admin?: boolean; // available since Redmine 4.0.0
  firstname: string;
  lastname: string;
  created_on: string;
  updated_on: string;
  last_login_on: string;
  passwd_changed_on: string;
  memberships?: TMembership[];
};

// Other
export type TRedmineError = {
  errors: string[];
};

export type TPaginatedResponse<T> = {
  total_count: number;
  offset: number;
  limit: number;
} & T;
