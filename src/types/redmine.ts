export type TReference = {
  id: number;
  name: string;
};

export type TStatus = {
  id: number;
  name: string;
  is_closed: boolean;
};

export type TIssue = {
  id: number;
  project: TReference;
  tracker: TReference;
  status: TStatus;
  priority: TReference;
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
  created_on: string;
  updated_on: string;
  closed_on?: string;
};

export type TUpdateIssue = Partial<Omit<TIssue, "id">> & {
  notes?: string;
  private_notes?: boolean;
};

export type TIssuesPriority = {
  id: number;
  name: string;
  is_default: boolean;
  active: boolean;
};

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
  user_id?: number;
  spent_on?: Date;
  activity_id?: number;
  hours: number;
  comments?: string;
};

export type TRedmineError = {
  errors: string[];
};

export type TSearchResult = {
  id: number;
  title: string;
  type: "issue" | "issue-closed" | "project" | string;
  url: string;
  description: string;
};

export type TAccount = {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
  last_login_on: string;
};

export type TProject = {
  id: number;
  name: string;
  description: string;
  identifier: string;
  inherit_members: boolean;
  is_public: boolean;
  status: number;
  parent?: TReference;
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
  sharing: string;
  wiki_page_title: string;
  created_on: string;
  updated_on: string;
};
