import { useMemo } from "react";
import { useField } from "formik";

import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

// - -

type TextFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  id?: string;
  size?: MuiTextFieldProps["size"];
  disabled?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
};

const TextField = ({
  name,
  label,
  type = "text",
  ...otherProps
}: TextFieldProps) => {
  // field contains { name, value, onChange, onBlur, .. }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  const [field, meta] = useField<string>(name);

  const isError = useMemo(
    () => meta.touched && !!meta.error,
    [meta.error, meta.touched]
  );

  return (
    <MuiTextField
      variant="standard"
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={isError}
      helperText={isError ? meta.error : otherProps.helperText}
      label={label}
      type={type}
      id={otherProps.id ?? name}
      size={otherProps.size}
      disabled={otherProps.disabled}
      placeholder={otherProps.placeholder}
      required={otherProps.required}
      fullWidth={otherProps.fullWidth}
      sx={{
        "& .MuiFormHelperText-root": {
          fontSize: "11px",
          textAlign: "start",
        },
        "& .MuiInput-root:after": {
          borderColor: "#083d77",
        },
        "& .MuiInputLabel-root": {
          fontFamily: "Inter, sans-serif",
          "&.Mui-focused": {
            color: "#083d77",
          },
        },
        "& .MuiInput-input": {
          fontFamily: "Inter, sans-serif",
        },
      }}
    />
  );
};

export default TextField;
