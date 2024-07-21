import { ComponentProps, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import useMyUser from "../../../hooks/useMyUser";
import useProjectUsers from "../../../hooks/useProjectUsers";
import { getGroupedUsers } from "../../../utils/user";
import ReactSelectFormik from "../../general/ReactSelectFormik";

type Props = {
  projectId: number;
};

const TimeEntryUsersField = ({ projectId, ...props }: ComponentProps<typeof ReactSelectFormik> & Props) => {
  const { formatMessage } = useIntl();

  const [loadUsers, setLoadUsers] = useState(false);

  const myUser = useMyUser();
  const users = useProjectUsers(projectId, {
    enabled: loadUsers,
  });
  const groupedUsers = useMemo(() => getGroupedUsers(users.data), [users.data]);

  return (
    <ReactSelectFormik
      {...props}
      title={formatMessage({ id: "time.time-entry.field.user" })}
      placeholder={formatMessage({ id: "time.time-entry.field.user" })}
      noOptionsMessage={() => formatMessage({ id: "time.time-entry.field.user.no-options" })}
      onFocus={() => setLoadUsers(true)}
      options={
        loadUsers
          ? groupedUsers.map(({ role, users }) => ({
              label: role.name,
              options: users.map((user) => ({
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

export default TimeEntryUsersField;
