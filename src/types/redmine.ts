export type Reference = {
  id: number;
  name: string;
};

export type Status = {
  id: number;
  name: string;
  is_closed: boolean;
};

export type Issue = {
  id: number;
  project: Reference;
  tracker: Reference;
  status: Status;
  priority: Reference;
  author: Reference;
  assigned_to: Reference;
  subject: string;
  description: string;
  done_ratio: number;
  estimated_hours?: number;
  spent_hours: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
};
