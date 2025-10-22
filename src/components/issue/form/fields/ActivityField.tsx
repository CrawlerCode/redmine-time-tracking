import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps, useEffect } from "react";
import { useIntl } from "react-intl";
import useTimeEntryActivities from "../../../../hooks/useTimeEntryActivities";

type Props = {
  projectId: number;
  onDefaultActivityChange?: (activityId: number) => void;
};

const ActivityField = ({ projectId, onDefaultActivityChange, ...props }: Omit<ComponentProps<typeof ComboboxField>, "options"> & Props) => {
  const { formatMessage } = useIntl();

  const timeEntryActivities = useTimeEntryActivities(projectId);

  useEffect(() => {
    if (!timeEntryActivities.defaultActivity) return;

    onDefaultActivityChange?.(timeEntryActivities.defaultActivity.id);
  }, [timeEntryActivities.defaultActivity, onDefaultActivityChange]);

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "time.time-entry.field.activity" })}
      placeholder={formatMessage({ id: "time.time-entry.field.activity" })}
      options={
        timeEntryActivities.data?.map((activity) => ({
          label: activity.name,
          value: activity.id,
        })) ?? []
      }
      isLoading={timeEntryActivities.isLoading}
    />
  );
};

export default ActivityField;
