import { useRedmineProject } from "@/api/redmine/hooks/useRedmineProject";
import { ReactElement } from "react";
import { useIntl } from "react-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  projectId: number;
};

export const ProjectTooltip = ({ children, ...props }: PropTypes & { children: ReactElement }) => {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent className="flex max-w-[17rem] flex-col gap-y-3 truncate">
        <ProjectTooltipContent {...props} />
      </TooltipContent>
    </Tooltip>
  );
};

const ProjectTooltipContent = ({ projectId }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { data: project } = useRedmineProject(projectId);

  return (
    <>
      {project && (
        <>
          <div>
            <p className="truncate text-sm font-semibold">{project.name}</p>
            {project.description && <p className="truncate text-xs font-normal">{project.description}</p>}
          </div>
          <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm">
            <tbody>
              <tr>
                <th className="text-xs font-medium">{formatMessage({ id: "issues.project.field.identifier" })}:</th>
                <td>{project.identifier}</td>
              </tr>
              {project.homepage && (
                <tr>
                  <th className="text-xs font-medium">{formatMessage({ id: "issues.project.field.homepage" })}:</th>
                  <td>{project.homepage}</td>
                </tr>
              )}
              <tr>
                <th className="text-xs font-medium">{formatMessage({ id: "issues.project.field.is-public" })}:</th>
                <td>{project.is_public ? formatMessage({ id: "general.yes" }) : formatMessage({ id: "general.no" })}</td>
              </tr>
              {project.custom_fields?.map((field) => {
                if (!field.value) return null;
                if (Array.isArray(field.value) && field.value.length === 0) return null;

                const value = Array.isArray(field.value) ? field.value.join(", ") : String(field.value);
                return (
                  <tr key={field.id}>
                    <th className="text-xs font-medium">{field.name}:</th>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      <p className="italic">{formatMessage({ id: "issues.project-tooltip.open-in-redmine" })}</p>
    </>
  );
};
