import { faArrowUpRightFromSquare, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentProps, useState } from "react";
import { useIntl } from "react-intl";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useSettings from "../../hooks/useSettings";
import { TTimeEntry } from "../../types/redmine";
import ContextMenu from "../general/ContextMenu";
import EditTimeEntryModal from "./EditTimeEntryModal";

type PropTypes = {
  entry: TTimeEntry;
  projectRoles: ReturnType<typeof useMyProjectRoles>;
} & Omit<ComponentProps<typeof ContextMenu>, "menu">;

function TimeEntryContextMenu({ entry, projectRoles, children, ...props }: PropTypes) {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const [edit, setEdit] = useState<boolean>(false);

  return (
    <>
      <ContextMenu
        {...props}
        menu={[
          [
            {
              name: formatMessage({ id: "time.time-entry.context-menu.open-in-redmine" }),
              icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} />,
              onClick: () => {
                window.open(`${settings.redmineURL}/time_entries/${entry.id}/edit`, "_blank");
              },
            },
          ],
          [
            {
              name: formatMessage({ id: "time.time-entry.context-menu.edit" }),
              icon: <FontAwesomeIcon icon={faPen} />,
              disabled: !projectRoles.hasProjectPermission(entry.project, "edit_own_time_entries"),
              onClick: () => setEdit(true),
            },
          ],
        ]}
      >
        {children}
      </ContextMenu>
      {edit && <EditTimeEntryModal entry={entry} onClose={() => setEdit(false)} onSuccess={() => setEdit(false)} />}
    </>
  );
}

export default TimeEntryContextMenu;
