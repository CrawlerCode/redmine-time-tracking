import clsx from "clsx";
import { FocusEvent, useState } from "react";
import { useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Input } from "../ui/input";

type PropTypes = {
  initTime: number;
  onOverrideTime: (time: number) => void;
  onCancel: () => void;
};

const EditTimer = ({ initTime, onOverrideTime, onCancel: onConfirmCancel }: PropTypes) => {
  const { formatMessage } = useIntl();

  const [h, setH] = useState(Math.floor(initTime / 1000 / 60 / 60).toString());
  const [m, setM] = useState(to2Digit(Math.floor((initTime / 1000 / 60) % 60)));
  const [s, setS] = useState(to2Digit(Math.floor((initTime / 1000) % 60)));
  const updatedTime = (Number(h) * 60 * 60 + Number(m) * 60 + Number(s)) * 1000;

  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const onCancel = () => setConfirmCancelModal(true);

  useHotKey({ key: "Escape" }, onConfirmCancel);

  return (
    <>
      <div className="flex items-center gap-x-0">
        <Input
          type="number"
          value={h}
          min={0}
          className={clsx("h-8 appearance-none p-0 text-center", initTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", {
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
            const { value, min, max } = e.target;
            setH(Math.max(Number(min), Math.min(Number(max), Number(value))).toString());
          }}
          /**
           * On "Enter" => override time
           */
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOverrideTime(updatedTime);
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
          className={clsx("h-8 w-6 appearance-none p-0 text-center", initTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500")}
          onChange={(e) => {
            const { value, min, max } = e.target;
            setM(to2Digit(Math.max(Number(min), Math.min(Number(max), Number(value)))));
          }}
          /**
           * On "Enter" => override time
           */
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOverrideTime(updatedTime);
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
          className={clsx("h-8 w-6 appearance-none p-0 text-center", initTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500")}
          onChange={(e) => {
            const { value, min, max } = e.target;
            setS(to2Digit(Math.max(Number(min), Math.min(Number(max), Number(value)))));
          }}
          /**
           * On "Enter" => override time
           */
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOverrideTime(updatedTime);
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
              <AlertDialogAction onClick={() => onOverrideTime(updatedTime)}>{formatMessage({ id: "issues.modal.save-changes.save" })}</AlertDialogAction>
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

export default EditTimer;
