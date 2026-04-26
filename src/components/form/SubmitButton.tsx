import { Loader2Icon } from "lucide-react";
import { ComponentProps } from "react";
import { useFormContext } from "../../hooks/useAppForm";
import { Button } from "../ui/button";

export const SubmitButton = ({ children = "Submit", ...props }: ComponentProps<typeof Button>) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => state.isSubmitting}
      // eslint-disable-next-line react/no-children-prop
      children={(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} {...props}>
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {children}
        </Button>
      )}
    />
  );
};
