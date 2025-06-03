import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import useProject from "../../../../hooks/useProject";
import { SelectField } from "../../../form/SelectField";

type Props = {
  projectId: number;
};

const CategoryField = ({ projectId, ...props }: ComponentProps<typeof SelectField> & Props) => {
  const { formatMessage } = useIntl();

  const project = useProject(projectId);

  if (project.data?.issue_categories?.length === 0) return null;

  return (
    <SelectField
      {...props}
      title={formatMessage({ id: "issues.issue.field.category" })}
      placeholder={formatMessage({ id: "issues.issue.field.category" })}
      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
      options={project.data?.issue_categories?.map((category) => ({
        label: category.name,
        value: category.id,
      }))}
      isLoading={project.isLoading}
    />
  );
};

export default CategoryField;
