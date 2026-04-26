import { useRedmineIssuePriorities } from "@/api/redmine/hooks/useRedmineIssuePriorities";
import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";

const PriorityField = (props: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading">) => {
  const { formatMessage } = useIntl();

  const issuePriorities = useRedmineIssuePriorities();

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "issues.issue.field.priority" })}
      placeholder={formatMessage({ id: "issues.issue.field.priority" })}
      items={issuePriorities.priorities.map((priority) => ({
        label: priority.name,
        value: priority.id,
      }))}
      isLoading={issuePriorities.isPending}
    />
  );
};

export default PriorityField;
