import { RefObject, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import BrowserNotificationBadge from "../components/general/BrowserNotificationBadge";
import Toast from "../components/general/Toast";
import Filter, { FilterQuery } from "../components/issues/Filter";
import IssuesList, { IssuesData } from "../components/issues/IssuesList";
import IssuesListSkeleton from "../components/issues/IssuesListSkeleton";
import Search, { SearchQuery, SearchRef } from "../components/issues/Search";
import useIssuePriorities from "../hooks/useIssuePriorities";
import useMyAccount from "../hooks/useMyAccount";
import useMyIssues from "../hooks/useMyIssues";
import useProjectVersions from "../hooks/useProjectVersions";
import useSettings from "../hooks/useSettings";
import useStorage from "../hooks/useStorage";

const _defaultIssues = {};

const IssuesPage = ({ search, filter, searchRef, isLoading: isPageLoading }: { search: SearchQuery; filter: FilterQuery; searchRef: RefObject<SearchRef>; isLoading: boolean }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const issuesData = useStorage<IssuesData>("issues", _defaultIssues);

  const myIssuesQuery = useMyIssues(
    Object.keys(issuesData.data)
      .map((id) => Number(id))
      .filter((id) => issuesData.data[id].remembered || issuesData.data[id].active || issuesData.data[id].time > 0),
    search,
    filter
  );
  const issuePriorities = useIssuePriorities({ enabled: settings.style.sortIssuesByPriority || settings.style.showIssuesPriority });
  const projectVersions = useProjectVersions([...new Set(myIssuesQuery.data.filter((i) => i.fixed_version).map((i) => i.project.id))], { enabled: settings.style.groupIssuesByVersion });
  const myAccount = useMyAccount();

  const activeTimerCount = Object.values(issuesData.data).reduce((count, data) => count + (data.active ? 1 : 0), 0);

  const isLoading = issuesData.isLoading || myIssuesQuery.isLoading || issuePriorities.isLoading || projectVersions.isLoading || isPageLoading;

  return (
    <>
      <BrowserNotificationBadge backgroundColor="#1d4ed8" text={activeTimerCount > 0 ? activeTimerCount.toString() : ""} />

      <div className="flex flex-col gap-y-2">
        {isLoading && <IssuesListSkeleton />}

        {!isLoading && (
          <IssuesList
            account={myAccount.data}
            issues={myIssuesQuery.data}
            issuePriorities={issuePriorities}
            projectVersions={projectVersions}
            issuesData={issuesData}
            onSearchInProject={(project) => searchRef.current?.searchInProject(project)}
          />
        )}

        {search.searching && settings.features.extendedSearch && (
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
              account={myAccount.data}
              issues={myIssuesQuery.extendedSearch}
              issuePriorities={issuePriorities}
              projectVersions={projectVersions}
              issuesData={issuesData}
              onSearchInProject={(project) => searchRef.current?.searchInProject(project)}
            />
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
    <>
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
    </>
  );
};

export default SearchFilterWrapper;
