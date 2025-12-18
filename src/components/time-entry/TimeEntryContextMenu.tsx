import { PencilIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";
import { useSettings } from "../../provider/SettingsProvider";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu";
import EditTimeEntryModal from "./EditTimeEntryModal";

type PropTypes = {
  entry: TTimeEntry;
  canEdit: boolean;
} & ComponentProps<typeof ContextMenuTrigger>;

function TimeEntryContextMenu({ entry, canEdit, children, ...props }: PropTypes) {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const [edit, setEdit] = useState<boolean>(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              window.open(`${settings.redmineURL}/time_entries/${entry.id}/edit`, "_blank");
            }}
          >
            <SquareArrowOutUpRightIcon />
            {formatMessage({ id: "time.time-entry.context-menu.open-in-redmine" })}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setEdit(true)} disabled={!canEdit}>
            <PencilIcon />
            {formatMessage({ id: "time.time-entry.context-menu.edit" })}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {edit && <EditTimeEntryModal entry={entry} onClose={() => setEdit(false)} onSuccess={() => setEdit(false)} />}
    </>
  );
}

export default TimeEntryContextMenu;
