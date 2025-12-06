import { Button } from "@/components/ui/button";
import { useIntl } from "react-intl";
import Filter, { filterIssues, useFilter } from "../components/issue/Filter";
import IssueSearch, { filterIssuesByLocalSearch, useIssueSearch } from "../components/issue/IssueSearch";
import IssuesList from "../components/issue/IssuesList";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import TimersBadge from "../components/timer/TimersBadge";
import useIssuePriorities from "../hooks/useIssuePriorities";
import useLocalIssues from "../hooks/useLocalIssues";
import useMyIssues from "../hooks/useMyIssues";
import useProjectVersions from "../hooks/useProjectVersions";
import useRedmineSearch from "../hooks/useRedmineSearch";
import useTimers from "../hooks/useTimers";
import { useSettings } from "../provider/SettingsProvider";

const IssuesPage = () => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const localIssues = useLocalIssues();
  const timers = useTimers();

  const search = useIssueSearch();
  const filter = useFilter();
  const myIssuesQuery = useMyIssues(Array.from(new Set([...timers.getIssuesIds(), ...localIssues.getIssuesIds()])));
  const searchIssues = useRedmineSearch(search);
  const issues = filterIssues(search.isSearching && search.settings.mode === "remote" ? searchIssues.data : filterIssuesByLocalSearch(myIssuesQuery.data, search), filter.settings);

  const issuePriorities = useIssuePriorities({ enabled: settings.style.sortIssuesByPriority || settings.style.showIssuesPriority });
  const projectVersions = useProjectVersions([...new Set(issues.filter((i) => i.fixed_version).map((i) => i.project.id))], { enabled: settings.style.groupIssuesByVersion });

  const isLoading = timers.isLoading || localIssues.isLoading || myIssuesQuery.isLoading || issuePriorities.isLoading || projectVersions.isLoading || searchIssues.isLoading || filter.isLoading;

  return (
    <>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="mb-1 flex justify-end">
        <Filter.Button />
      </div>

      {isLoading ? (
        <IssuesListSkeleton />
      ) : (
        <>
          <IssuesList issues={issues} localIssues={localIssues} issuePriorities={issuePriorities} projectVersions={projectVersions} timers={timers} />

          {search.isSearching && search.settings.mode === "remote" && searchIssues.hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => searchIssues.fetchNextPage()}>
                {formatMessage({ id: "issues.list.load-more" })}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

const IssuesPageWrapper = () => {
  return (
    <IssueSearch>
      <Filter.Provider>
        <IssuesPage />
      </Filter.Provider>
    </IssueSearch>
  );
};

export default IssuesPageWrapper;
