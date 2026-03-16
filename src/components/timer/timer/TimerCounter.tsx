import HelpTooltip from "@/components/general/HelpTooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimer } from "@/utils/date";
import clsx from "clsx";
import { FocusEvent, useState } from "react";
import { useIntl } from "react-intl";
import useHotKey from "../../../hooks/useHotkey";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Input } from "../../ui/input";
import { useTimerContext } from "./TimerRoot";

export const TimerCounter = () => {
  const { formatMessage } = useIntl();

  const { timer, currentTime, isEditing, setIsEditing } = useTimerContext();

  if (isEditing) {
    return <EditTimer />;
  }

  return (
    <HelpTooltip message={formatMessage({ id: "issues.timer.action.edit.tooltip" })}>
      <span
        className={clsx("-my-1 max-w-30 shrink-0 truncate text-lg", currentTime > 0 ? "text-yellow-500" : "text-muted-foreground", timer.isActive && "font-bold")}
        onDoubleClick={() => setIsEditing(true)}
      >
        {formatTimer(currentTime)}
      </span>
    </HelpTooltip>
  );
};

export const EditTimer = () => {
  const { formatMessage } = useIntl();

  const { timer, currentTime, setIsEditing } = useTimerContext();

  const [h, setH] = useState(() => Math.floor(currentTime / 1000 / 60 / 60).toString());
  const [m, setM] = useState(() => to2Digit(Math.floor((currentTime / 1000 / 60) % 60)));
  const [s, setS] = useState(() => to2Digit(Math.floor((currentTime / 1000) % 60)));
  const updatedTime = (Number(h) * 60 * 60 + Number(m) * 60 + Number(s)) * 1000;

  const onOverrideTime = () => {
    setIsEditing(false);
    timer.setElapsedTime(updatedTime);
  };

  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const onCancel = () => setConfirmCancelModal(true);
  const onConfirmCancel = () => setIsEditing(false);

  useHotKey({ key: "Escape" }, onConfirmCancel);

  return (
    <>
      <div className="flex items-center gap-x-0">
        <Input
          type="number"
          value={h}
          min={0}
          className={clsx("h-8 appearance-none p-0 text-center", currentTime > 0 ? "text-yellow-500" : "text-muted-foreground", {
            "w-4": h.length === 1,
            "w-6": h.length === 2,
            "w-8": h.length >= 3,
          })}
          /**
           * auto focus & select input on focus
           */
          autoFocus
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const { value, min } = e.target;
            setH(Math.max(Number(min), Number(value)).toString());
          }}
          /**
           * On "Enter" => override time
           */
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOverrideTime();
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          /**
           * On loose focus, check if next target not a number input => cancel
           */
          onBlur={(e) => {
            if (!(e.relatedTarget?.localName === "input" && (e as FocusEvent<HTMLInputElement, HTMLInputElement>).relatedTarget?.type === "number")) onCancel();
          }}
        />
        :
        <Input
          type="number"
          value={m}
          min={0}
          max={59}
          className={clsx("h-8 w-6 appearance-none p-0 text-center", currentTime > 0 ? "text-yellow-500" : "text-muted-foreground")}
          onChange={(e) => {
            const { value, min, max } = e.target;
            setM(to2Digit(Math.max(Number(min), Math.min(Number(max), Number(value)))));
          }}
          /**
           * On "Enter" => override time
           */
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOverrideTime();
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          /**
           * On loose focus, check if next target not a number input => cancel
           */
          onBlur={(e) => {
            if (!(e.relatedTarget?.localName === "input" && (e as FocusEvent<HTMLInputElement, HTMLInputElement>).relatedTarget?.type === "number")) onCancel();
          }}
        />
        :
        <Input
          type="number"
          value={s}
          min={0}
          max={59}
          className={clsx("h-8 w-6 appearance-none p-0 text-center", currentTime > 0 ? "text-yellow-500" : "text-muted-foreground")}
          onChange={(e) => {
            const { value, min, max } = e.target;
            setS(to2Digit(Math.max(Number(min), Math.min(Number(max), Number(value)))));
          }}
          /**
           * On "Enter" => override time
           */
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOverrideTime();
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          /**
           * On loose focus, check if next target not a number input => cancel
           */
          onBlur={(e) => {
            if (!(e.relatedTarget?.localName === "input" && (e as FocusEvent<HTMLInputElement, HTMLInputElement>).relatedTarget?.type === "number")) onCancel();
          }}
        />
      </div>

      {confirmCancelModal && (
        <AlertDialog open onOpenChange={onConfirmCancel}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{formatMessage({ id: "issues.modal.save-changes.title" })}</AlertDialogTitle>
              <AlertDialogDescription>{formatMessage({ id: "issues.modal.save-changes.message" })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{formatMessage({ id: "issues.modal.save-changes.cancel" })}</AlertDialogCancel>
              <AlertDialogAction onClick={() => onOverrideTime()}>{formatMessage({ id: "issues.modal.save-changes.save" })}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

const to2Digit = (val: number) => {
  return `${val < 10 ? "0" : ""}${val}`;
};

export const TimerCounterSkeleton = () => {
  return <Skeleton className="h-5 w-16" />;
};
