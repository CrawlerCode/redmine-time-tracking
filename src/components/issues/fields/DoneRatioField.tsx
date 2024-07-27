import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import ReactSelectFormik from "../../general/ReactSelectFormik";
import { Props } from "react-select";

const DoneRatioField = ({ ...props }: ComponentProps<typeof ReactSelectFormik> & Props) => {
  const { formatMessage } = useIntl();

  return (
    <ReactSelectFormik
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
