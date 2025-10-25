import { LocalIssueData } from "@/hooks/useLocalIssues";
import { TimerController } from "@/hooks/useTimers";
import { Settings } from "@/provider/SettingsProvider";
import { TIssue, TIssuePriority, TReference, TVersion } from "@/types/redmine";

export type ProjectGroup = {
  /**
   * A unique key for the group
   */
  key: string;
  /**
   * The type of the group
   */
  type: "active-tab" | "tracked-issues" | "pinned-issues" | "project";
  /**
   * The project associated with the group
   */
  project: TReference;
  /**
   * Issue groups within the project group
   */
  groups: IssueGroup[];
};

type IssueGroup = {
  /**
   * A unique key for the group
   */
  key: string;
  /**
   * The type of the group
   */
  type: "version" | "no-version" | "other";
  /**
   * The version associated with the group
   */
  version?: TVersion;
  /**
   * The issues in this group
   */
  issues: TIssue[];
};

/**
 * Groups issues based on the active tab, pinned status, and project association
 *
 * @param issues - The list of issues to be grouped
 * @param data.localIssues - Local issue data including pinned status
 * @param data.timers - Timer information
 * @param data.issuePriorities - Issue priorities for sorting
 * @param data.projectVersions - Project versions data for grouping by version
 * @param data.activeTabIssueId - The ID of the issue in the active tab
 * @param data.settings - User settings for grouping behavior
 * @returns An array of grouped issues by project
 */
export const groupIssues = (
  unsortedIssues: TIssue[],
  {
    localIssues,
    timers,
    issuePriorities,
    projectVersions,
    activeTabIssueId,
    settings,
  }: {
    localIssues: LocalIssueData[];
    timers: TimerController[];
    issuePriorities: TIssuePriority[];
    projectVersions: Record<number, TVersion[]>;
    activeTabIssueId?: number;
    settings: Settings;
  }
): ProjectGroup[] => {
  // Pre-compute lookup maps
  const pinnedIssuesSet = buildPinnedIssuesSet(localIssues);
  const timersByIssueId = settings.style.pinTrackedIssues ? buildTimerLookupMap(timers) : new Map();
  const versionSortMap = settings.style.groupIssuesByVersion ? buildVersionSortMap(projectVersions) : new Map();
  const issuePrioritySortMap = settings.style.sortIssuesByPriority ? buildIssuePrioritySortMap(issuePriorities) : undefined;

  // Categorize issues per project
  let activeTabIssue: TIssue | null = null;
  const categorizedProjectMap = new Map<number, CategorizedProject>();

  const sortedIssues = sortIssues(unsortedIssues, issuePrioritySortMap);
  for (const issue of sortedIssues) {
    // Active tab issue
    if (settings.style.pinActiveTabIssue && activeTabIssueId === issue.id) {
      activeTabIssue = issue;
      continue;
    }

    const categorizedProject = getCategorizedProject(categorizedProjectMap, issue);

    // Tracked issues (active and paused timers)
    if (settings.style.pinTrackedIssues) {
      const isTimerActive = timersByIssueId.get(issue.id);

      if (isTimerActive === true) {
        categorizedProject.trackedActiveTimerIssues.push(issue);
        continue;
      }

      if (isTimerActive === false) {
        categorizedProject.trackedPausedTimerIssues.push(issue);
        continue;
      }
    }

    // Check if issue is pinned
    if (pinnedIssuesSet.has(issue.id)) {
      categorizedProject.pinnedIssues.push(issue);
      continue;
    }

    // Group by version if enabled and project versions available
    if (settings.style.groupIssuesByVersion && projectVersions[issue.project.id]) {
      addIssueToProjectVersionGroup(issue, categorizedProject, projectVersions[issue.project.id], versionSortMap);
      continue;
    }

    // Otherwise, add to other issues
    categorizedProject.otherIssues.push(issue);
  }

  // Build final project groups
  const result: ProjectGroup[] = [];

  // Sort categorized project issues by their original order
  const sortedCategorizedProjects = Array.from(categorizedProjectMap.values()).sort((a, b) => a.sortIdx - b.sortIdx);

  // Add active tab issue group
  if (activeTabIssue) {
    result.push({
      key: "active-tab",
      type: "active-tab",
      project: activeTabIssue.project,
      groups: [
        {
          key: "active-tab-issues",
          type: "other",
          issues: [activeTabIssue],
        },
      ],
    });
  }

  // Add tracked issues project groups
  if (settings.style.pinTrackedIssues) {
    sortedCategorizedProjects.forEach(({ project, trackedActiveTimerIssues, trackedPausedTimerIssues }) => {
      const issueGroups: IssueGroup[] = [];

      if (trackedActiveTimerIssues.length > 0) {
        issueGroups.push({
          key: `active-timers-${project.id}`,
          type: "other",
          issues: trackedActiveTimerIssues,
        });
      }

      if (trackedPausedTimerIssues.length > 0) {
        issueGroups.push({
          key: `paused-timers-${project.id}`,
          type: "other",
          issues: trackedPausedTimerIssues,
        });
      }

      if (issueGroups.length > 0) {
        result.push({
          key: `tracked-issues-${project.id}`,
          type: "tracked-issues",
          project,
          groups: issueGroups,
        });
      }
    });
  }

  // Add pinned project groups
  sortedCategorizedProjects.forEach(({ project, pinnedIssues }) => {
    if (pinnedIssues.length > 0) {
      result.push({
        key: `pinned-issues-${project.id}`,
        type: "pinned-issues",
        project,
        groups: [
          {
            key: `pinned-issues-${project.id}`,
            type: "other",
            issues: pinnedIssues,
          },
        ],
      });
    }
  });

  // Add other project groups
  sortedCategorizedProjects.forEach(({ project, versionsGroups: versionMap, noVersionIssues, otherIssues }) => {
    const issueGroups: IssueGroup[] = [];

    // Add version groups
    Array.from(versionMap.values())
      .sort((a, b) => a.sortIdx - b.sortIdx)
      .forEach(({ version, issues }) => {
        issueGroups.push({
          key: `version-${version.id}`,
          type: "version",
          version,
          issues,
        });
      });

    // Add no-version group
    if (noVersionIssues.length > 0) {
      issueGroups.push({
        key: `no-version-${project.id}`,
        type: "no-version",
        issues: noVersionIssues,
      });
    }

    // Add other issues group
    if (otherIssues.length > 0) {
      issueGroups.push({
        key: `issues-${project.id}`,
        type: "other",
        issues: otherIssues,
      });
    }

    // Add project group if it has any issue groups
    if (issueGroups.length > 0) {
      result.push({
        key: `project-${project.id}`,
        type: "project",
        project,
        groups: issueGroups,
      });
    }
  });

  return result;
};

