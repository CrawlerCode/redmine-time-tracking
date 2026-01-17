import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import { SelectField } from "../../../form/SelectField";

const DoneRatioField = ({ ...props }: Omit<ComponentProps<typeof SelectField>, "items">) => {
  const { formatMessage } = useIntl();

  return (
    <SelectField
      {...props}
      title={formatMessage({ id: "issues.issue.field.done-ratio" })}
      placeholder={formatMessage({ id: "issues.issue.field.done-ratio" })}
      items={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => ({
        label: `${value} %`,
        value,
      }))}
    />
  );
};

export default DoneRatioField;
