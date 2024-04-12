import { CSSProperties } from "react";
import TextField from "react-md/lib/TextFields";
import { useField } from "formik";

/* https://mlaursen.github.io/react-md-v1-docs/#/components/text-fields?tab=1 */

// - - - - - - - -

interface ReactMdTextFieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number"; // default is text
  parseAsFloat?: boolean;
  id?: string; // if not supplied, name prop is used as identifier
  disabled?: boolean;
  maxLength?: number; // needs to be validated by Formik, this will only add the counter, automatic error state is manually set
  multiLine?: boolean;
  helpText?: string;
  helpOnFocus?: boolean; // if not provided, helpText always visible
  className?: string;
  inputClassName?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

const ReactMdTextField = ({
  name,
  label,
  type = "text",
  parseAsFloat,
  id,
  disabled,
  maxLength,
  multiLine,
  helpText,
  helpOnFocus,
  className,
  inputClassName,
  style,
  inputStyle,
}: ReactMdTextFieldProps) => {
  // field contains { name, value, onChange, onBlur, .. }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta, helper] = useField<string | number>(name);

  return (
    <>
      <TextField
        // Field handling
        name={field.name}
        value={field.value}
        onChange={(newValue: string, _e: any) => {
          // TextField from ReactMd always gives the string, even when type number is set
          if (type === "number") {
            const parsedNewValue = parseAsFloat
              ? parseFloat(newValue)
              : parseInt(newValue);

            helper.setValue(parsedNewValue);
            return;
          }
          helper.setValue(newValue);
        }}
        onBlur={(_e: any) => {
          helper.setTouched(true);
        }}
        // Error handling
        error={meta.touched && !!meta.error}
        errorText={meta.error}
        // Rest
        id={id || name}
        type={type}
        label={label}
        disabled={disabled}
        maxLength={maxLength}
        rows={multiLine ? 2 : undefined}
        lineDirection="center"
        autoComplete="off"
        helpText={helpText}
        helpOnFocus={helpOnFocus}
        className={className} // text field's container
        inputClassName={inputClassName}
        style={style}
        inputStyle={inputStyle}
      />
    </>
  );
};

export default ReactMdTextField;
