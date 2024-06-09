import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import useProjectVersions from "../../../hooks/useProjectVersions";
import ReactSelectFormik from "../../general/ReactSelectFormik";

type Props = {
  projectId: number;
};

const VersionField = ({ projectId, ...props }: ComponentProps<typeof ReactSelectFormik> & Props) => {
  const { formatMessage } = useIntl();

  const projectVersions = useProjectVersions([projectId]);

  if (projectVersions.data[projectId]?.length === 0) return null;

  return (
    <ReactSelectFormik
      {...props}
      title={formatMessage({ id: "issues.issue.field.version" })}
      placeholder={formatMessage({ id: "issues.issue.field.version" })}
      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
      options={projectVersions.data[projectId]
        ?.filter((version) => version.status === "open")
        .map((version) => ({
          label: version.name,
          value: version.id,
        }))}
      isLoading={projectVersions.isLoading}
    />
  );
};

export default VersionField;
