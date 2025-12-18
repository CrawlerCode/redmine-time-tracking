import { TReference } from "../api/redmine/types";
import { TUser } from "../hooks/useProjectUsers";

type GroupedUsers = {
  role: TReference;
  users: TUser[];
};

/**
 * Group users by their highest role
 */
export const groupUsers = (users: TUser[]) =>
  Object.values(
    users.reduce<Record<string, GroupedUsers>>((result, user) => {
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
