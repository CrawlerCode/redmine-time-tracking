import { ComboboxField } from "@/components/form/ComboboxField";
import { groupUsers } from "@/utils/groupUsers";
import { ComponentProps, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import useMyUser from "../../../../hooks/useMyUser";
import useProjectUsers from "../../../../hooks/useProjectUsers";

type Props = {
  projectId: number;
};

const UserField = ({ projectId, ...props }: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading"> & Props) => {
  const { formatMessage } = useIntl();

  const [loadUsers, setLoadUsers] = useState(false);

  const myUser = useMyUser();
  const users = useProjectUsers(projectId, {
    enabled: loadUsers,
  });
  const groupedUsers = useMemo(() => groupUsers(users.data), [users.data]);

  return (
    <ComboboxField
      {...props}
      title={formatMessage({ id: "time.time-entry.field.user" })}
      placeholder={formatMessage({ id: "time.time-entry.field.user" })}
      noOptionsMessage={formatMessage({ id: "time.time-entry.field.user.no-options" })}
      onOpenChange={(open) => open && setLoadUsers(true)}
      items={
        loadUsers
          ? groupedUsers.map(({ role, users }) => ({
              label: role.name,
              items: users.map((user) => ({
                value: user.id,
                label: user.id === myUser.data?.id ? `${user.name} <<${formatMessage({ id: "issues.issue.field.assignee.me" })}>>` : user.name,
              })),
            }))
          : myUser.data
            ? [
                {
                  value: myUser.data.id,
                  label: `${myUser.data.firstname} ${myUser.data.lastname} <<${formatMessage({ id: "issues.issue.field.assignee.me" })}>>`,
                },
              ]
            : []
      }
      isLoading={users.isLoading}
    />
  );
};

export default UserField;
