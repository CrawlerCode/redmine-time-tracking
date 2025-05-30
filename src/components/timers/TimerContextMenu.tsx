import { faPause, faPen, faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { TimerController } from "../../hooks/useTimers";
import ContextMenu from "../general/ContextMenu";

type PropTypes = {
  timer: TimerController;
  children: ReactNode;
  onEdit: () => void;
};

const TimerContextMenu = ({ timer, children, onEdit }: PropTypes) => {
  const { formatMessage } = useIntl();

  return (
    <ContextMenu
      menu={[
        {
          name: formatMessage({ id: timer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" }),
          icon: <FontAwesomeIcon icon={timer.isActive ? faPause : faPlay} />,
          onClick: timer.isActive ? timer.pauseTimer : timer.startTimer,
        },
        {
          name: formatMessage({ id: "timer.context-menu.edit" }),
          icon: <FontAwesomeIcon icon={faPen} />,
          onClick: onEdit,
        },
        {
          name: formatMessage({ id: "timer.context-menu.reset" }),
          icon: <FontAwesomeIcon icon={faStop} />,
          onClick: timer.resetTimer,
          disabled: timer.getElapsedTime() === 0,
        },
        {
          name: formatMessage({ id: "timer.context-menu.delete" }),
          icon: <FontAwesomeIcon icon={faTrash} />,
          onClick: timer.deleteTimer,
        },
      ]}
    >
      {children}
    </ContextMenu>
  );
};

export default TimerContextMenu;
