import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { ComponentProps, useEffect, useId, useState } from "react";
import { DateRange } from "react-day-picker";
import { useIntl } from "react-intl";
import { useFieldContext } from "../../hooks/useAppForm";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type DateFieldProps = Omit<ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect" | "onBlur" | "disabled"> & {
  mode?: Exclude<ComponentProps<typeof Calendar>["mode"], "default">;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disabledDates?: ComponentProps<typeof Calendar>["disabled"];
};

export const DateField = ({ title, disabled, placeholder, mode = "single", className, disabledDates, ...props }: DateFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<null | Date | Date[] | DateRange>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  const [open, setOpen] = useState(false);

  const { locale } = useIntl();
  const [calendarLocale, setCalendarLocale] = useState<ComponentProps<typeof Calendar>["locale"]>();
  useEffect(() => {
    import("react-day-picker/locale").then((locales) => {
      setCalendarLocale(locales[locale === "en" ? "enUS" : locale]);
    });
  }, [locale]);

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={props.required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn("hover:text-foreground relative w-full justify-start truncate text-left text-base font-normal", {
              "text-muted-foreground": !state.value,
            })}
            disabled={disabled}
            onBlur={handleBlur}
          >
            <DateValue mode={mode} value={state.value} placeholder={placeholder} />
            {!props.required && <ClearButton mode={mode} value={state.value} handleChange={handleChange} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode={mode}
            disabled={disabledDates}
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            selected={state.value as any}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelect={(date: any) => {
              handleChange(date);
              if (mode === "single") setOpen(false);
            }}
            locale={calendarLocale}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};

const DateValue = ({ mode, value, placeholder }: { mode: NonNullable<DateFieldProps["mode"]>; placeholder?: string; value: null | Date | Date[] | DateRange }) => {
  const { formatDate } = useIntl();

  if (mode === "single" && value && value instanceof Date) {
    return formatDate(value);
  } else if (mode === "multiple" && Array.isArray(value)) {
    return value.map((date) => formatDate(date)).join(", ");
  } else if (mode === "range" && typeof value === "object" && value && (value as DateRange).from && (value as DateRange).to) {
    return `${formatDate((value as DateRange).from)} - ${formatDate((value as DateRange).to)}`;
  }
  return placeholder || "";
};

const ClearButton = ({
  mode,
  value,
  handleChange,
}: {
  mode: NonNullable<DateFieldProps["mode"]>;
  value: null | Date | Date[] | DateRange;
  handleChange: (value: null | Date | Date[] | DateRange) => void;
}) => {
  switch (mode) {
    case "single":
      if (!value) return null;
      break;
    case "multiple":
      if (!Array.isArray(value) || value.length === 0) return null;
      break;
    case "range":
      if (typeof value !== "object" || !value || !("from" in value) || !("to" in value)) return null;
      break;
  }

  return (
    <button
      type="button"
      tabIndex={-1}
      className="text-muted-foreground hover:text-destructive absolute -end-0 top-1/2 mx-2 -translate-y-1/2 p-1 outline-none"
      onClick={(e) => {
        e.preventDefault();
        handleChange(mode === "multiple" ? [] : null);
      }}
    >
      <XIcon />
    </button>
  );
};
