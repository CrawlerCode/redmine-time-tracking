import { ComponentProps } from "react";
import { useFormContext } from "../../hooks/useAppForm";
import Button from "../general/Button";

export const SubmitButton = ({ children = "Submit", ...props }: ComponentProps<typeof Button>) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => !state.isSubmitting}
      // eslint-disable-next-line react/no-children-prop
      children={(enabled) => (
        <Button type="submit" disabled={!enabled} {...props}>
          {children}
        </Button>
      )}
    />
  );
};
