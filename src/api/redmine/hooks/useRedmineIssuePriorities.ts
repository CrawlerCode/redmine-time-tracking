import { redmineIssuePrioritiesQuery } from "@/api/redmine/queries/issuePriorities";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { combineFlatSuspenseQueries } from "@/utils/query";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { TIssue, TIssuePriority } from "../types";

type Options = {
  enabled?: boolean;
};

/**
 * Hook to get redmine issue priorities
 */
export const useRedmineIssuePriorities = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issuePrioritiesQuery = useQuery({
    ...redmineIssuePrioritiesQuery(redmineApi),
    enabled,
  });

  const priorities = issuePrioritiesQuery.data ?? [];
  const priorityTypeMap = buildPriorityTypeMap(priorities);

  return {
    priorities,
    defaultPriority: getDefaultPriority(priorities),
    getPriorityType: (issue: TIssue) => getPriorityType(issue, priorityTypeMap),
    isPending: issuePrioritiesQuery.isPending,
  };
};

/**
 * Hook to get redmine issue priorities with suspense
 */
export const useSuspenseIssuePriorities = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issuePrioritiesQuery = useSuspenseQueries({
    queries: enabled ? [redmineIssuePrioritiesQuery(redmineApi)] : ([] as ReturnType<typeof redmineIssuePrioritiesQuery>[]),
    combine: combineFlatSuspenseQueries,
  });

  return {
    priorities: issuePrioritiesQuery.data,
  };
};

export type PriorityType = "highest" | "high" | "medium-high" | "medium" | "default" | "low" | "lowest" | "unknown";

/**
 * Build priority type map
 *
 * Depending on the default priority position, assign priority types
 *
 * Examples:
 * ["lowest", "low", "low", "low", "default", "medium", "medium", "medium", "medium-high", "high", "highest"]
 * ["lowest", "default", "medium-high", "high", "highest"]
 * ["lowest", "default", "high", "highest"]
 * ["lowest", "default", "highest"]
 * ["default", "high", "highest"]
 * ["lowest", "low", "default"]
 * ["default", "highest"]
 */
const buildPriorityTypeMap = (priorities: TIssuePriority[]): Map<number, PriorityType> => {
  const priorityTypeMap = new Map<number, PriorityType>();

  let defaultIdx = priorities.findIndex((p) => p.is_default);
  if (defaultIdx === -1) {
    // If no default priority is set, use the lower middle as default
    defaultIdx = Math.floor((priorities.length - 1) / 2);
  }

  priorities.forEach((priority, idx) => {
    if (idx === defaultIdx) {
      priorityTypeMap.set(priority.id, "default");
    } else if (idx < defaultIdx) {
      if (idx === 0) {
        priorityTypeMap.set(priority.id, "lowest");
      } else {
        priorityTypeMap.set(priority.id, "low");
      }
    } else if (idx > defaultIdx) {
      if (idx === priorities.length - 1) {
        priorityTypeMap.set(priority.id, "highest");
      } else if (idx === priorities.length - 2) {
        priorityTypeMap.set(priority.id, "high");
      } else if (idx === priorities.length - 3) {
        priorityTypeMap.set(priority.id, "medium-high");
      } else {
        priorityTypeMap.set(priority.id, "medium");
      }
    }
  });

  return priorityTypeMap;
};

/**
 * Get priority type for issue
 */
const getPriorityType = (issue: TIssue, priorityTypeMap: ReturnType<typeof buildPriorityTypeMap>) => {
  return priorityTypeMap.get(issue.priority.id) ?? "unknown";
};

/**
 * Get default priority
 */
const getDefaultPriority = (priorities: TIssuePriority[]) => {
  return priorities.find((p) => p.is_default);
};
