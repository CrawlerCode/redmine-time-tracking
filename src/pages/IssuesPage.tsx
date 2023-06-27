import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import InputField from "../components/general/InputField";
import Toast from "../components/general/Toast";
import IssuesList, { IssuesData } from "../components/issues/IssuesList";
import IssuesListSkeleton from "../components/issues/IssuesListSkeleton";
import useHotKey from "../hooks/useHotkey";
import useMyIssues from "../hooks/useMyIssues";
import useSettings from "../hooks/useSettings";
import useStorage from "../hooks/useStorage";

const IssuesPage = () => {
  const { settings } = useSettings();

  const issuesData = useStorage<IssuesData>("issues", {});

  const searchRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const myIssuesQuery = useMyIssues(
    Object.keys(issuesData.data)
      .map((id) => Number(id))
      .filter((id) => issuesData.data[id].remembered || issuesData.data[id].remember || issuesData.data[id].active || issuesData.data[id].time > 0),
    searching ? search : ""
  );

  // hotkeys
  useHotKey(
    () => {
      setSearching(true);
      searchRef.current?.focus();
    },
    { ctrl: true, key: "k" }
  );
  useHotKey(
    () => {
      setSearching(true);
      searchRef.current?.focus();
    },
    { ctrl: true, key: "f" }
  );
  useHotKey(() => setSearching(false), { key: "Escape" }, searching);

  useEffect(() => {
    const count = Object.values(issuesData.data).reduce((count, data) => count + (data.active ? 1 : 0), 0);

    chrome.action.setBadgeBackgroundColor({ color: "#1d4ed8" });
    chrome.action.setBadgeText({
      text: count > 0 ? count.toString() : "",
    });
  }, [issuesData.data]);

  return (
    <>
      {searching && <InputField ref={searchRef} icon={<FontAwesomeIcon icon={faSearch} />} placeholder="Search..." className="select-none mb-3" onChange={(e) => setSearch(e.target.value)} autoFocus autoComplete="off" />}
      <div className="flex flex-col gap-y-2">
        {myIssuesQuery.isLoading && <IssuesListSkeleton />}

        <IssuesList
          account={myIssuesQuery.account}
          issues={myIssuesQuery.data.sort((a, b) => {
            const favA = issuesData.data[a.id]?.pinned || issuesData.data[a.id]?.favorite;
            const favB = issuesData.data[b.id]?.pinned || issuesData.data[b.id]?.favorite;
            if (favA && favB) return new Date(a.updated_on).getTime() - new Date(a.updated_on).getTime();
            return favA ? -1 : 1;
          })}
          issuesData={issuesData}
        />

        {searching && settings.options.extendedSearch && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t text-slate-500 dark:text-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-sm text-slate-500 dark:text-slate-300">Extended search</span>
              </div>
            </div>

            <IssuesList account={myIssuesQuery.account} issues={myIssuesQuery.extendedSearch} issuesData={issuesData} />
          </>
        )}

        {myIssuesQuery.isError && <Toast type="error" message="Failed to load issues" allowClose={false} />}
      </div>
    </>
  );
};

export default IssuesPage;
