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
  estimated_hours?: number;
  spent_hours: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
};

export type TTimeEntryActivity = {
  id: number;
  name: string;
  is_default: boolean;
  active: boolean;
};

export type TCreateTimeEntry = {
  issue_id: number;
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
  fistname: string;
  lastname: string;
  login: string;
  mail: string;
};
