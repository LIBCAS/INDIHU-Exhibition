import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { FontIcon, Button, TextField as TextFieldMd } from "react-md";
import { get } from "lodash";

import TextField from "../../form/text-field";
import HelpIcon from "../../help-icon";

import { updateExpo } from "../../../actions/expoActions";
import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { helpIconText } from "../../../enums/text";

const ClosedExpo = ({
  handleSubmit,
  closedPicture,
  setClosedPicture,
  setDialog,
}) => (
  <div {...{ className: "closed-expo" }}>
    <p className="title">
      Informace návštěvníkovi v případě, že je výstava již ukončená
    </p>
    <form onSubmit={handleSubmit}>
      <div className="flex-row-nowrap flex-centered">
        <TextFieldMd
          id="closed-expo-image"
          label="Obrázek na pozadí"
          value={closedPicture ? closedPicture.name : ""}
          disabled
        />
        <div className="flex-row-nowrap flex-centered">
          {closedPicture && (
            <FontIcon
              className="icon"
              onClick={() =>
                setDialog("ConfirmDialog", {
                  title: <FontIcon className="color-black">delete</FontIcon>,
                  text: "Opravdu chcete odstranit obrázek?",
                  onSubmit: () => setClosedPicture(null),
                })
              }
            >
              delete
            </FontIcon>
          )}
          <Button
            raised
            label="vybrat"
            onClick={() =>
              setDialog("ScreenFileChoose", {
                onChoose: setClosedPicture,
                typeMatch: new RegExp(/^image\/.*$/),
                accept: "image/*",
              })
            }
          />
        </div>
        <HelpIcon
          {...{
            label: helpIconText.EXPO_SETTINGS_CLOSED_EXPO_IMAGE,
            id: "expo-settings-closed-expo-image",
            place: "left",
          }}
        />
      </div>
      <div className="flex-row-nowrap flex-centered">
        <Field
          component={TextField}
          componentId="closed-expo-url"
          label="Url pro přesměrování"
          name="closedUrl"
        />
        <HelpIcon
          {...{
            label: helpIconText.EXPO_SETTINGS_CLOSED_EXPO_URL,
            id: "expo-settings-closed-expo-url",
            place: "left",
          }}
        />
      </div>
      <div className="flex-row-nowrap flex-centered">
        <Field
          component={TextField}
          componentId="closed-expo-caption"
          label="Oznámení návštěvníkovi"
          name="closedCaption"
          maxLength={200}
          multiLine
        />
        <HelpIcon
          {...{
            label: helpIconText.EXPO_SETTINGS_CLOSED_EXPO_CAPTION,
            id: "expo-settings-closed-expo-caption",
            place: "left",
          }}
        />
      </div>
      <div className="flex-row flex-right padding-bottom-small">
        <Button raised label="Uložit" type="submit" />
      </div>
    </form>
  </div>
);

export default compose(
  connect(null, { updateExpo, setDialog, getFileById }),
  withState("closedPicture", "setClosedPicture", null),
  withHandlers({
    onSubmit:
      ({ activeExpo, updateExpo, closedPicture }) =>
      async ({ closedUrl, closedCaption }) => {
        if (
          !(await updateExpo({
            ...activeExpo,
            closedPicture: get(closedPicture, "id", null),
            closedUrl,
            closedCaption,
          }))
        ) {
          throw new SubmissionError({
            closedCaption: "Nepodařilo se uložit změny.",
          });
        }
      },
  }),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { activeExpo, setClosedPicture, getFileById } = this.props;

      const file = get(activeExpo, "closedPicture")
        ? getFileById(get(activeExpo, "closedPicture"))
        : null;

      if (file) {
        setClosedPicture(file);
      }
    },
  }),
  reduxForm({
    form: "ClosedExpo",
    enableReinitialize: true,
  })
)(ClosedExpo);
