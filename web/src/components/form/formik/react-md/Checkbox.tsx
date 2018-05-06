import { CSSProperties } from "react";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import { useField } from "formik";

/* https://mlaursen.github.io/react-md-v1-docs/#/components/selection-controls */

// - - - - - - - -

interface ReactMdCheckboxProps {
  name: string;
  label: string;
  id?: string;
  disabled?: string;
  className?: string;
  style?: CSSProperties;
}

const ReactMdCheckbox = ({
  name,
  label,
  id,
  disabled,
  className,
  style,
}: ReactMdCheckboxProps) => {
  // field contains { name, value, onChange, onBlur, .. }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helper] = useField<boolean>(name);

  return (
    <Checkbox
      // Field handling
      name={field.name}
      checked={field.value}
      onChange={(newValue: boolean, _e: any) => {
        helper.setValue(newValue);
        helper.setTouched(true);
      }}
      // onBlur
      // Rest
      label={label}
      id={id || name}
      disabled={disabled}
      className={className}
      style={style}
    />
  );
};

export default ReactMdCheckbox;
