import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import { TAccount, TIssue, TReference } from "../../types/redmine";
import Issue, { IssueData } from "./Issue";

export type IssuesData = {
  [id: number]: IssueData;
};

type PropTypes = {
  account?: TAccount;
  issues: TIssue[];
  issuesData: ReturnType<typeof useStorage<IssuesData>>;
};

const IssuesList = ({ account, issues, issuesData: { data: issuesData, setData: setIssuesData } }: PropTypes) => {
  const { settings } = useSettings();

  const groupedIssues = Object.values(
    issues.reduce(
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
              remember: false,
            };
            return (
              <Issue
                key={issue.id}
                issue={issue}
                data={data}
                assignedToMe={issue.assigned_to?.id === account?.id ?? false}
                onStart={() => {
                  setIssuesData({
                    ...(settings.options.autoPauseOnSwitch
                      ? Object.entries(issuesData).reduce((res, [id, val]) => {
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
                  };
                  delete newIssuesData[issue.id];
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
                      remember: true,
                    },
                  });
                }}
                onForgot={() => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      remember: false,
                    },
                  });
                }}
              />
            );
          })}
        </>
      ))}
      {issues.length === 0 && <p className="text-center">No issues</p>}
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssuesList;
