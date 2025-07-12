import { ComponentProps, useEffect, useId, useState } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { useSettings } from "../../provider/SettingsProvider";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export const HoursField = ({ title, className, ...props }: Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur">) => {
  const { settings } = useSettings();
  const { state, handleChange, handleBlur } = useFieldContext<number | null>();
  const id = useId();

  return (
    <FormItem className={className}>
      <FormLabel fieldState={state} htmlFor={id} required={props.required}>
        {title}
      </FormLabel>
      <FormControl>
        {settings.style.timeFormat === "decimal" ? (
          <Input
            {...props}
            id={id}
            value={typeof state.value === "number" ? state.value : ""}
            onChange={(e) => handleChange(isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber)}
            onBlur={handleBlur}
            type="number"
            min="0"
            step="0.01"
            className="appearance-none"
          />
        ) : (
          <TimeInput {...props} id={id} value={formatHoursToHmm(state.value)} onChange={(e) => handleChange(parseHmmToHours(e.target.value))} onBlur={handleBlur} className="appearance-none" />
        )}
      </FormControl>
      <FormMessage fieldState={state} />
    </FormItem>
  );
};

const TimeInput = ({ value, onChange, onBlur, ...props }: ComponentProps<typeof Input>) => {
  const [raw, setRaw] = useState("");

  useEffect(() => {
    setRaw(typeof value === "string" ? value : "");
  }, [value]);

  return (
    <Input
      {...props}
      type="string"
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={(e) => {
        const match = raw.match(/^\s*(\d+)[,:]?([0-5]?\d)?\s*$/);
        if (match) {
          e.target.value = `${Number(match[1])}:${Number(match[2] ?? 0)
            .toString()
            .padStart(2, "0")}`;
        } else {
          e.target.value = "";
        }
        setRaw(e.target.value);
        onBlur?.(e);
        onChange?.(e);
      }}
    />
  );
};

// Helper to format number of hours (float) to H:mm string
function formatHoursToHmm(hours: number | null): string {
  if (!hours || isNaN(hours)) hours = 0;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m.toString().padStart(2, "0")}`;
}

// Helper to parse H:mm string to number of hours (float)
function parseHmmToHours(value: string): number | null {
  const match = value?.match(/^(\d+):([0-5]?\d)$/);
  if (!match) return 0;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return h + m / 60;
}
