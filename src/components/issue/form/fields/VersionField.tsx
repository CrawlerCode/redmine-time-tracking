import { useRedmineProjectVersions } from "@/api/redmine/hooks/useRedmineProjectVersions";
import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";

type Props = {
  projectId: number;
};

const VersionField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading"> & Props) => {
  const { formatMessage } = useIntl();

  const projectVersionsQuery = useRedmineProjectVersions(projectId);

  if (projectVersionsQuery.data?.length === 0) return null;

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "issues.issue.field.version" })}
      placeholder={formatMessage({ id: "issues.issue.field.version" })}
      items={
        projectVersionsQuery.data
          ?.filter((version) => version.status === "open")
          .map((version) => ({
            label: version.name,
            value: version.id,
          })) ?? []
      }
      isLoading={projectVersionsQuery.isPending}
    />
  );
};

export default VersionField;
