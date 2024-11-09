import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import useActiveRedmineTab from "../../hooks/useActiveRedmineTab";
import useIssuePriorities from "../../hooks/useIssuePriorities";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useMyProjects from "../../hooks/useMyProjects";
import useMyUser from "../../hooks/useMyUser";
import useProjectVersions from "../../hooks/useProjectVersions";
import useSettings from "../../hooks/useSettings";
import useTimers from "../../hooks/useTimers";
import { TIssue, TProject, TReference } from "../../types/redmine";
import { getGroupedIssues, getSortedIssues } from "../../utils/issue";
import CreateIssueModal from "./CreateIssueModal";
import Issue from "./Issue";
import VersionTooltip from "./VersionTooltip";

type PropTypes = {
  issues: TIssue[];
  issuePriorities: ReturnType<typeof useIssuePriorities>;
  projectVersions?: ReturnType<typeof useProjectVersions>;
  timers: ReturnType<typeof useTimers>;
  onSearchInProject?: (project: TReference) => void;
};

const IssuesList = ({ issues: rawIssues, issuePriorities, projectVersions, timers, onSearchInProject }: PropTypes) => {
  const { settings } = useSettings();

  const activeTab = useActiveRedmineTab();

  const myUser = useMyUser();
  const projects = useMyProjects();
  const projectRoles = useMyProjectRoles([...new Set(rawIssues.map((i) => i.project.id))]);
  const groupedIssues = getGroupedIssues({
    issues: getSortedIssues(rawIssues, settings.style.sortIssuesByPriority ? issuePriorities.data : [], timers.timers),
    projectVersions: projectVersions?.data ?? {},
    timersData: timers.timers,
    settings,
    activeTabIssueId: activeTab?.data?.type === "issue" ? activeTab?.data?.id : undefined,
  });

  const [createIssue, setCreateIssue] = useState<number | undefined>(undefined);

  return (
    <>
      {groupedIssues.map(({ id, project: projectRef, versions, groups }) => {
        const project: TProject | TReference | undefined = projects.data?.find((p) => p.id === projectRef?.id) ?? projectRef;
        return (
          <Fragment key={id}>
            {project && (
              <div
                className={clsx("flex justify-between gap-x-2", {
                  "sticky top-0 z-[5] -mx-2 -my-1 bg-background px-2 py-1 shadow shadow-background": settings.style.stickyScroll,
                })}
              >
                <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="max-w-fit truncate text-xs hover:underline">
                  {project.name}
                </a>

                <div className="flex gap-x-2">
                  {projectRoles?.hasProjectPermission(project, "add_issues") && (
                    <button type="button" onClick={() => setCreateIssue(project.id)} tabIndex={-1}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  )}
                  {onSearchInProject && (
                    <button type="button" onClick={() => onSearchInProject(project)} tabIndex={-1}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  )}
                </div>
              </div>
            )}
            {groups.map(({ type, version, issues }) => (
              <Fragment key={`${type}-${version?.id}`}>
                {settings.style.groupIssuesByVersion && versions.length > 0 && ["version", "no-version"].includes(type) && (
                  <>
                    {version && <VersionTooltip version={version} />}
                    <div
                      className={clsx({
                        "shadow- sticky top-6 z-[5] -mx-2 -my-1 bg-background px-2 py-1 shadow shadow-background": settings.style.stickyScroll,
                      })}
                    >
                      <span className="w-fit truncate rounded bg-background-inner px-1.5 text-xs text-gray-950 dark:text-gray-300" data-tooltip-id={`tooltip-version-${version?.id}`}>
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
                  const timer = timers.getTimer(issue.id);

                  return (
                    <Issue
                      key={issue.id}
                      issue={issue}
                      priorityType={issuePriorities.getPriorityType(issue)}
                      assignedToMe={myUser.data ? myUser.data.id === issue.assigned_to?.id : true}
                      canEdit={
                        projectRoles.hasProjectPermission(issue.project, "edit_issues") || (projectRoles.hasProjectPermission(issue.project, "edit_own_issues") && issue.author.id === myUser.data?.id)
                      }
                      canLogTime={projectRoles.hasProjectPermission(issue.project, "log_time")}
                      timer={timer}
                    />
                  );
                })}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
      {groupedIssues.length === 0 && (
        <p className="text-center">
          <FormattedMessage id="issues.list.no-options" />
        </p>
      )}
      {createIssue !== undefined && <CreateIssueModal projectId={createIssue} onClose={() => setCreateIssue(undefined)} onSuccess={() => setCreateIssue(undefined)} />}
    </>
  );
};

export default IssuesList;
