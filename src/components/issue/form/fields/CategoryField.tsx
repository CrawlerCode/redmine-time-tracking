import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import useProject from "../../../../hooks/useProject";

type Props = {
  projectId: number;
};

const CategoryField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "options"> & Props) => {
  const { formatMessage } = useIntl();

  const project = useProject(projectId);

  if (project.data?.issue_categories?.length === 0) return null;

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "issues.issue.field.category" })}
      placeholder={formatMessage({ id: "issues.issue.field.category" })}
      options={
        project.data?.issue_categories?.map((category) => ({
          label: category.name,
          value: category.id,
        })) ?? []
      }
      isLoading={project.isLoading}
    />
  );
};

export default CategoryField;
