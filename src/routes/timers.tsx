import { ProjectTimersGroup } from "@/components/timer/ProjectTimersGroup";
import TimerSearch, { useTimerSearch } from "@/components/timer/TimerSearch";
import { useSuspenseIssues } from "@/hooks/useIssues";
import PermissionProvider from "@/provider/PermissionProvider";
import { groupTimers } from "@/utils/groupTimers";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import TimersBadge from "../components/timer/TimersBadge";
import useTimers from "../hooks/useTimers";

export const Route = createFileRoute("/timers")({
  component: PageComponent,
  pendingComponent: () => <IssuesListSkeleton />,
});

function PageComponent() {
  return (
    <TimerSearch>
      <TimersPage />
    </TimerSearch>
  );
}

const TimersPage = () => {
  const timers = useTimers();
  const issues = useSuspenseIssues(timers.getIssuesIds());

  const search = useTimerSearch();
  const matchedTimers = timers.searchTimers(search, issues.data);

  const groupedTimers = useMemo(() => groupTimers(matchedTimers, issues.data), [matchedTimers, issues.data]);

  return (
    <PermissionProvider>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="flex flex-col gap-y-4">
        {groupedTimers.map((projectGroup) => (
          <ProjectTimersGroup key={projectGroup.key} projectGroup={projectGroup} />
        ))}

        {matchedTimers.length === 0 && (
          <p className="text-center">
            <FormattedMessage id="timers.list.no-options" />
          </p>
        )}
      </div>
    </PermissionProvider>
  );
};
