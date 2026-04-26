import { Field } from "@/components/ui/field";
import clsx from "clsx";
import { ComponentProps } from "react";
import { useFieldContext } from "../../../../hooks/useAppForm";

const DoneSliderField = ({ className, ...props }: Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "onBlur" | "min" | "max" | "step">) => {
  const { state, handleChange, handleBlur } = useFieldContext<number>();

  return (
    <Field className={className}>
      <div className="relative mt-1">
        <input
          {...props}
          value={state.value}
          onChange={(e) => handleChange(e.target.valueAsNumber)}
          onBlur={handleBlur}
          min="0"
          max="100"
          step="10"
          type="range"
          className={clsx(
            "h-5 w-20 cursor-pointer appearance-none overflow-hidden rounded-sm border-transparent",
            "to-muted bg-linear-90 from-green-600/80 dark:from-green-600/60",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          )}
          style={
            {
              "--tw-gradient-from-position": `${state.value * 0.9 + 10}%`,
              "--tw-gradient-to-position": `${state.value * 0.9 + 10}%`,
            } as React.CSSProperties
          }
        />
        <p className="text-foreground pointer-events-none absolute top-1 left-1 text-xs leading-none font-medium select-none">{state.value}%</p>
      </div>
    </Field>
  );
};

export { DoneSliderField };
