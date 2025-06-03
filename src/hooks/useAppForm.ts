import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { CheckboxField } from "../components/form/CheckboxField";
import { DateField } from "../components/form/DateField";
import { HoursField } from "../components/form/HoursField";
import { SelectField } from "../components/form/SelectField";
import { SubmitButton } from "../components/form/SubmitButton";
import { SwitchField } from "../components/form/SwitchField";
import { TextField } from "../components/form/TextField";
import { TextareaField } from "../components/form/TextareaField";
import { ToggleField } from "../components/form/ToggleField";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export { useFieldContext, useFormContext };

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
    ToggleField,
    DateField,
    SwitchField,
    HoursField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
