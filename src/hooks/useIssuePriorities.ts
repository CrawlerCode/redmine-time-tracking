import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { TIssue, TIssuePriority } from "../types/redmine";

export type PriorityType = "highest" | "high" | "medium-high" | "medium" | "default" | "low" | "lowest" | "unknown";

type Options = {
  enabled?: boolean;
};

const useIssuePriorities = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issuePrioritiesQuery = useQuery({
    queryKey: ["issuePriorities"],
    queryFn: () => redmineApi.getIssuePriorities(),
    enabled: enabled,
    select: (data) => data?.filter((priority) => priority.active !== false),
  });

  const priorities = issuePrioritiesQuery.data ?? [];

  const priorityTypeMap = buildPriorityTypeMap(priorities);

  const getPriorityType = (issue: TIssue): PriorityType => {
    return priorityTypeMap.get(issue.priority.id) ?? "unknown";
  };

  return {
    data: priorities,
    isLoading: issuePrioritiesQuery.isLoading,
    isError: issuePrioritiesQuery.isError,
    defaultPriority: priorities.find((p) => p.is_default),
    priorityTypeMap,
    getPriorityType,
  };
};

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

export default useIssuePriorities;
