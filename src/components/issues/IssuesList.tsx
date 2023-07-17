import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import { TAccount, TIssue, TReference } from "../../types/redmine";
import Issue from "./Issue";
import { IssueTimerData } from "./IssueTimer";

type IssueData = IssueTimerData & {
  pinned: boolean;
  remembered: boolean;
} & {
  // TODO: remove me later
  favorite?: boolean;
  remember?: boolean;
};

export type IssuesData = {
  [id: number]: IssueData;
};

type PropTypes = {
  account?: TAccount;
  issues: TIssue[];
  issuesData: ReturnType<typeof useStorage<IssuesData>>;
};

const IssuesList = ({ account, issues: rawIssues, issuesData: { data: issuesData, setData: setIssuesData } }: PropTypes) => {
  const { settings } = useSettings();

  const sortedIssues = rawIssues.sort((a, b) => {
    const pinnedA = issuesData[a.id]?.pinned || issuesData[a.id]?.favorite;
    const pinnedB = issuesData[b.id]?.pinned || issuesData[b.id]?.favorite;
    if (pinnedA && pinnedB) return new Date(a.updated_on).getTime() - new Date(a.updated_on).getTime();
    return pinnedA ? -1 : 1;
  });

  const groupedIssues = Object.values(
    sortedIssues.reduce(
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
    )
  ).sort((a, b) => a.sort - b.sort);

  return (
    <>
      {groupedIssues.map(({ project, issues: groupIssues }) => (
        <>
          <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="text-xs text-slate-500 dark:text-slate-300 hover:underline truncate max-w-fit">
            {project.name}
          </a>
          {groupIssues.map((issue) => {
            const data: IssueData = issuesData?.[issue.id] ?? {
              active: false,
              start: undefined,
              time: 0,
              pinned: false,
              remembered: false,
            };
            /**
             * support old data schema
             * TODO: remove me later
             */
            if (data.favorite) {
              data.pinned = true;
              delete data.favorite;
            }
            if (data.remember) {
              data.remembered = true;
              delete data.remember;
            }
            return (
              <Issue
                key={issue.id}
                issue={issue}
                timerData={{ active: data.active, start: data.start, time: data.time }}
                assignedToMe={issue.assigned_to?.id === account?.id ?? false}
                pinned={data.pinned}
                remembered={data.remembered}
                onStart={() => {
                  setIssuesData({
                    ...(settings.options.autoPauseOnSwitch
                      ? Object.entries(issuesData).reduce((res, [id, val]) => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          res[id] = val.active
                            ? {
                                ...val,
                                active: false,
                                start: undefined,
                                time: calcTime(val.time, val.start),
                              }
                            : val;
                          return res;
                        }, {})
                      : issuesData),
                    [issue.id]: {
                      ...data,
                      active: true,
                      start: new Date().getTime(),
                      time: data.time,
                    },
                  });
                }}
                onPause={(time) => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      active: false,
                      start: undefined,
                      time: time,
                    },
                  });
                }}
                onStop={() => {
                  const newIssuesData = {
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      active: false,
                      start: undefined,
                      time: 0,
                    },
                  };
                  if (!data.pinned && !data.remembered) {
                    delete newIssuesData[issue.id];
                  }
                  setIssuesData(newIssuesData);
                }}
                onOverrideTime={(time) => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      time: time,
                      ...(data.active
                        ? {
                            start: new Date().getTime(),
                          }
                        : {}),
                    },
                  });
                }}
                onRemember={() => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      remembered: true,
                    },
                  });
                }}
                onForget={() => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      remembered: false,
                    },
                  });
                }}
                onPin={() => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      pinned: true,
                    },
                  });
                }}
                onUnpin={() => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      pinned: false,
                    },
                  });
                }}
              />
            );
          })}
        </>
      ))}
      {rawIssues.length === 0 && <p className="text-center">No issues</p>}
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssuesList;
