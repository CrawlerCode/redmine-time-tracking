import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import { Props } from "react-select";
import { SelectField } from "../../../form/SelectField";

const DoneRatioField = ({ ...props }: ComponentProps<typeof SelectField> & Props) => {
  const { formatMessage } = useIntl();

  return (
    <SelectField
      {...props}
      title={formatMessage({ id: "issues.issue.field.done-ratio" })}
      placeholder={formatMessage({ id: "issues.issue.field.done-ratio" })}
      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
      options={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => ({
        label: `${value} %`,
        value,
      }))}
    />
  );
};

export default DoneRatioField;
