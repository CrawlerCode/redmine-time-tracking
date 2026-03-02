import { useIssuePriorities } from "@/hooks/useIssuePriorities";
import useMyProjects from "@/hooks/useMyProjects";
import { usePermissions } from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { clsxm } from "@/utils/clsxm";
import { ProjectIssuesGroup as ProjectIssuesGroupType } from "@/utils/groupIssues";
import clsx from "clsx";
import { PinIcon, PlusIcon, SearchIcon, SquareChartGanttIcon, SquareMousePointerIcon, TimerIcon } from "lucide-react";
import { ComponentProps, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { TReference, TVersion } from "../../api/redmine/types";
import useLocalIssues from "../../hooks/useLocalIssues";
import useMyUser from "../../hooks/useMyUser";
import useTimers from "../../hooks/useTimers";
import { Badge } from "../ui/badge";
import CreateIssueModal from "./CreateIssueModal";
import Issue from "./Issue";
import { useIssueSearch } from "./IssueSearch";
import ProjectTooltip from "./ProjectTooltip";
import VersionTooltip from "./VersionTooltip";

interface ProjectIssuesGroupProps extends ComponentProps<"div"> {
  projectGroup: ProjectIssuesGroupType;
  localIssues: ReturnType<typeof useLocalIssues>;
  timers: ReturnType<typeof useTimers>;
}

export const ProjectIssuesGroup = ({ projectGroup, localIssues, timers, className, ...props }: ProjectIssuesGroupProps) => {
  const { settings } = useSettings();

  const myUser = useMyUser();
  const { getPriorityType } = useIssuePriorities({ enabled: settings.style.showIssuesPriority });

  return (
    <div {...props} className={clsxm("flex flex-col gap-y-2", className)}>
      <IssueProject type={projectGroup.type} projectRef={projectGroup.project} />
      {projectGroup.groups.map((issueGroup) => (
        <Fragment key={issueGroup.key}>
          {["version", "no-version"].includes(issueGroup.type) && <ProjectVersion version={issueGroup.version} />}

          {issueGroup.issues.map((issue) => (
            <Issue
              key={issue.id}
              issue={issue}
              localIssue={localIssues.getLocalIssue(issue.id)}
              priorityType={getPriorityType(issue)}
              assignedToMe={myUser.data ? myUser.data.id === issue.assigned_to?.id : true}
              timers={timers.getTimersByIssue(issue.id)}
              onAddTimer={() => timers.addTimer(issue.id)}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

const IssueProject = ({ projectRef, type }: { projectRef: TReference; type: ProjectIssuesGroupType["type"] }) => {
  const { settings } = useSettings();

  const projects = useMyProjects();
  const project = projects.data?.find((p) => p.id === projectRef.id);

  return (
    <div
      className={clsx("flex items-center gap-x-1", {
        "bg-background shadow-background sticky top-0 z-5 py-1 shadow": settings.style.stickyScroll,
      })}
    >
      <ProjectGroupIcon type={type} />
      {project ? (
        <ProjectTooltip project={project}>
          <a href={`${settings.redmineURL}/projects/${projectRef.id}`} target="_blank" tabIndex={-1} className="truncate text-sm hover:underline" rel="noreferrer">
            {projectRef.name}
          </a>
        </ProjectTooltip>
      ) : (
        <a href={`${settings.redmineURL}/projects/${projectRef.id}`} target="_blank" tabIndex={-1} className="truncate text-sm hover:underline" rel="noreferrer">
          {projectRef.name}
        </a>
      )}
      <span className="grow" />
      <div className="flex gap-x-2">
        <CreateIssueButton project={projectRef} />
        <SearchInProjectButton project={projectRef} />
      </div>
    </div>
  );
};

export const ProjectGroupIcon = ({ type }: { type: ProjectIssuesGroupType["type"] }) => {
  switch (type) {
    case "active-tab":
      return <SquareMousePointerIcon className="size-3.5 shrink-0" />;
    case "tracked-issues":
      return <TimerIcon className="size-3.5 shrink-0" />;
    case "pinned-issues":
      return <PinIcon className="size-3.5 shrink-0 rotate-30" />;
    case "project":
      return <SquareChartGanttIcon className="size-3.5 shrink-0" />;
    default:
      return null;
  }
};

const CreateIssueButton = ({ project }: { project: TReference }) => {
  const { hasProjectPermission } = usePermissions();

  const [createIssue, setCreateIssue] = useState<boolean>(false);

  if (!hasProjectPermission(project.id, "add_issues")) return;

  return (
    <>
      <button type="button" onClick={() => setCreateIssue(true)} tabIndex={-1}>
        <PlusIcon className="size-4" />
      </button>

      {createIssue && <CreateIssueModal projectId={project.id} onClose={() => setCreateIssue(false)} onSuccess={() => setCreateIssue(false)} />}
    </>
  );
};

const SearchInProjectButton = ({ project }: { project: TReference }) => {
  const { searchInProject } = useIssueSearch();

  return (
    <button type="button" onClick={() => searchInProject(project)} tabIndex={-1}>
      <SearchIcon className="size-4" />
    </button>
  );
};

const ProjectVersion = ({ version }: { version?: TVersion }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx({
        "bg-background shadow-background sticky top-7 z-5 -my-1 py-1 shadow": settings.style.stickyScroll,
      })}
    >
      {version ? (
        <VersionTooltip version={version}>
          <Badge variant="secondary" className="max-w-3/4 justify-start">
            <a href={`${settings.redmineURL}/versions/${version.id}`} target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
              {version.name}
            </a>
          </Badge>
        </VersionTooltip>
      ) : (
        <Badge variant="secondary" className="max-w-3/4 justify-start">
          <FormattedMessage id="issues.version.no-version" />
        </Badge>
      )}
    </div>
  );
};
