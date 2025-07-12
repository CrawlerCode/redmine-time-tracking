import { faArrowUpRightFromSquare, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentProps, useState } from "react";
import { useIntl } from "react-intl";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import { useSettings } from "../../provider/SettingsProvider";
import { TTimeEntry } from "../../types/redmine";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu";
import EditTimeEntryModal from "./EditTimeEntryModal";

type PropTypes = {
  entry: TTimeEntry;
  projectRoles: ReturnType<typeof useMyProjectRoles>;
} & ComponentProps<typeof ContextMenuTrigger>;

function TimeEntryContextMenu({ entry, projectRoles, children, ...props }: PropTypes) {
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
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            {formatMessage({ id: "time.time-entry.context-menu.open-in-redmine" })}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setEdit(true)} disabled={!projectRoles.hasProjectPermission(entry.project.id, "edit_own_time_entries")}>
            <FontAwesomeIcon icon={faPen} />
            {formatMessage({ id: "time.time-entry.context-menu.edit" })}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {edit && <EditTimeEntryModal entry={entry} onClose={() => setEdit(false)} onSuccess={() => setEdit(false)} />}
    </>
  );
}

export default TimeEntryContextMenu;
