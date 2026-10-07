import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const TimerButtonWrapper = ({ className, children, ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("flex shrink-0 items-center gap-0.5", className)}>
      {children}
    </div>
  );
};
