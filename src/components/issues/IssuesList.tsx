import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import useIssuePriorities from "../../hooks/useIssuePriorities";
import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import { TAccount, TIssue, TReference } from "../../types/redmine";
import Issue from "./Issue";
import { IssueTimerData } from "./IssueTimer";

type IssueData = IssueTimerData & {
  pinned: boolean;
  remembered: boolean;
};

export type IssuesData = {
  [id: number]: IssueData;
};

type PropTypes = {
  account?: TAccount;
  issues: TIssue[];
  issuesData: ReturnType<typeof useStorage<IssuesData>>;
  onSearchInProject: (project: TReference) => void;
};

const IssuesList = ({ account, issues: rawIssues, issuesData: { data: issuesData, setData: setIssuesData }, onSearchInProject }: PropTypes) => {
  const { settings } = useSettings();

  const issuePriorities = useIssuePriorities();

  const issuePrioritiesIndices = issuePriorities.data.reduce(
    (result, priority, index) => {
      result[priority.id] = index;
      return result;
    },
    {} as Record<number, number>
  );
  const sortedIssues = rawIssues.sort(
    (a, b) =>
      (issuesData[b.id]?.pinned ? 1 : 0) - (issuesData[a.id]?.pinned ? 1 : 0) ||
      issuePrioritiesIndices[b.priority.id] - issuePrioritiesIndices[a.priority.id] ||
      new Date(a.updated_on).getTime() - new Date(a.updated_on).getTime()
  );

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
        <Fragment key={project.id}>
          <div className="flex justify-between gap-x-2">
            <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="max-w-fit truncate text-xs text-slate-500 hover:underline dark:text-slate-300">
              {project.name}
            </a>
            <button type="button" className=" text-gray-900 dark:text-white" onClick={() => onSearchInProject(project)} tabIndex={-1}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          {groupIssues.map((issue) => {
            const data: IssueData = issuesData?.[issue.id] ?? {
              active: false,
              start: undefined,
              time: 0,
              pinned: false,
              remembered: false,
            };
            return (
              <Issue
                key={issue.id}
                issue={issue}
                priorityType={issuePriorities.getPriorityType(issue)}
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
                onPinAndRemember={() => {
                  setIssuesData({
                    ...issuesData,
                    [issue.id]: {
                      ...data,
                      pinned: true,
                      remembered: true,
                    },
                  });
                }}
              />
            );
          })}
        </Fragment>
      ))}
      {rawIssues.length === 0 && (
        <p className="text-center">
          <FormattedMessage id="issues.list.no-issues" />
        </p>
      )}
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssuesList;
