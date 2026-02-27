import { TIssue, TReference } from "@/api/redmine/types";
import { TimerController } from "@/hooks/useTimers";

type TimerItem = {
  timer: TimerController;
  issue: TIssue | undefined;
};

export type ProjectTimersGroup = {
  /**
   * A unique key for the group
   */
  key: string;
  /**
   * The type of the group
   */
  type: "project" | "unknown-project";
  /**
   * The project associated with the group of timers
   */
  project?: TReference;
  /**
   * The list of timers and issues
   */
  items: TimerItem[];
};

/**
 * Group timers by their associated issue's project
 *
 * @param timers - The list of timers to be grouped
 * @param issues - The list of issues associated with the timers
 * @returns An array of grouped timers by project
 */
export const groupTimers = (timers: TimerController[], issues: TIssue[]): ProjectTimersGroup[] => {
  const reversedTimers = timers.toReversed(); // Show the most recent timers first

  // Combine timers with their associated issues
  const items = reversedTimers.map<TimerItem>((timer) => ({
    timer,
    issue: issues.find((issue) => issue.id === timer.issueId),
  }));

  // Group timers by project
  const groups = Object.values(
    items.reduce<
      Record<
        string,
        ProjectTimersGroup & {
          sortIdx: number;
        }
      >
    >((groups, item) => {
      const key = item.issue?.project.id ? `project-${item.issue.project.id}` : "unknown-project";

      if (!groups[key]) {
        groups[key] = {
          key,
          type: item.issue?.project.id ? "project" : "unknown-project",
          project: item.issue?.project,
          items: [],
          sortIdx: Object.keys(groups).length,
        };
      }
      groups[key].items.push(item);

      return groups;
    }, {})
  ).sort((a, b) => a.sortIdx - b.sortIdx);

  return groups;
};
