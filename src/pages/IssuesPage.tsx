import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Toast from "../components/general/Toast";
import IssuesList, { IssuesData } from "../components/issues/IssuesList";
import IssuesListSkeleton from "../components/issues/IssuesListSkeleton";
import Search, { SearchQuery, SearchRef, defaultSearchQuery } from "../components/issues/Search";
import useMyAccount from "../hooks/useMyAccount";
import useMyIssues from "../hooks/useMyIssues";
import useSettings from "../hooks/useSettings";
import useStorage from "../hooks/useStorage";

const IssuesPage = () => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const issuesData = useStorage<IssuesData>("issues", {});

  const searchRef = useRef<SearchRef>(null);
  const [search, setSearch] = useState<SearchQuery>(defaultSearchQuery);

  const myIssuesQuery = useMyIssues(
    Object.keys(issuesData.data)
      .map((id) => Number(id))
      .filter((id) => issuesData.data[id].remembered || issuesData.data[id].active || issuesData.data[id].time > 0),
    search
  );
  const myAccount = useMyAccount();

  useEffect(() => {
    const count = Object.values(issuesData.data).reduce((count, data) => count + (data.active ? 1 : 0), 0);

    chrome.action.setBadgeBackgroundColor({ color: "#1d4ed8" });
    chrome.action.setBadgeText({
      text: count > 0 ? count.toString() : "",
    });
  }, [issuesData.data]);

  return (
    <>
      <Search ref={searchRef} onSearch={setSearch} />
      <div className="flex flex-col gap-y-2">
        {myIssuesQuery.isLoading && <IssuesListSkeleton />}

        <IssuesList account={myAccount.data} issues={myIssuesQuery.data} issuesData={issuesData} onSearchInProject={(project) => searchRef.current?.searchInProject(project)} />

        {search.searching && settings.options.extendedSearch && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t text-slate-500 dark:text-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-sm text-slate-500 dark:text-slate-300">
                  <FormattedMessage id="issues.extended-search" />
                </span>
              </div>
            </div>

            <IssuesList account={myAccount.data} issues={myIssuesQuery.extendedSearch} issuesData={issuesData} onSearchInProject={(project) => searchRef.current?.searchInProject(project)} />
          </>
        )}

        {myIssuesQuery.isError && <Toast type="error" message={formatMessage({ id: "issues.error.fail-to-load-issues" })} allowClose={false} />}
      </div>
    </>
  );
};

export default IssuesPage;
