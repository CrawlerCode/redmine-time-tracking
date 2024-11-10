import { RefObject, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import BrowserNotificationBadge from "../components/general/BrowserNotificationBadge";
import Button from "../components/general/Button";
import Toast from "../components/general/Toast";
import Filter, { FilterQuery } from "../components/issues/Filter";
import IssuesList from "../components/issues/IssuesList";
import IssuesListSkeleton from "../components/issues/IssuesListSkeleton";
import Search, { SearchQuery, SearchRef } from "../components/issues/Search";
import useIssuePriorities from "../hooks/useIssuePriorities";
import useMyIssues from "../hooks/useMyIssues";
import useProjectVersions from "../hooks/useProjectVersions";
import useSearch from "../hooks/useSearch";
import useSettings from "../hooks/useSettings";
import useTimers from "../hooks/useTimers";

const IssuesPage = ({ search, filter, searchRef, isLoading: isPageLoading }: { search: SearchQuery; filter: FilterQuery; searchRef: RefObject<SearchRef>; isLoading: boolean }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const timers = useTimers();

  const myIssuesQuery = useMyIssues(
    Object.keys(timers.timers)
      .map((id) => Number(id))
      .filter((id) => timers.timers[id].remembered || timers.timers[id].active || timers.timers[id].time > 0),
    search,
    filter
  );
  const searchIssues = useSearch(search, filter, myIssuesQuery.data);
  const issuePriorities = useIssuePriorities({ enabled: settings.style.sortIssuesByPriority || settings.style.showIssuesPriority });
  const projectVersions = useProjectVersions([...new Set(myIssuesQuery.data.filter((i) => i.fixed_version).map((i) => i.project.id))], { enabled: settings.style.groupIssuesByVersion });

  const activeTimerCount = timers.getActiveTimerCount();

  const isLoading = timers.isLoading || myIssuesQuery.isLoading || issuePriorities.isLoading || projectVersions.isLoading || isPageLoading;

  return (
    <>
      <BrowserNotificationBadge backgroundColor="#1d4ed8" text={activeTimerCount > 0 ? activeTimerCount.toString() : ""} />

      <div className="flex flex-col gap-y-2">
        {isLoading ? (
          <IssuesListSkeleton />
        ) : (
          <IssuesList
            issues={myIssuesQuery.data}
            issuePriorities={issuePriorities}
            projectVersions={projectVersions}
            timers={timers}
            onSearchInProject={(project) => searchRef.current?.searchInProject(project)}
          />
        )}

        {searchIssues.isSearching && (
          <>
            <div className="relative">
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
              issuePriorities={issuePriorities}
              projectVersions={projectVersions}
              timers={timers}
              onSearchInProject={(project) => searchRef.current?.searchInProject(project)}
            />

            {searchIssues.hasNextPage && (
              <div className="flex justify-center">
                <Button size="xs" variant="outline" onClick={() => searchIssues.fetchNextPage()}>
                  {formatMessage({ id: "issues.list.load-more" })}
                </Button>
              </div>
            )}
          </>
        )}

        {myIssuesQuery.isError && <Toast type="error" message={formatMessage({ id: "issues.error.fail-to-load-issues" })} allowClose={false} />}
      </div>
    </>
  );
};

const SearchFilterWrapper = () => {
  const searchRef = useRef<SearchRef>(null);

  return (
    <Search ref={searchRef}>
      {({ search }) => (
        <>
          <Filter>
            {({ filter, isLoading: isLoadingFilter }) => (
              <>
                <IssuesPage search={search} filter={filter} searchRef={searchRef} isLoading={isLoadingFilter} />
              </>
            )}
          </Filter>
        </>
      )}
    </Search>
  );
};

export default SearchFilterWrapper;
