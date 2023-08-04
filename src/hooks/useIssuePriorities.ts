import { useQuery } from "@tanstack/react-query";
import { getIssuePriorities } from "../api/redmine";
import { TIssue } from "../types/redmine";

export type PriorityType = "highest" | "higher" | "high" | "normal" | "lowest";

const useIssuePriorities = () => {
  const issuePrioritiesQuery = useQuery({
    queryKey: ["issuePriorities"],
    queryFn: getIssuePriorities,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const priorities = issuePrioritiesQuery.data?.filter((priority) => priority.active) ?? [];

  /**
   * Find priority types
   *
   * Examples:
   * ["lowest", "normal", "normal", "normal/default", "high", "higher", "higher", "higher", "highest"]
   * ["low", "normal/default", "high", "higher", "highest"]
   * ["normal/default", "high", "highest"]
   * ["low", "normal/default", "highest"]
   */
  const normal = priorities.find((p) => p.is_default);
  const normalIdx = priorities.findIndex((p) => p.is_default);
  const lowest = normalIdx > 0 ? priorities[0] : undefined;
  const high = normalIdx >= 0 && normalIdx < priorities.length - 2 ? priorities[normalIdx + 1] : undefined;
  const higher = normalIdx >= 0 ? priorities.slice(normalIdx + 2, priorities.length - 1) : [];
  const highest = normalIdx < priorities.length - 1 ? priorities[priorities.length - 1] : undefined;

  const getPriorityType = (issue: TIssue): PriorityType => {
    switch (issue.priority.id) {
      case normal?.id:
        return "normal";
      case lowest?.id:
        return "lowest";
      case high?.id:
        return "high";
      case highest?.id:
        return "highest";
      default:
        if (higher.find((p) => p.id === issue.priority.id)) return "higher";
    }
    return "normal";
  };

  return {
    data: priorities,
    getPriorityType,
  };
};
export default useIssuePriorities;
