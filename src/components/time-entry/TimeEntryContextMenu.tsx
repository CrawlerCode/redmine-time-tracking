import { usePermissions } from "@/provider/PermissionsProvider";
import { PencilIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { ReactElement, useState } from "react";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";
import { useSettings } from "../../provider/SettingsProvider";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu";
import EditTimeEntryModal from "./EditTimeEntryModal";

type PropTypes = {
  entry: TTimeEntry;
};

export const TimeEntryContextMenu = ({ children, ...props }: PropTypes & { children: ReactElement }) => {
  const [edit, setEdit] = useState<boolean>(false);
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger render={children} />
        <ContextMenuContent>
          <TimeEntryContextMenuItems {...props} onEdit={() => setEdit(true)} />
        </ContextMenuContent>
      </ContextMenu>
      {edit && <EditTimeEntryModal entry={props.entry} onClose={() => setEdit(false)} onSuccess={() => setEdit(false)} />}
    </>
  );
};

const TimeEntryContextMenuItems = ({ entry, onEdit }: PropTypes & { onEdit: () => void }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const { hasProjectPermission } = usePermissions();
  const canEdit = hasProjectPermission(entry.project.id, "edit_own_time_entries");

  return (
    <>
      <ContextMenuItem
        onClick={() => {
          window.open(`${settings.redmineURL}/time_entries/${entry.id}/edit`, "_blank");
        }}
      >
        <SquareArrowOutUpRightIcon />
        {formatMessage({ id: "time.time-entry.context-menu.open-in-redmine" })}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onEdit} disabled={!canEdit}>
        <PencilIcon />
        {formatMessage({ id: "time.time-entry.context-menu.edit" })}
      </ContextMenuItem>
    </>
  );
};
