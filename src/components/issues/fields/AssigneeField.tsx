import { ComponentProps, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import useMyAccount from "../../../hooks/useMyAccount";
import useProjectUsers from "../../../hooks/useProjectUsers";
import { getGroupedUsers } from "../../../utils/user";
import ReactSelectFormik from "../../general/ReactSelectFormik";

type Props = {
  projectId: number;
};

const AssigneeField = ({ projectId, ...props }: ComponentProps<typeof ReactSelectFormik> & Props) => {
  const { formatMessage } = useIntl();

  const [loadUsers, setLoadUsers] = useState(false);

  const myAccount = useMyAccount();
  const users = useProjectUsers(projectId, {
    enabled: loadUsers,
  });
  const groupedUsers = useMemo(() => getGroupedUsers(users.data), [users.data]);

  return (
    <ReactSelectFormik
      {...props}
      title={formatMessage({ id: "issues.issue.field.assignee" })}
      placeholder={formatMessage({ id: "issues.issue.field.assignee" })}
      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
      onFocus={() => setLoadUsers(true)}
      options={
        loadUsers
          ? groupedUsers.map(({ role, users }) => ({
              label: role.name,
              options: users.map((user) => ({
                value: user.id,
                label: user.id === myAccount.data?.id ? `${user.name} <<${formatMessage({ id: "issues.issue.field.assignee.me" })}>>` : user.name,
              })),
            }))
          : myAccount.data
            ? [
                {
                  value: myAccount.data.id,
                  label: `${myAccount.data.firstname} ${myAccount.data.lastname} <<${formatMessage({ id: "issues.issue.field.assignee.me" })}>>`,
                },
              ]
            : []
      }
      isLoading={users.isLoading}
    />
  );
};

export default AssigneeField;
