import Checkbox from "react-md/lib/SelectionControls/Checkbox";

const CheckBox = ({
  meta: { touched, error },
  input,
  label,
  customLabel,
  change,
  componentId,
  onClick,
}) => {
  const checkbox = (
    <Checkbox
      {...input}
      id={componentId || "formCheckbox"}
      name={input.name}
      label={label}
      checked={!!input.value}
      value={!!input.value}
      onChange={() => {
        if (change) {
          change(input.name, !input.value);
        } else {
          input.onChange(!input.value);
        }

        if (onClick) {
          onClick(!input.value);
        }
      }}
    />
  );

  return (
    <div>
      {customLabel ? (
        <div
          style={{ display: "flex", marginTop: "24px", alignItems: "center" }}
        >
          {checkbox}
          <div>{customLabel}</div>
        </div>
      ) : (
        customLabel
      )}
      {touched && error && <span className="invalid">{error}</span>}
    </div>
  );
};

export default CheckBox;
