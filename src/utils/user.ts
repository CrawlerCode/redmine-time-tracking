import { TUser } from "../hooks/useProjectUsers";
import { TReference } from "../types/redmine";

type GroupedUsers = {
  role: TReference;
  users: TUser[];
};

export const getGroupedUsers = (users: TUser[]) => {
  return Object.values(
    users.reduce((result: Record<number, GroupedUsers>, user) => {
      if (!user.highestRole) return result; // should never happen
      if (!(user.highestRole.id in result)) {
        result[user.highestRole.id] = {
          role: user.highestRole,
          users: [],
        };
      }
      result[user.highestRole.id].users.push(user);
      return result;
    }, {})
  );
};
