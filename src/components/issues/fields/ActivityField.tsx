import { ComponentProps, useEffect } from "react";
import { useIntl } from "react-intl";
import useTimeEntryActivities from "../../../hooks/useTimeEntryActivities";
import ReactSelectFormik from "../../general/ReactSelectFormik";

type Props = {
  projectId: number;
  onDefaultActivityChange?: (activityId: number) => void;
};

const ActivityField = ({ projectId, onDefaultActivityChange, ...props }: ComponentProps<typeof ReactSelectFormik> & Props) => {
  const { formatMessage } = useIntl();

  const timeEntryActivities = useTimeEntryActivities(projectId);

  useEffect(() => {
    if (!timeEntryActivities.defaultActivity) return;

    onDefaultActivityChange?.(timeEntryActivities.defaultActivity.id);
  }, [timeEntryActivities.defaultActivity, onDefaultActivityChange]);

  return (
    <ReactSelectFormik
      {...props}
      title={formatMessage({ id: "time.time-entry.field.activity" })}
      placeholder={formatMessage({ id: "time.time-entry.field.activity" })}
      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
      options={timeEntryActivities.data?.map((activity) => ({
        label: activity.name,
        value: activity.id,
      }))}
      isLoading={timeEntryActivities.isLoading}
    />
  );
};

export default ActivityField;
