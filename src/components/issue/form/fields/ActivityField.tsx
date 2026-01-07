import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps, useEffect, useEffectEvent } from "react";
import { useIntl } from "react-intl";
import useTimeEntryActivities from "../../../../hooks/useTimeEntryActivities";

type Props = {
  projectId: number;
  onDefaultActivityChange?: (activityId: number) => void;
};

const ActivityField = ({ projectId, onDefaultActivityChange, ...props }: Omit<ComponentProps<typeof ComboboxField>, "options"> & Props) => {
  const { formatMessage } = useIntl();

  const timeEntryActivities = useTimeEntryActivities(projectId);

  const handleDefaultActivityChange = useEffectEvent((activityId: number) => onDefaultActivityChange?.(activityId));
  useEffect(() => {
    if (!timeEntryActivities.defaultActivity?.id) return;
    handleDefaultActivityChange(timeEntryActivities.defaultActivity.id);
  }, [timeEntryActivities.defaultActivity]);

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
