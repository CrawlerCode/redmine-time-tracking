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
        className={clsx("h-5 w-[80px] cursor-pointer appearance-none border-transparent", "focus:ring-primary-focus focus:ring-2 focus:outline-hidden")}
        style={{ background: `linear-gradient(90deg, #bae0ba ${state.value * 0.9 + 10}%, #eeeeee ${state.value * 0.9 + 10}%)` }}
      />
      <p className="pointer-events-none absolute top-1 left-1 text-xs leading-none font-medium text-gray-600 select-none">{state.value}%</p>
    </div>
  );
};

export { DoneSliderField };
