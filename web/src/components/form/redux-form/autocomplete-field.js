import Autocomplete from "react-md/lib/Autocompletes";

const emptyData = [{ label: "", value: "" }];

const AutocompleteField = (props) => {
  const {
    meta: { touched, error },
    input,
    label,
    dataLabel,
    dataValue,
    data,
    onAutocomplete,
    clearOnAutocomplete,
    componentId,
  } = props;
  return (
    <div>
      <Autocomplete
        {...input}
        id={componentId || "expoAutocomplete"}
        name={input.name}
        label={label}
        dataLabel={data ? dataLabel : "label"}
        dataValue={data ? dataValue : "value"}
        data={data || emptyData}
        onAutocomplete={onAutocomplete}
        clearOnAutocomplete={clearOnAutocomplete}
      />
      {touched && error && <span className="invalid">{error}</span>}
    </div>
  );
};

export default AutocompleteField;
