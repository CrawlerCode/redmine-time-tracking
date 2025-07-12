import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";
import { cn } from "@/lib/utils";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfoIcon } from "lucide-react";
import { Label as LabelPrimitive, Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

function Form({ className, onSubmit, ...props }: React.ComponentProps<"form"> & { onSubmit: () => void | Promise<void> }) {
  return (
    <form
      className={cn("contents", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit();
      }}
      {...props}
    />
  );
}

function FormGrid({ className, cols = 1, ...props }: React.ComponentProps<"div"> & { cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }) {
  return (
    <div
      data-slot="form-grid"
      className={cn(
        "grid grid-cols-4 items-start gap-2 [&>*:not([class*='col-span-'])]:col-span-full",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-2": cols === 2,
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-5": cols === 5,
          "grid-cols-6": cols === 6,
          "grid-cols-7": cols === 7,
          "grid-cols-8": cols === 8,
        },
        className
      )}
      {...props}
    />
  );
}

function FormFieldset({ className, legend, children, ...props }: React.ComponentProps<"fieldset"> & { legend?: React.ReactNode }) {
  return (
    <fieldset data-slot="form-fieldset" className={cn("border-input rounded-md border p-2", className)} {...props}>
      {legend && <legend className="px-2 text-base font-semibold">{legend}</legend>}
      {children}
    </fieldset>
  );
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />;
}

function FormLabel({
  fieldState,
  required,
  className,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { fieldState?: ReturnType<typeof useFieldContext>["state"]; required?: boolean }) {
  if (!children) return null;

  return (
    <Label data-slot="form-label" data-error={!fieldState?.meta.isValid && fieldState?.meta.isTouched} className={cn("data-[error=true]:text-destructive", className)} {...props}>
      {required ? (
        <span>
          {children}
          {required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </span>
      ) : (
        children
      )}
    </Label>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof SlotPrimitive.Slot>) {
  return <SlotPrimitive.Slot data-slot="form-control" {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="form-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function FormMessage({
  fieldState,
  variant = "message",
  className,
  ...props
}: React.ComponentProps<"p"> & {
  variant?: "message" | "tooltip";
  fieldState: ReturnType<typeof useFieldContext>["state"];
}) {
  const body = !fieldState.meta.isValid && fieldState.meta.isTouched ? fieldState.meta.errors.map((error) => error.message).join(", ") : props.children;

  if (!body) {
    return null;
  }

  if (variant === "tooltip") {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <InfoIcon className="text-destructive size-3.5" />
        </TooltipTrigger>
        <TooltipContent className="max-w-64 text-wrap">
          <p data-slot="form-message" className={cn("text-sm", className)} {...props}>
            {body}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <p data-slot="form-message" className={cn("text-destructive text-sm", className)} {...props}>
      {body}
    </p>
  );
}

export { Form, FormControl, FormDescription, FormFieldset, FormGrid, FormItem, FormLabel, FormMessage };
