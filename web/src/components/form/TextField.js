import React from "react";
import classNames from "classnames";
import TextField from "react-md/lib/TextFields";

const FormInput = props => {
  const {
    meta: { touched, error },
    input,
    label,
    type,
    disabled,
    maxLength,
    multiLine,
    componentId,
    suffix
  } = props;
  return (
    <div className="form-input">
      <TextField
        {...input}
        id={componentId || "expoInput"}
        name={input.name}
        label={label}
        type={type}
        lineDirection="center"
        disabled={disabled}
        maxLength={maxLength}
        rows={multiLine && 2}
        autoComplete="off"
      />
      <span
        className={classNames("form-input-suffix", {
          withErr: touched && error
        })}
      >
        {suffix}
      </span>
      {touched && error && <span className="invalid">{error}</span>}
    </div>
  );
};

export default FormInput;
