import { ComponentProps } from "react";
import { useIntl } from "react-intl";
import { useFieldContext } from "../../hooks/useAppForm";
import { useSettings } from "../../provider/SettingsProvider";
import { formatHoursUsually } from "../../utils/date";
import TextInput from "../general/TextInput";
import TimeInput from "../general/TimeInput";

export const HoursField = (props: Omit<ComponentProps<typeof TextInput> | ComponentProps<typeof TimeInput>, "value" | "onChange" | "onBlur">) => {
  const { settings } = useSettings();
  const { formatMessage } = useIntl();

  const { state, handleChange, handleBlur } = useFieldContext<number | null>();

  if (settings.style.timeFormat === "decimal") {
    return (
      <TextInput
        {...(props as ComponentProps<typeof TextInput>)}
        type="number"
        min="0"
        step="0.01"
        inputClassName="appearance-none"
        extraText={
          state.value && !isNaN(state.value) && state.value > 0 && state.value <= 1000
            ? formatMessage(
                { id: "format.hours" },
                {
                  hours: formatHoursUsually(state.value),
                }
              )
            : undefined
        }
        value={state.value ?? undefined}
        onChange={(e) => handleChange(isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber)}
        onBlur={handleBlur}
        error={!state.meta.isValid && state.meta.isTouched ? state.meta.errors.map((error) => error.message).join(", ") : undefined}
      />
    );
  } else {
    return (
      <TimeInput
        {...(props as ComponentProps<typeof TimeInput>)}
        type="number"
        value={state.value ?? undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e) => handleChange(e.target.value as any)}
        onBlur={handleBlur}
        error={!state.meta.isValid && state.meta.isTouched ? state.meta.errors.map((error) => error.message).join(", ") : undefined}
      />
    );
  }
};
