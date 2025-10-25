import { Button } from "@/components/ui/button";
import { RefObject, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Filter, { FilterQuery } from "../components/issue/Filter";
import IssuesList from "../components/issue/IssuesList";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import Search, { SearchQuery, SearchRef } from "../components/issue/Search";
import TimersBadge from "../components/timer/TimersBadge";
import useIssuePriorities from "../hooks/useIssuePriorities";
import useLocalIssues from "../hooks/useLocalIssues";
import useMyIssues from "../hooks/useMyIssues";
import useProjectVersions from "../hooks/useProjectVersions";
import useSearch from "../hooks/useSearch";
import useTimers from "../hooks/useTimers";
import { useSettings } from "../provider/SettingsProvider";

const IssuesPage = ({ search, filter, searchRef, isLoading: isPageLoading }: { search: SearchQuery; filter: FilterQuery; searchRef: RefObject<SearchRef | null>; isLoading: boolean }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const localIssues = useLocalIssues();
  const timers = useTimers();

  const myIssuesQuery = useMyIssues(Array.from(new Set([...timers.getIssuesIds(), ...localIssues.getIssuesIds()])), search, filter);
  const searchIssues = useSearch(search, filter, myIssuesQuery.data);
  const issuePriorities = useIssuePriorities({ enabled: settings.style.sortIssuesByPriority || settings.style.showIssuesPriority });
  const projectVersions = useProjectVersions([...new Set(myIssuesQuery.data.filter((i) => i.fixed_version).map((i) => i.project.id))], { enabled: settings.style.groupIssuesByVersion });

  const isLoading = timers.isLoading || localIssues.isLoading || myIssuesQuery.isLoading || issuePriorities.isLoading || projectVersions.isLoading || isPageLoading;

  return (
    <>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      {isLoading ? (
        <IssuesListSkeleton />
      ) : (
        <IssuesList
          issues={myIssuesQuery.data}
          localIssues={localIssues}
          issuePriorities={issuePriorities}
          projectVersions={projectVersions}
          timers={timers}
          onSearchInProject={(project) => searchRef.current?.searchInProject(project)}
        />
      )}

      {searchIssues.isSearching && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t text-slate-500 dark:text-slate-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-slate-500 dark:text-slate-300">
                <FormattedMessage id="issues.extended-search" />
              </span>
            </div>
          </div>

          <IssuesList
            issues={searchIssues.data}
            localIssues={localIssues}
            issuePriorities={issuePriorities}
            projectVersions={projectVersions}
            timers={timers}
            onSearchInProject={(project) => searchRef.current?.searchInProject(project)}
          />

          {searchIssues.hasNextPage && (
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

const SearchFilterWrapper = () => {
  const searchRef = useRef<SearchRef>(null);

  return (
    <Search ref={searchRef}>
      {({ search }) => (
        <Filter>
          {({ filter, isLoading: isLoadingFilter }) => (
            <>
              <IssuesPage search={search} filter={filter} searchRef={searchRef} isLoading={isLoadingFilter} />
            </>
          )}
        </Filter>
      )}
    </Search>
  );
};

export default SearchFilterWrapper;
