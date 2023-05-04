import { useQuery } from "@tanstack/react-query";
import { getAllMyOpenIssues } from "../api/redmine";
import LoadingSpinner from "../components/general/LoadingSpinner";
import Toast from "../components/general/Toast";
import Issue from "../components/issues/Issue";
import useSettings from "../hooks/useSettings";
import useStorage from "../hooks/useStorage";

type IssuesData = {
  [id: number]: {
    active: boolean;
    start?: number;
    time: number;
  };
};

const IssuesPage = () => {
  const { settings } = useSettings();

  const issuesQuery = useQuery(["issues"], () => getAllMyOpenIssues());

  const { data: issues, setData: setIssues } = useStorage<IssuesData>("issues", {});

  return (
    <>
      <div className="flex flex-col items-center gap-y-2">
        {issuesQuery.isLoading && <LoadingSpinner />}
        {issuesQuery.isError && <Toast type="error" message="Failed to load issues" allowClose={false} />}
        {issuesQuery.data?.map((issue) => {
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
              onStop={(time) => {
                setIssues({
                  ...issues,
                  [issue.id]: {
                    active: false,
                    start: undefined,
                    time: time,
                  },
                });
              }}
              onClear={() => {
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
              key={issue.id}
            />
          );
        })}
        {issuesQuery.data?.length === 0 && <p>No issues</p>}
      </div>
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssuesPage;
