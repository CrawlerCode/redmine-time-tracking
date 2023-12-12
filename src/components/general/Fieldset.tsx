import clsx from "clsx";
import React from "react";

interface PropTypes extends React.ComponentProps<"fieldset"> {
  legend?: string | React.ReactNode;
}

const Fieldset = ({ legend, className, children, ...props }: PropTypes) => {
  return (
    <fieldset className={clsx("rounded-lg border border-gray-200 p-1.5 dark:border-gray-700", className)} {...props}>
      {legend && <legend className="mb-[-0.125rem] px-2 text-base font-semibold">{legend}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;
