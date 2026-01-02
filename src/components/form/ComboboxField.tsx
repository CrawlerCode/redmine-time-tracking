import clsx from "clsx";
import { CheckIcon, ChevronsUpDown, Loader2Icon, XIcon } from "lucide-react";
import { ReactNode, useId, useState } from "react";
import { useIntl } from "react-intl";
import { useFieldContext } from "../../hooks/useAppForm";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Option<Value> = { value: Value; label: string; icon?: ReactNode; disabled?: boolean };
type Group<Value> = { label: string; options: Option<Value>[] };

type ComboboxFieldProps<Value> = {
  mode?: "single" | "multiple";
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: Option<Value>[] | Group<Value>[];
  onOpen?: () => void;
  searchMessage?: string;
  noOptionsMessage?: string;
  isLoading?: boolean;
  className?: string;
};

export const ComboboxField = <Value extends string | number>({
  title,
  placeholder,
  required,
  disabled,
  mode = "single",
  options,
  onOpen,
  searchMessage,
  noOptionsMessage,
  isLoading,
  className,
}: ComboboxFieldProps<Value>) => {
  const { name, state, handleChange, handleBlur } = useFieldContext<null | Value | Value[]>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Popover
        modal
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) onOpen?.();
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            onBlur={handleBlur}
            aria-invalid={isInvalid}
            className={clsx("hover:text-foreground relative w-full justify-between truncate text-base font-normal", {
              "h-auto min-h-9 py-1.5": mode === "multiple",
              "ps-2!": mode === "multiple" && Array.isArray(state.value) && state.value.length > 0,
            })}
          >
            <SelectedValue mode={mode} value={state.value} options={options} placeholder={placeholder} className="truncate" handleChange={handleChange} />
            {isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : !required && (mode === "single" ? state.value : Array.isArray(state.value) && state.value.length > 0) ? (
              <>
                <ClearButton mode={mode} handleChange={handleChange} />
                <ChevronsUpDown className="opacity-0" />
              </>
            ) : (
              <ChevronsUpDown className="opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder={searchMessage ?? formatMessage({ id: "general.search" })} />
            <CommandList>
              <CommandEmpty>{noOptionsMessage ?? formatMessage({ id: "general.no-options" })}</CommandEmpty>
              {options?.map((option) =>
                typeof option === "object" && "options" in option ? (
                  <CommandGroup key={option.label} heading={option.label}>
                    {option.options.map((subOption) => (
                      <RenderOption
                        key={subOption.value}
                        mode={mode}
                        option={subOption}
                        value={state.value}
                        required={required}
                        disabled={subOption.disabled}
                        handleChange={(value) => {
                          handleChange(value);
                          if (mode === "single") setOpen(false);
                        }}
                      />
                    ))}
                  </CommandGroup>
                ) : (
                  <RenderOption
                    key={option.value}
                    mode={mode}
                    option={option}
                    value={state.value}
                    required={required}
                    disabled={option.disabled}
                    handleChange={(value) => {
                      handleChange(value);
                      if (mode === "single") setOpen(false);
                    }}
                  />
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};

const SelectedValue = <Value extends string | number>({
  mode = "single",
  value,
  options,
  placeholder = "Select option",
  handleChange,
  className,
}: Pick<ComboboxFieldProps<Value>, "mode" | "options" | "placeholder"> & { value: null | Value | Value[]; className?: string; handleChange: (value: null | Value | Value[]) => void }) => {
  const flattenedOptions = options.flatMap((option) => (typeof option === "object" && "options" in option ? option.options : option));

  if (mode === "single") {
    const selectedOption = flattenedOptions.find((option) => option.value === value);
    if (selectedOption) {
      return (
        <span className={clsx("flex items-center gap-2", className)}>
          {selectedOption.icon}
          {selectedOption.label}
        </span>
      );
    }
  } else if (mode === "multiple" && Array.isArray(value)) {
    const selectedOptions = flattenedOptions.filter((option) => value.includes(option.value));
    if (selectedOptions.length > 0) {
      return (
        <div className={clsx("flex flex-wrap gap-1", className)}>
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="outline"
              className="group flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleChange(value.filter((v) => v !== option.value));
              }}
            >
              {option.label}
              <XIcon className="text-muted-foreground group-hover:text-destructive size-2" />
            </Badge>
          ))}
        </div>
      );
    }
  }

  return <span className={clsx("text-muted-foreground", className)}>{placeholder}</span>;
};

const ClearButton = <Value extends string | number>({ mode, handleChange }: { mode: NonNullable<ComboboxFieldProps<Value>["mode"]>; handleChange: (value: null | Value | Value[]) => void }) => {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="text-muted-foreground hover:text-destructive absolute -end-0 top-1/2 mx-2 -translate-y-1/2 p-1 outline-none"
      onClick={(e) => {
        e.preventDefault();
        handleChange(mode === "single" ? null : []);
      }}
    >
      <XIcon />
    </button>
  );
};

const RenderOption = <Value extends string | number>({
  mode,
  option,
  value,
  required,
  disabled,
  handleChange,
}: {
  mode: NonNullable<ComboboxFieldProps<Value>["mode"]>;
  option: Option<Value>;
  value: null | Value | Value[];
  required?: boolean;
  disabled?: boolean;
  handleChange: (value: null | Value | Value[]) => void;
}) => {
  const isSelected = Array.isArray(value) ? value.includes(option.value) : value === option.value;

  return (
    <CommandItem
      value={option.label}
      onSelect={() => {
        if (mode === "single") {
          handleChange(isSelected && !required ? null : option.value);
        } else {
          const currentValue = Array.isArray(value) ? value : [];
          if (isSelected) {
            handleChange(currentValue.filter((v) => v !== option.value));
          } else {
            handleChange([...currentValue, option.value]);
          }
        }
      }}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      {mode === "multiple" && <Checkbox checked={isSelected} className="data-[state=checked]:[&_svg]:text-primary-foreground!" />}
      {option.icon}
      {option.label}
      {mode === "single" && <CheckIcon className={clsx("ml-auto", isSelected ? "opacity-100" : "opacity-0")} />}
    </CommandItem>
  );
};
