import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Ref, useEffect, useImperativeHandle, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import { formatTimer, roundTimeNearestInterval } from "../../utils/date";
import Button from "../general/Button";
import Modal from "../general/Modal";
import EditTimer from "./EditTimer";

export type IssueTimerData = {
  active: boolean;
  start?: number;
  time: number;
};

export type TimerActions = {
  onStart: () => void;
  onPause: (time: number) => void;
  onReset: () => void;
  onOverrideTime: (time: number) => void;
  onDoneTimer: (time: number) => void;
};

type PropTypes = {
  issue: TIssue;
  data: IssueTimerData;
  ref: Ref<TimerRef>;
} & TimerActions;

export type TimerRef = {
  timer: number;
  isInEditMode: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  editTimer: () => void;
};

const IssueTimer = ({ issue, data: { active, time, start }, onStart, onPause, onReset, onOverrideTime, onDoneTimer, ref }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const [editMode, setEditMode] = useState(false);

  const [timer, setTimer] = useState(calcTime(time, start));

  useEffect(() => {
    setTimer(calcTime(time, start));
    if (active && start) {
      const timerInterval = setInterval(() => {
        setTimer(calcTime(time, start));
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [active, time, start]);

  useImperativeHandle(
    ref,
    () =>
      ({
        timer: timer,
        isInEditMode: editMode,
        startTimer: () => {
          onStart();
        },
        pauseTimer: () => {
          onPause(timer);
        },
        editTimer: () => {
          setEditMode(true);
        },
      }) satisfies TimerRef,
    [timer, editMode, onStart, onPause]
  );

  const [confirmResetModal, setConfirmResetModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-x-3">
        {(editMode && (
          <EditTimer
            initTime={timer}
            onOverrideTime={(time) => {
              onOverrideTime(time);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        )) || (
          <>
            {settings.style.showTooltips && (
              <Tooltip id={`tooltip-edit-timer-${issue.id}`} place="top" delayShow={700} content={formatMessage({ id: "issues.timer.action.edit.tooltip" })} className="italic" />
            )}
            <span
              className={clsx("text-lg", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", active && "font-bold")}
              onDoubleClick={() => setEditMode(true)}
              data-tooltip-id={`tooltip-edit-timer-${issue.id}`}
            >
              {formatTimer(timer)}
            </span>
          </>
        )}

        {!active ? (
          <>
            {settings.style.showTooltips && (
              <Tooltip id={`tooltip-start-timer-${issue.id}`} place="left" delayShow={700} className="italic">
                <FormattedMessage id="issues.timer.action.start.tooltip" />
              </Tooltip>
            )}
            <FontAwesomeIcon
              role="button"
              data-type="start-timer"
              icon={faPlay}
              size="2x"
              className="cursor-pointer text-green-500 focus:outline-none"
              onClick={onStart}
              data-tooltip-id={`tooltip-start-timer-${issue.id}`}
              tabIndex={-1}
            />
          </>
        ) : (
          <>
            {settings.style.showTooltips && (
              <Tooltip id={`tooltip-pause-timer-${issue.id}`} place="left" delayShow={700} className="italic">
                <FormattedMessage id="issues.timer.action.pause.tooltip" />
              </Tooltip>
            )}
            <FontAwesomeIcon
              role="button"
              data-type="pause-timer"
              icon={faPause}
              size="2x"
              className="cursor-pointer text-red-500 focus:outline-none"
              onClick={() => onPause(timer)}
              data-tooltip-id={`tooltip-pause-timer-${issue.id}`}
              tabIndex={-1}
            />
          </>
        )}

        {settings.style.showTooltips && (
          <Tooltip id={`tooltip-reset-timer-${issue.id}`} place="top" delayShow={700} content={formatMessage({ id: "issues.timer.action.reset.tooltip" })} className="italic" />
        )}
        <FontAwesomeIcon
          role="button"
          data-type="reset-timer"
          icon={faStop}
          size="2x"
          className="cursor-pointer text-red-500 focus:outline-none"
          onClick={() => setConfirmResetModal(true)}
          data-tooltip-id={`tooltip-reset-timer-${issue.id}`}
          tabIndex={-1}
        />

        {settings.style.showTooltips && (
          <Tooltip id={`tooltip-done-timer-${issue.id}`} place="bottom" delayShow={700} content={formatMessage({ id: "issues.timer.action.add-spent-time.tooltip" })} className="z-10 italic" />
        )}
        <FontAwesomeIcon
          role="button"
          data-type="done-timer"
          icon={faCircleCheck}
          size="2x"
          className="cursor-pointer text-green-600 focus:outline-none"
          onClick={() => onDoneTimer(settings.features.roundToNearestInterval ? roundTimeNearestInterval(timer, settings.features.roundingInterval) : timer)}
          data-tooltip-id={`tooltip-done-timer-${issue.id}`}
          tabIndex={-1}
        />
      </div>

      {confirmResetModal && (
        <Modal title={formatMessage({ id: "issues.modal.reset-timer.title" })} onClose={() => setConfirmResetModal(false)}>
          <p className="mb-5">
            <FormattedMessage id="issues.modal.reset-timer.message" />
          </p>
          <div className="flex items-end justify-between">
            <Button size="sm" variant="outline" onClick={() => setConfirmResetModal(false)}>
              <FormattedMessage id="issues.modal.reset-timer.cancel" />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setConfirmResetModal(false);
                onReset();
              }}
              autoFocus
            >
              <FormattedMessage id="issues.modal.reset-timer.reset" />
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssueTimer;
