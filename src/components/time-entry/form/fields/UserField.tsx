import { useRedmineCurrentUser } from "@/api/redmine/hooks/useRedmineCurrentUser";
import { useRedmineProjectMembers } from "@/api/redmine/hooks/useRedmineProjectMembers";
import { ComboboxField } from "@/components/form/ComboboxField";
import { groupMembers } from "@/utils/groupMembers";
import { ComponentProps, useMemo, useState } from "react";
import { useIntl } from "react-intl";

type Props = {
  projectId: number;
};

const UserField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading"> & Props) => {
  const { formatMessage } = useIntl();

  const [fetchMembers, setFetchMembers] = useState(false);

  const { data: me } = useRedmineCurrentUser();
  const members = useRedmineProjectMembers(projectId, {
    enabled: fetchMembers,
  });
  const groupedMembers = useMemo(() => groupMembers(members.members), [members.members]);

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "time.time-entry.field.user" })}
      placeholder={formatMessage({ id: "time.time-entry.field.user" })}
      noOptionsMessage={formatMessage({ id: "time.time-entry.field.user.no-options" })}
      onOpenChange={(open) => open && setFetchMembers(true)}
      items={
        fetchMembers
          ? groupedMembers.map(({ role, users }) => ({
              label: role.name,
              items: users.map((user) => ({
                value: user.id,
                label: user.id === me?.id ? `${user.name} <<${formatMessage({ id: "issues.issue.field.assignee.me" })}>>` : user.name,
              })),
            }))
          : me
            ? [
                {
                  value: me.id,
                  label: `${me.firstname} ${me.lastname} <<${formatMessage({ id: "issues.issue.field.assignee.me" })}>>`,
                },
              ]
            : []
      }
      isLoading={fetchMembers && members.isPending}
    />
  );
};

export default UserField;
