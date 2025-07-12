import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import useIssuePriorities from "../../../../hooks/useIssuePriorities";
import { SelectField } from "../../../form/SelectField";

const PriorityField = (props: Omit<ComponentProps<typeof SelectField>, "options">) => {
  const { formatMessage } = useIntl();

  const issuePriorities = useIssuePriorities();

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "issues.issue.field.priority" })}
      placeholder={formatMessage({ id: "issues.issue.field.priority" })}
      options={
        issuePriorities.data?.map((priority) => ({
          label: priority.name,
          value: priority.id,
        })) ?? []
      }
      isLoading={issuePriorities.isLoading}
    />
  );
};

export default PriorityField;
