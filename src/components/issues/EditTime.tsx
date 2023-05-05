import clsx from "clsx";
import { useState } from "react";
import useHotKey from "../../hooks/useHotkey";

type PropTypes = {
  initTime: number;
  onOverrideTime: (time: number) => void;
  onCancel: () => void;
};

const EditTime = ({ initTime, onOverrideTime, onCancel }: PropTypes) => {
  const [h, setH] = useState(Math.floor(initTime / 1000 / 60 / 60).toString());
  const [m, setM] = useState(to2Digit(Math.floor((initTime / 1000 / 60) % 60)));
  const [s, setS] = useState(to2Digit(Math.floor((initTime / 1000) % 60)));
  const updatedTime = (Number(h) * 60 * 60 + Number(m) * 60 + Number(s)) * 1000;

  /**
   * On "Escape" => cancel
   */
  useHotKey(onCancel, { key: "Escape" });

  return (
    <div className="flex items-center gap-x-0">
      <input
        type="number"
        value={h}
        min={0}
        max={100}
        className={clsx(
          "text-lg rounded-md w-4 text-center appearance-none",
          "bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400",
          "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600",
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
         * On loose focus, check if next target not a input => cancel
         */
        onBlur={(e) => {
          if (!(e.relatedTarget?.localName === "input")) onCancel();
        }}
      />
      :
      <input
        type="number"
        value={m}
        min={0}
        max={59}
        className={clsx(
          "text-lg rounded-md w-6 text-center appearance-none",
          "bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400",
          "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600",
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
      />
      :
      <input
        type="number"
        value={s}
        min={0}
        max={59}
        className={clsx(
          "text-lg rounded-md w-6 text-center appearance-none",
          "bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400",
          "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600",
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
         * On loose focus, check if next target not a input => cancel
         */
        onBlur={(e) => {
          if (!(e.relatedTarget?.localName === "input")) onCancel();
        }}
      />
    </div>
  );
};

const to2Digit = (val: number) => {
  return `${val < 10 ? "0" : ""}${val}`;
};

export default EditTime;
