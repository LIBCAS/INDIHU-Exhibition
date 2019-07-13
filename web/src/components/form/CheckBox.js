import React from "react";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

const CheckBox = ({
  meta: { touched, error },
  input,
  label,
  change,
  componentId,
  onClick
}) => (
  <div>
    <Checkbox
      {...input}
      id={componentId || "formCheckbox"}
      name={input.name}
      label={label}
      checked={!!input.value}
      value={!!input.value}
      onChange={() => {
        change(input.name, !input.value);

        if (onClick) {
          onClick(!input.value);
        }
      }}
    />
    {touched && error && <span className="invalid">{error}</span>}
  </div>
);

export default CheckBox;
