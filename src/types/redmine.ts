export type TAccount = {
  id: number;
  login: string; // username
  admin: boolean; // is admin
  firstname: string;
  lastname: string;
  mail: string;
  last_login_on: string;
};

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
  spent_hours: number;
  parent?: {
    id: number;
  };
  total_estimated_hours?: number;
  total_spent_hours?: number;
  is_private?: boolean;
  created_on: string;
  updated_on: string;
  closed_on?: string;
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
  start_date?: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  estimated_hours?: number;
};

export type TUpdateIssue = Partial<Omit<TIssue, "id">> & {
  notes?: string;
  private_notes?: boolean;
};

export type TIssuePriority = {
  id: number;
  name: string;
  is_default: boolean;
  active: boolean;
};

export type TIssueTracker = {
  id: number;
  name: string;
  default_status: TReference;
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
  inherit_members: boolean;
  is_public: boolean;
  status: number;
  parent?: TReference;
  default_version?: TReference;
  trackers?: TReference[];
  issue_categories?: TReference[];
  time_entry_activities?: TReference[];
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
  active: boolean;
};

export type TCreateTimeEntry = {
  issue_id: number;
  user_id: number;
  spent_on: Date;
  activity_id: number;
  hours: number;
  comments?: string;
};

// Other
export type TRedmineError = {
  errors: string[];
};
