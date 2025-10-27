import { groupIssues, ProjectGroup } from "@/utils/groupIssues";
import clsx from "clsx";
import { PinIcon, PlusIcon, SearchIcon, SquareChartGanttIcon, SquareMousePointerIcon, TimerIcon } from "lucide-react";
import { Fragment, ReactNode, RefObject, useMemo, useState } from "react";
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
import { TIssue, TReference, TVersion } from "../../types/redmine";
import { Badge } from "../ui/badge";
import CreateIssueModal from "./CreateIssueModal";
import Issue from "./Issue";
import { SearchRef } from "./Search";
import VersionTooltip from "./VersionTooltip";

type PropTypes = {
  issues: TIssue[];
  localIssues: ReturnType<typeof useLocalIssues>;
  issuePriorities: ReturnType<typeof useIssuePriorities>;
  projectVersions?: ReturnType<typeof useProjectVersions>;
  timers: ReturnType<typeof useTimers>;
  searchRef: RefObject<SearchRef | null>;
};

const IssuesList = ({ issues: unsortedIssues, localIssues, issuePriorities, projectVersions, timers, searchRef }: PropTypes) => {
  const { settings } = useSettings();

  const activeTab = useActiveRedmineTab();

  const myUser = useMyUser();
  const projects = useMyProjects();
  const projectIds = useMemo(() => [...new Set(unsortedIssues.map((i) => i.project.id))], [unsortedIssues]);
  const projectRoles = useMyProjectRoles(projectIds, projects.data);

  const groupedIssues = useMemo(
    () =>
      groupIssues(unsortedIssues, {
        localIssues: localIssues.localIssues,
        timers: timers.getAllTimers(),
        issuePriorities: issuePriorities.data,
        projectVersions: projectVersions?.data ?? {},
        activeTabIssueId: activeTab?.data?.type === "issue" ? activeTab?.data?.id : undefined,
        settings,
      }),
    [unsortedIssues, localIssues.localIssues, timers, issuePriorities.data, projectVersions?.data, activeTab, settings]
  );

  const [createIssue, setCreateIssue] = useState<number | undefined>(undefined);

  return (
    <div className="flex flex-col gap-y-4">
      {groupedIssues.map((projectGroup) => (
        <div key={projectGroup.key} className="flex flex-col gap-y-2">
          <IssueProject
            type={projectGroup.type}
            project={projectGroup.project}
            actions={
              <>
                {projectRoles?.hasProjectPermission(projectGroup.project.id, "add_issues") && (
                  <button type="button" onClick={() => setCreateIssue(projectGroup.project.id)} tabIndex={-1}>
                    <PlusIcon className="size-4" />
                  </button>
                )}
                {searchRef.current && (
                  <button type="button" onClick={() => searchRef.current?.searchInProject(projectGroup.project)} tabIndex={-1}>
                    <SearchIcon className="size-4" />
                  </button>
                )}
              </>
            }
          />
          {projectGroup.groups.map((issueGroup) => (
            <Fragment key={issueGroup.key}>
              {["version", "no-version"].includes(issueGroup.type) && <ProjectVersion version={issueGroup.version} />}

              {issueGroup.issues.map((issue) => (
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
        </div>
      ))}

      {groupedIssues.length === 0 && (
        <p className="text-center">
          <FormattedMessage id="issues.list.no-options" />
        </p>
      )}
      {createIssue !== undefined && <CreateIssueModal projectId={createIssue} onClose={() => setCreateIssue(undefined)} onSuccess={() => setCreateIssue(undefined)} />}
    </div>
  );
};

const IssueProject = ({ project, type, actions }: { project: TReference; type: ProjectGroup["type"]; actions: ReactNode }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx("flex items-center gap-x-1", {
        "bg-background shadow-background sticky top-0 z-5 -mx-2 -my-1 px-2 py-1 shadow": settings.style.stickyScroll,
      })}
    >
      {type === "active-tab" && <SquareMousePointerIcon className="size-3.5 shrink-0" />}
      {type === "tracked-issues" && <TimerIcon className="size-3.5 shrink-0" />}
      {type === "pinned-issues" && <PinIcon className="size-3.5 shrink-0 rotate-30" />}
      {type === "project" && <SquareChartGanttIcon className="size-3.5 shrink-0" />}
      <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="truncate text-sm hover:underline" rel="noreferrer">
        {project.name}
      </a>
      <span className="grow" />
      <div className="flex gap-x-2">{actions}</div>
    </div>
  );
};

const ProjectVersion = ({ version }: { version?: TVersion }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx({
        "bg-background shadow-background sticky top-7 z-5 -mx-2 -my-1 px-2 py-1 shadow": settings.style.stickyScroll,
      })}
    >
      {version ? (
        <VersionTooltip version={version}>
          <Badge variant="secondary" className="max-w-3/4 justify-start px-1 py-0">
            <a href={`${settings.redmineURL}/versions/${version.id}`} target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
              {version.name}
            </a>
          </Badge>
        </VersionTooltip>
      ) : (
        <Badge variant="secondary" className="max-w-3/4 justify-start px-1 py-0">
          <FormattedMessage id="issues.version.no-version" />
        </Badge>
      )}
    </div>
  );
};

export default IssuesList;
