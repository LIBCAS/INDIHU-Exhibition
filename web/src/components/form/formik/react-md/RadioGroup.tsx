import { CSSProperties } from "@mui/material/styles/createTypography";
import { SelectionControlGroup } from "react-md";
import { useField } from "formik";

/* https://mlaursen.github.io/react-md-v1-docs/#/components/selection-controls */

// - - - - - - - -

type RadioControlItem = {
  label: string;
  value: string;
};

interface ReactMdRadioGroupProps {
  controls: RadioControlItem[];
  name: string;
  label: string;
  id?: string; // if not supplied, name prop is used as identifier
  disabled?: boolean;
  inline?: boolean;
  className?: string;
  controlClassName?: string;
  labelClassName?: string;
  style?: CSSProperties;
  controlStyle?: CSSProperties;
}

const ReactMdRadioGroup = ({
  controls,
  name,
  label,
  id,
  disabled,
  inline,
  className,
  controlClassName,
  labelClassName,
  style,
  controlStyle,
}: ReactMdRadioGroupProps) => {
  // field contains { name, value, onChange, onBlur, .. }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helper] = useField<string>(name);

  return (
    <SelectionControlGroup
      controls={controls}
      // Field handling
      name={field.name}
      value={field.value} // required to correctly initialize in Formik initialValues
      onChange={(newRadioValue: string, _e: any) => {
        helper.setValue(newRadioValue);
      }}
      onBlur={(_e: any) => {
        helper.setTouched(true);
      }}
      // Rest
      type="radio"
      label={label}
      id={id || name}
      disabled={disabled}
      inline={inline}
      className={className}
      controlClassName={controlClassName}
      labelClassName={labelClassName}
      style={style}
      controlStyle={controlStyle}
    />
  );
};

export default ReactMdRadioGroup;
