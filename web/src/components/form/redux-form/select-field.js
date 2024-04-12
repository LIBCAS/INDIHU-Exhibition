import SelectField from "react-md/lib/SelectFields";

const FormInput = (props) => {
  const {
    meta: { touched, error },
    input,
    label,
    className,
    menuItems,
    itemLabel,
    itemValue,
    position,
    placeholder,
    componentId,
  } = props;
  return (
    <div className="select-field">
      <SelectField
        {...input}
        id={componentId || "selectField"}
        label={label}
        className={className}
        menuItems={menuItems}
        itemLabel={itemLabel || "label"}
        itemValue={itemValue || "value"}
        position={position || "below"}
        placeholder={placeholder}
      />
      {touched && error && (
        <span className="invalid select-field-invalid">{error}</span>
      )}
    </div>
  );
};

export default FormInput;
