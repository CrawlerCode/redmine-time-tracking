import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import useActiveRedmineTab from "../../hooks/useActiveRedmineTab";
import useIssuePriorities from "../../hooks/useIssuePriorities";
import useLocalIssues from "../../hooks/useLocalIssues";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useMyProjects from "../../hooks/useMyProjects";
import useMyUser from "../../hooks/useMyUser";
import useProjectVersions from "../../hooks/useProjectVersions";
import useTimers from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue, TReference } from "../../types/redmine";
import { getGroupedIssues, getSortedIssues } from "../../utils/issue";
import { Badge } from "../ui/badge";
import CreateIssueModal from "./CreateIssueModal";
import Issue from "./Issue";
import VersionTooltip from "./VersionTooltip";

type PropTypes = {
  issues: TIssue[];
  localIssues: ReturnType<typeof useLocalIssues>;
  issuePriorities: ReturnType<typeof useIssuePriorities>;
  projectVersions?: ReturnType<typeof useProjectVersions>;
  timers: ReturnType<typeof useTimers>;
  onSearchInProject?: (project: TReference) => void;
};

const IssuesList = ({ issues: rawIssues, localIssues, issuePriorities, projectVersions, timers, onSearchInProject }: PropTypes) => {
  const { settings } = useSettings();

  const activeTab = useActiveRedmineTab();

  const myUser = useMyUser();
  const projects = useMyProjects();
  const projectRoles = useMyProjectRoles([...new Set(rawIssues.map((i) => i.project.id))], projects.data);
  const groupedIssues = getGroupedIssues({
    issues: getSortedIssues({
      issues: rawIssues,
      localIssues: localIssues.localIssues,
      issuePriorities: settings.style.sortIssuesByPriority ? issuePriorities.data : [],
    }),
    localIssues: localIssues.localIssues,
    projectVersions: projectVersions?.data ?? {},
    timers: timers.getAllTimers(),
    settings,
    activeTabIssueId: activeTab?.data?.type === "issue" ? activeTab?.data?.id : undefined,
  });

  const [createIssue, setCreateIssue] = useState<number | undefined>(undefined);

  return (
    <>
      {groupedIssues.map(({ id, project, versions, groups }) => {
        return (
          <Fragment key={id}>
            {project && (
              <div
                className={clsx("flex justify-between gap-x-2", {
                  "bg-background shadow-background sticky top-0 z-5 -mx-2 -my-1 px-2 py-1 shadow": settings.style.stickyScroll,
                })}
              >
                <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="max-w-fit truncate text-xs hover:underline" rel="noreferrer">
                  {project.name}
                </a>

                <div className="flex gap-x-2">
                  {projectRoles?.hasProjectPermission(project.id, "add_issues") && (
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
                  <div
                    className={clsx({
                      "bg-background shadow-background sticky top-6 z-5 -mx-2 -my-1 px-2 py-1 shadow": settings.style.stickyScroll,
                    })}
                  >
                    <VersionTooltip version={version}>
                      <Badge variant="secondary" className="max-w-3/4 justify-start px-1 py-0">
                        {type === "version" && version && (
                          <a href={`${settings.redmineURL}/versions/${version.id}`} target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
                            {version.name}
                          </a>
                        )}
                        {type === "no-version" && <FormattedMessage id="issues.version.no-version" />}
                      </Badge>
                    </VersionTooltip>
                  </div>
                )}

                {issues.map((issue) => (
                  <Issue
                    key={issue.id}
                    issue={issue}
                    localIssue={localIssues.getLocalIssue(issue.id)}
                    priorityType={issuePriorities.getPriorityType(issue)}
                    assignedToMe={myUser.data ? myUser.data.id === issue.assigned_to?.id : true}
                    timers={timers.getTimersByIssue(issue.id)}
                    onAddTimer={() => timers.addTimer(issue.id)}
                    canEdit={
                      projectRoles.hasProjectPermission(issue.project.id, "edit_issues") ||
                      (projectRoles.hasProjectPermission(issue.project.id, "edit_own_issues") && issue.author.id === myUser.data?.id)
                    }
                    canLogTime={projectRoles.hasProjectPermission(issue.project.id, "log_time")}
                    canAddNotes={projectRoles.hasProjectPermission(issue.project.id, "add_issue_notes")}
                  />
                ))}
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
