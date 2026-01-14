import { FormattedMessage } from "react-intl";
import { TProject } from "../../api/redmine/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ReactElement } from "react";

type PropTypes = {
  project: TProject;
  children: ReactElement;
};

const ProjectTooltip = ({ project, children }: PropTypes) => {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent className="flex max-w-[17rem] flex-col gap-y-3 truncate">
        <div>
          <p className="truncate text-sm font-semibold">{project.name}</p>
          {project.description && <p className="truncate text-xs font-normal">{project.description}</p>}
        </div>
        <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm">
          <tbody>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.project.field.identifier" />:
              </th>
              <td>{project.identifier}</td>
            </tr>
            {project.homepage && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.project.field.homepage" />:
                </th>
                <td>{project.homepage}</td>
              </tr>
            )}
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.project.field.is-public" />:
              </th>
              <td>{project.is_public ? <FormattedMessage id="general.yes" /> : <FormattedMessage id="general.no" />}</td>
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
        <p className="italic">
          <FormattedMessage id="issues.project-tooltip.open-in-redmine" />
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ProjectTooltip;
