import { useRef } from "react";
import { FormattedMessage } from "react-intl";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import Search, { SearchQuery, SearchRef } from "../components/issue/Search";
import Timer from "../components/timer/Timer";
import TimersBadge from "../components/timer/TimersBadge";
import useIssuePriorities from "../hooks/useIssuePriorities";
import useTimers from "../hooks/useTimers";
import { useSettings } from "../provider/SettingsProvider";

const TimersPage = ({ search }: { search: SearchQuery }) => {
  const { settings } = useSettings();

  const timers = useTimers({
    loadIssues: true,
  });
  const issuePriorities = useIssuePriorities({ enabled: settings.style.showIssuesPriority });

  const matchedTimers = timers.searchTimers(search);

  const isLoading = timers.isLoading || issuePriorities.isLoading;

  return (
    <>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="flex flex-col gap-y-2">
        {isLoading ? (
          <IssuesListSkeleton />
        ) : (
          <>
            {matchedTimers.map((timer) => {
              const issue = timer.getIssue();
              return <Timer key={timer.id} timer={timer} issue={issue} issuePriorityType={issue ? issuePriorities.getPriorityType(issue) : undefined} variant="full" />;
            })}

            {matchedTimers.length === 0 && (
              <p className="text-center">
                <FormattedMessage id="timers.list.no-options" />
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

const SearchWrapper = () => {
  const searchRef = useRef<SearchRef>(null);

  return <Search ref={searchRef}>{({ search }) => <TimersPage search={search} />}</Search>;
};

export default SearchWrapper;
