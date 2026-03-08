import { useRedmineProjectTimeEntryActivities } from "@/api/redmine/hooks/useRedmineProjectTimeEntryActivities";
import { ComboboxField } from "@/components/form/ComboboxField";
import { ComponentProps } from "react";
import { useIntl } from "react-intl";

type Props = {
  projectId: number;
};

const ActivityField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading"> & Props) => {
  const { formatMessage } = useIntl();

  const timeEntryActivities = useRedmineProjectTimeEntryActivities(projectId);

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "time.time-entry.field.activity" })}
      placeholder={formatMessage({ id: "time.time-entry.field.activity" })}
      items={
        timeEntryActivities.activities?.map((activity) => ({
          label: activity.name,
          value: activity.id,
        })) ?? []
      }
      isLoading={timeEntryActivities.isPending}
    />
  );
};

export default ActivityField;
