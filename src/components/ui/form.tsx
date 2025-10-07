import { cn } from "@/lib/utils";
import * as React from "react";

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

export { Form, FormFieldset, FormGrid };
