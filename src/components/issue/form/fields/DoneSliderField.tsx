import clsx from "clsx";
import { ComponentProps } from "react";
import { useFieldContext } from "../../../../hooks/useAppForm";

const DoneSliderField = ({ className, ...props }: Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "onBlur" | "min" | "max" | "step">) => {
  const { state, handleChange, handleBlur } = useFieldContext<number>();

  return (
    <div className={clsx("relative", className)}>
      <input
        {...props}
        value={state.value}
        onChange={(e) => handleChange(e.target.valueAsNumber)}
        onBlur={handleBlur}
        min="0"
        max="100"
        step="10"
        type="range"
        className={clsx("h-5 w-[80px] cursor-pointer appearance-none border-transparent", "focus:outline-none focus:ring-2 focus:ring-primary-focus")}
        style={{ background: `linear-gradient(90deg, #bae0ba ${state.value * 0.9 + 10}%, #eeeeee ${state.value * 0.9 + 10}%)` }}
      />
      <p className="pointer-events-none absolute left-1 top-1 select-none text-xs font-medium leading-none text-gray-600">{state.value}%</p>
    </div>
  );
};

export { DoneSliderField };
