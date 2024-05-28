import clsx from "clsx";
import { FocusEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import Button from "../general/Button";
import Modal from "../general/Modal";

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
  /**
   * On "Escape" => cancel
   */
  useHotKey(onConfirmCancel, { key: "Escape" });

  return (
    <>
      <div className="flex items-center gap-x-0">
        <input
          type="number"
          value={h}
          min={0}
          max={100}
          className={clsx(
            "w-4 appearance-none rounded-md text-center text-lg",
            "placeholder:text-field-placeholder border border-field-border bg-field",
            "focus:outline-none focus:ring-2 focus:ring-primary-focus",
            initTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500"
          )}
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
        <input
          type="number"
          value={m}
          min={0}
          max={59}
          className={clsx(
            "w-6 appearance-none rounded-md text-center text-lg",
            "placeholder:text-field-placeholder border border-field-border bg-field",
            "focus:outline-none focus:ring-2 focus:ring-primary-focus",
            initTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500"
          )}
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
        <input
          type="number"
          value={s}
          min={0}
          max={59}
          className={clsx(
            "w-6 appearance-none rounded-md text-center text-lg",
            "placeholder:text-field-placeholder border border-field-border bg-field",
            "focus:outline-none focus:ring-2 focus:ring-primary-focus",
            initTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500"
          )}
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
        <Modal title={formatMessage({ id: "issues.modal.save-changes.title" })} onClose={onConfirmCancel}>
          <p className="mb-5">
            <FormattedMessage id="issues.modal.save-changes.message" />
          </p>
          <div className="flex items-end justify-between">
            <Button size="sm" variant="outline" onClick={onConfirmCancel}>
              <FormattedMessage id="issues.modal.save-changes.cancel" />
            </Button>
            <Button size="sm" onClick={() => onOverrideTime(updatedTime)} autoFocus>
              <FormattedMessage id="issues.modal.save-changes.save" />
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

const to2Digit = (val: number) => {
  return `${val < 10 ? "0" : ""}${val}`;
};

export default EditTimer;
