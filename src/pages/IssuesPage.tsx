import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAllMyOpenIssues } from "../api/redmine";
import InputField from "../components/general/InputField";
import LoadingSpinner from "../components/general/LoadingSpinner";
import Toast from "../components/general/Toast";
import Issue from "../components/issues/Issue";
import useHotKey from "../hooks/useHotkey";
import useSettings from "../hooks/useSettings";
import useStorage from "../hooks/useStorage";
import { TIssue, TReference } from "../types/redmine";

type IssuesData = {
  [id: number]: {
    active: boolean;
    start?: number;
    time: number;
  };
};

const IssuesPage = () => {
  const { settings } = useSettings();

  const [searching, setSearching] = useState(false);

  useHotKey(() => setSearching(true), { ctrl: true, key: "k" });
  useHotKey(() => setSearching(true), { ctrl: true, key: "f" });
  useHotKey(() => setSearching(false), { key: "Escape" }, searching);

  const [search, setSearch] = useState("");

  const issuesQuery = useInfiniteQuery({
    queryKey: ["issues"],
    queryFn: ({ pageParam = 0 }) => getAllMyOpenIssues(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
  });
  useEffect(() => {
    if (issuesQuery.hasNextPage && !issuesQuery.isFetchingNextPage) issuesQuery.fetchNextPage();
  }, [issuesQuery.hasNextPage, issuesQuery.isFetchingNextPage, issuesQuery.fetchNextPage]);
  const filteredIssues = searching && search ? issuesQuery.data?.pages?.flat().filter((issue) => new RegExp(search, "i").test(`#${issue.id} ${issue.subject}`)) : issuesQuery.data?.pages?.flat();
  const groupedIssues = Object.values(
    filteredIssues?.reduce(
      (
        result: {
          [id: number]: {
            project: TReference;
            issues: TIssue[];
            sort: number;
          };
        },
        issue
      ) => {
        if (!(issue.project.id in result)) {
          result[issue.project.id] = {
            project: issue.project,
            issues: [],
            sort: Object.keys(result).length,
          };
        }
        result[issue.project.id].issues.push(issue);
        return result;
      },
      {}
    ) ?? {}
  ).sort(({ sort: a }, { sort: b }) => a - b);

  const { data: issues, setData: setIssues } = useStorage<IssuesData>("issues", {});

  return (
    <>
      {searching && <InputField icon={<FontAwesomeIcon icon={faSearch} />} placeholder="Search..." className="select-none mb-3" onChange={(e) => setSearch(e.target.value)} autoFocus autoComplete="off" />}
      <div className="flex flex-col gap-y-2">
        {issuesQuery.isLoading && <LoadingSpinner />}
        {issuesQuery.isError && <Toast type="error" message="Failed to load issues" allowClose={false} />}
        {groupedIssues.map(({ project, issues: groupIssues }) => (
          <>
            <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1}>
              <h5 className="text-xs text-slate-500 dark:text-slate-300 truncate">{project.name}</h5>
            </a>
            {groupIssues.map((issue) => {
              const issueData =
                issue.id in issues
                  ? issues[issue.id]
                  : {
                      active: false,
                      start: undefined,
                      time: 0,
                    };
              return (
                <Issue
                  issue={issue}
                  isActive={issueData.active}
                  time={issueData.time}
                  start={issueData.start}
                  onStart={() => {
                    setIssues({
                      ...(settings.options.autoPauseOnSwitch
                        ? Object.entries(issues).reduce((res, [id, val]) => {
                            // @ts-ignore
                            res[id] = val.active
                              ? {
                                  active: false,
                                  start: undefined,
                                  time: calcTime(val.time, val.start),
                                }
                              : val;
                            return res;
                          }, {})
                        : issues),
                      [issue.id]: {
                        active: true,
                        start: new Date().getTime(),
                        time: issueData.time,
                      },
                    });
                  }}
                  onPause={(time) => {
                    setIssues({
                      ...issues,
                      [issue.id]: {
                        active: false,
                        start: undefined,
                        time: time,
                      },
                    });
                  }}
                  onStop={() => {
                    setIssues({
                      ...issues,
                      [issue.id]: {
                        active: false,
                        start: undefined,
                        time: 0,
                      },
                    });
                  }}
                  onDone={(time) => {
                    const h = time / 1000 / 60 / 60;
                    window.open(`${settings.redmineURL}/issues/${issue.id}/time_entries/new?time_entry[hours]=${h}`);
                  }}
                  onOverrideTime={(time) => {
                    issueData.time = time;
                    if (issueData.active) issueData.start = new Date().getTime();
                    setIssues({
                      ...issues,
                      [issue.id]: issueData,
                    });
                  }}
                  key={issue.id}
                />
              );
            })}
          </>
        ))}

        {filteredIssues?.length === 0 && <p className="text-center">No issues</p>}
      </div>
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssuesPage;
