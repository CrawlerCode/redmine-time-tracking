import { useRedmineProject } from "@/api/redmine/hooks/useRedmineProject";
import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";

type Props = {
  projectId: number;
};

const CategoryField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading"> & Props) => {
  const { formatMessage } = useIntl();

  const projectQuery = useRedmineProject(projectId);

  if (projectQuery.data?.issue_categories?.length === 0) return null;

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "issues.issue.field.category" })}
      placeholder={formatMessage({ id: "issues.issue.field.category" })}
      items={
        projectQuery.data?.issue_categories?.map((category) => ({
          label: category.name,
          value: category.id,
        })) ?? []
      }
      isLoading={projectQuery.isPending}
    />
  );
};

export default CategoryField;
