import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import useIssuePriorities from "../../../../hooks/useIssuePriorities";
import { SelectField } from "../../../form/SelectField";

const PriorityField = (props: ComponentProps<typeof SelectField>) => {
  const { formatMessage } = useIntl();

  const issuePriorities = useIssuePriorities();

  return (
    <SelectField
      {...props}
      title={formatMessage({ id: "issues.issue.field.priority" })}
      placeholder={formatMessage({ id: "issues.issue.field.priority" })}
      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
      options={issuePriorities.data?.map((priority) => ({
        label: priority.name,
        value: priority.id,
      }))}
      isLoading={issuePriorities.isLoading}
    />
  );
};

export default PriorityField;
