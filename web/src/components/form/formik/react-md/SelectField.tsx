import { CSSProperties } from "react";
import SelectField from "react-md/lib/SelectFields";
import { useField } from "formik";

/* https://mlaursen.github.io/react-md-v1-docs/#/components/select-fields */

// - - - - - - - -

type SelectControlItem = {
  label: string;
  value: string | number;
};

interface ReactMdSelectFieldProps {
  controls: SelectControlItem[];
  name: string;
  label: string;
  id?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string; // when no value is selected!
  position?: "tl" | "tr" | "bl" | "br" | "below";
  helpText?: string;
  helpOnFocus?: boolean;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  listStyle?: CSSProperties;
}

const ReactMdSelectField = ({
  controls,
  name,
  label,
  id,
  disabled,
  fullWidth,
  placeholder,
  position = "below",
  helpText,
  helpOnFocus,
  className,
  inputClassName,
  listClassName,
  style,
  inputStyle,
  listStyle,
}: ReactMdSelectFieldProps) => {
  // field contains { name, value, onChange, onBlur, .. }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta, helper] = useField<string>(name);

  return (
    <SelectField
      menuItems={controls}
      itemLabel={"label"}
      itemValue={"value"}
      // Field handling
      name={field.name}
      value={field.value}
      onChange={(newValue: string, _index: number, _e: any) => {
        helper.setValue(newValue);
      }}
      onBlur={(_e: any) => {
        helper.setTouched(true);
      }}
      // Error handling
      error={meta.touched && !!meta.error}
      errorText={meta.error}
      // Rest
      label={label}
      id={id || name}
      disabled={disabled}
      fullWidth={fullWidth}
      position={position}
      placeholder={placeholder}
      helpText={helpText}
      helpOnFocus={helpOnFocus}
      className={className}
      inputClassName={inputClassName}
      listClassName={listClassName}
      style={style}
      inputStyle={inputStyle}
      listStyle={{ position: "static", ...listStyle }}
    />
  );
};

export default ReactMdSelectField;