type CategorizedProject = {
  project: TReference;
  trackedActiveTimerIssues: TIssue[];
  trackedPausedTimerIssues: TIssue[];
  pinnedIssues: TIssue[];
  versionsGroups: Map<number, { version: TVersion; issues: TIssue[]; sortIdx: number }>;
  noVersionIssues: TIssue[];
  otherIssues: TIssue[];
  sortIdx: number;
};

/**
 * Get or create a categorized project map for the given issue
 */
const getCategorizedProject = (categorizedProjectMap: Map<number, CategorizedProject>, issue: TIssue) => {
  if (!categorizedProjectMap.has(issue.project.id)) {
    categorizedProjectMap.set(issue.project.id, {
      project: issue.project,
      trackedActiveTimerIssues: [],
      trackedPausedTimerIssues: [],
      pinnedIssues: [],
      versionsGroups: new Map(),
      noVersionIssues: [],
      otherIssues: [],
      sortIdx: categorizedProjectMap.size, // Use insertion order for sorting
    });
  }
  return categorizedProjectMap.get(issue.project.id)!;
};

/**
 * Build a lookup map for issue ids to their timer status
 */
const buildTimerLookupMap = (timers: TimerController[]) => {
  const timersByIssueId = new Map<number, boolean>();
  timers.forEach((timer) => {
    const existing = timersByIssueId.get(timer.issueId);
    if (timer.isActive || (timer.elapsedTime > 0 && existing !== true)) {
      timersByIssueId.set(timer.issueId, timer.isActive);
    }
  });
  return timersByIssueId;
};

/**
 * Build a set of pinned issue IDs
 */
const buildPinnedIssuesSet = (localIssues: LocalIssueData[]) => {
  return new Set(localIssues.filter((l) => l.pinned).map((l) => l.id));
};

/**
 * Build version sorting lookup map for maintaining version order
 */
const buildVersionSortMap = (projectVersions: Record<number, TVersion[]>) => {
  const versionSortMap = new Map<number, Map<number, number>>();
  Object.entries(projectVersions).forEach(([projectIdStr, versions]) => {
    const projectId = parseInt(projectIdStr, 10);
    const sortMap = new Map<number, number>();
    versions.forEach((version, index) => {
      sortMap.set(version.id, index);
    });
    versionSortMap.set(projectId, sortMap);
  });
  return versionSortMap;
};

/**
 * Build issue priority sorting lookup map
 */
const buildIssuePrioritySortMap = (issuePriorities: TIssuePriority[]) => {
  const issuePrioritySortMap = new Map<number, number>();
  issuePriorities.forEach((priority, index) => {
    issuePrioritySortMap.set(priority.id, index);
  });
  return issuePrioritySortMap;
};

/**
 * Add issue to version group or no-version group
 */
const addIssueToProjectVersionGroup = (issue: TIssue, categorizedProject: CategorizedProject, versions: TVersion[], versionSortMap: Map<number, Map<number, number>>) => {
  if (!issue.fixed_version) {
    categorizedProject.noVersionIssues.push(issue);
    return;
  }

  if (!categorizedProject.versionsGroups.has(issue.fixed_version.id)) {
    const version = versions.find((v) => v.id === issue.fixed_version?.id);

    if (!version) {
      categorizedProject.noVersionIssues.push(issue);
      return;
    }

    const sortIdx = versionSortMap.get(issue.project.id)?.get(issue.fixed_version.id) ?? 0;
    categorizedProject.versionsGroups.set(issue.fixed_version.id, {
      version,
      issues: [],
      sortIdx,
    });
  }

  categorizedProject.versionsGroups.get(issue.fixed_version.id)?.issues.push(issue);
};

/**
 * Sort issues based on priority, due date, and last updated time
 */
const sortIssues = (issues: TIssue[], issuePrioritySortMap?: Map<number, number>) => {
  return issues.sort(
    (a, b) =>
      (issuePrioritySortMap?.get(b.priority.id) ?? 0) - (issuePrioritySortMap?.get(a.priority.id) ?? 0) ||
      (b.due_date ? 1 : 0) - (a.due_date ? 1 : 0) ||
      new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime() ||
      new Date(b.updated_on).getTime() - new Date(a.updated_on).getTime()
  );
};
