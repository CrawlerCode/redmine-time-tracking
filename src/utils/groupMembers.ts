import { TProjectMember } from "../api/redmine/hooks/useRedmineProjectMembers";
import { TReference } from "../api/redmine/types";

type GroupedMembers = {
  role: TReference;
  users: TProjectMember[];
};

/**
 * Group members by their highest role
 */
export const groupMembers = (members: TProjectMember[]) =>
  Object.values(
    members.reduce<Record<string, GroupedMembers>>((result, member) => {
      if (!member.highestRole) return result; // should never happen
      if (!(member.highestRole.id in result)) {
        result[member.highestRole.id] = {
          role: member.highestRole,
          users: [],
        };
      }
      result[member.highestRole.id].users.push(member);
      return result;
    }, {})
  );
