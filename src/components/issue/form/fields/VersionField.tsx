import { ComboboxField } from "@/components/form/ComboboxField";
import { useProjectVersions } from "@/hooks/useProjectVersions";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";

type Props = {
  projectId: number;
};

const VersionField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "options"> & Props) => {
  const { formatMessage } = useIntl();

  const projectVersions = useProjectVersions(projectId);

  if (projectVersions.projectVersions.length === 0) return null;

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "issues.issue.field.version" })}
      placeholder={formatMessage({ id: "issues.issue.field.version" })}
      options={projectVersions.projectVersions
        .filter((version) => version.status === "open")
        .map((version) => ({
          label: version.name,
          value: version.id,
        }))}
      isLoading={projectVersions.isLoading}
    />
  );
};

export default VersionField;
