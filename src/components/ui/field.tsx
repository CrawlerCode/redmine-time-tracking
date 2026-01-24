import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps, useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AsteriskIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={cn("flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3", className)} {...props} />;
}

function FieldLegend({ className, variant = "legend", ...props }: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return <legend data-slot="field-legend" data-variant={variant} className={cn("mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base", className)} {...props} />;
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4", className)}
      {...props}
    />
  );
}

const fieldVariants = cva("data-[invalid=true]:text-destructive gap-2 group/field flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal: "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function Field({ className, orientation = "vertical", ...props }: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return <div role="group" data-slot="field" data-orientation={orientation} className={cn(fieldVariants({ orientation }), className)} {...props} />;
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("group/field-content flex flex-1 flex-col gap-0.5 leading-snug", className)} {...props} />;
}

function FieldLabel({ className, required, children, errors, ...props }: React.ComponentProps<typeof Label> & { required?: boolean } & Pick<ComponentProps<typeof FieldError>, "errors">) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "has-data-checked:bg-primary/5 has-data-checked:border-primary dark:has-data-checked:bg-primary/10 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-2.5",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    >
      {required ? (
        <span className="inline-flex gap-0.5">
          {children}
          {required && <AsteriskIcon className="size-3.5 text-red-600" />}
        </span>
      ) : (
        children
      )}
      {errors && errors.length && <FieldError variant="tooltip" errors={errors} />}
    </Label>
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-label" className={cn("flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50", className)} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-left text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div data-slot="field-separator" data-content={!!children} className={cn("relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2", className)} {...props}>
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span className="text-muted-foreground bg-background relative mx-auto block w-fit px-2" data-slot="field-separator-content">
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  variant = "message",
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
  variant?: "message" | "tooltip";
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return <ul className="ml-2 flex flex-col gap-1">{uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}</ul>;
  }, [children, errors]);

  if (!content) {
    return null;
  }

  if (variant === "tooltip") {
    return (
      <Tooltip delay={0}>
        <TooltipTrigger render={<InfoIcon className="text-destructive size-3.5 shrink-0" />} />
        <TooltipContent className="max-w-64 text-wrap">
          <div role="alert" data-slot="field-error" className={cn("text-sm", className)} {...props}>
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div role="alert" data-slot="field-error" className={cn("text-destructive text-sm font-normal", className)} {...props}>
      {content}
    </div>
  );
}

function FieldInfo({ className, children, ...props }: React.ComponentProps<typeof InfoIcon>) {
  return (
    <Tooltip delay={0}>
      <TooltipTrigger render={<InfoIcon className={cn("text-muted-foreground size-3.5", className)} {...props} />} />
      <TooltipContent className="max-w-64 text-wrap">{children}</TooltipContent>
    </Tooltip>
  );
}

export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldInfo, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle };
