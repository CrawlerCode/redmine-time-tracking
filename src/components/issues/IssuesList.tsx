import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import useIssuePriorities from "../../hooks/useIssuePriorities";
import useProjectVersions from "../../hooks/useProjectVersions";
import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import { TAccount, TIssue, TReference } from "../../types/redmine";
import { getGroupedIssues, getSortedIssues } from "../../utils/issue";
import Issue from "./Issue";
import { IssueTimerData } from "./IssueTimer";
import VersionTooltip from "./VersionTooltip";

type IssueData = IssueTimerData & {
  pinned: boolean;
  remembered: boolean;
};

export type IssuesData = Record<number, IssueData>;

type PropTypes = {
  account?: TAccount;
  issues: TIssue[];
  issuePriorities: ReturnType<typeof useIssuePriorities>;
  projectVersions?: ReturnType<typeof useProjectVersions>;
  issuesData: ReturnType<typeof useStorage<IssuesData>>;
  onSearchInProject?: (project: TReference) => void;
};

const IssuesList = ({ account, issues: rawIssues, issuePriorities, projectVersions, issuesData: { data: issuesData, setData: setIssuesData }, onSearchInProject }: PropTypes) => {
  const { settings } = useSettings();

  const groupedIssues = getGroupedIssues(getSortedIssues(rawIssues, settings.style.sortIssuesByPriority ? issuePriorities.data : [], issuesData), projectVersions?.data ?? {}, issuesData, settings);

  return (
    <>
      {groupedIssues.map(({ project, versions, groups }) => (
        <Fragment key={project.id}>
          <div
            className={clsx("flex justify-between gap-x-2", {
              "sticky top-0 z-[5] -mx-2 -my-1 bg-white px-2 py-1 shadow shadow-white dark:bg-gray-800 dark:shadow-gray-800": settings.style.stickyScroll,
            })}
          >
            <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="max-w-fit truncate text-xs text-slate-500 hover:underline dark:text-slate-300">
              {project.name}
            </a>
            {onSearchInProject && (
              <button type="button" className="text-gray-900 dark:text-white" onClick={() => onSearchInProject(project)} tabIndex={-1}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            )}
          </div>
          {groups.map(({ type, version, issues }) => (
            <Fragment key={`${type}-${version?.id}`}>
              {settings.style.groupIssuesByVersion && versions.length > 0 && ["version", "no-version"].includes(type) && (
                <>
                  {version && <VersionTooltip version={version} />}
                  <div
                    className={clsx({
                      "shadow- sticky top-6 z-[5] -mx-2 -my-1 bg-white px-2 py-1 shadow shadow-white dark:bg-gray-800 dark:shadow-gray-800": settings.style.stickyScroll,
                    })}
                  >
                    <span
                      className="w-fit truncate rounded border border-gray-300 bg-gray-100 px-1.5 text-xs text-gray-800 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300"
                      data-tooltip-id={`tooltip-version-${version?.id}`}
                    >
                      {type === "version" && version && (
                        <a href={`${settings.redmineURL}/versions/${version.id}`} target="_blank" tabIndex={-1} className="hover:underline">
                          {version.name}
                        </a>
                      )}
                      {type === "no-version" && <FormattedMessage id="issues.version.no-version" />}
                    </span>
                  </div>
                </>
              )}

              {issues.map((issue) => {
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
                    assignedToMe={account ? account.id === issue.assigned_to?.id : true}
                    pinned={data.pinned}
                    remembered={data.remembered}
                    onStart={() => {
                      setIssuesData({
                        ...(settings.features.autoPauseOnSwitch
                          ? Object.entries(issuesData).reduce((res: IssuesData, [id, val]) => {
                              res[Number(id)] = val.active
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
                    onReset={() => {
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
        </Fragment>
      ))}
      {groupedIssues.length === 0 && (
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
