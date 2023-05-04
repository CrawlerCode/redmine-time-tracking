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
  assigned_to: TReference;
  subject: string;
  description: string;
  done_ratio: number;
  estimated_hours?: number;
  spent_hours: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
};
