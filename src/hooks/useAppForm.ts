import { CheckboxField } from "@//components/form/CheckboxField";
import { DateField } from "@//components/form/DateField";
import { ComboboxField } from "@/components/form/ComboboxField";
import { HoursField } from "@/components/form/HoursField";
import { SelectField } from "@/components/form/SelectField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { SwitchField } from "@/components/form/SwitchField";
import { TextField } from "@/components/form/TextField";
import { TextareaField } from "@/components/form/TextareaField";
import { ToggleGroupField } from "@/components/form/ToggleGroupField";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export { useFieldContext, useFormContext };

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
    SwitchField,
    DateField,
    ComboboxField,
    ToggleGroupField,
    HoursField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
