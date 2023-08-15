import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { isEmpty, forEach, get } from "lodash";

import Dialog from "./dialog-wrap";
import SelectField from "../form/redux-form/select-field";

import { getActiveUsers } from "../../actions/user-actions";
import { changeOwner, loadExpo } from "../../actions/expoActions";

const ExpoShareChangeOwner = ({ handleSubmit, activeExpo }) => {
  const options = [];
  forEach(activeExpo.collaborators, (c) => {
    if (get(c, "id")) {
      if (get(c, "collaborator.email"))
        options.push({ label: c.collaborator.email, value: c.id });
      else if (get(c, "userEmail"))
        options.push({ label: c.userEmail, value: c.id });
    }
  });

  return (
    <Dialog
      title="Změnit vlastníka výstavy"
      name="ExpoShareChangeOwner"
      handleSubmit={handleSubmit}
      submitLabel={!isEmpty(options) ? "Změnit" : "OK"}
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-share">
          {!isEmpty(options) ? (
            <Field
              component={SelectField}
              componentId="expo-share-change-owner-selectfield-username"
              label="Uživatelské jméno"
              name="collaborator"
              menuItems={options}
            />
          ) : (
            <p>Výstava není s nikým sdílena.</p>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default compose(
  connect(
    ({
      user: {
        users: { active },
      },
      expo: { activeExpo },
    }) => ({
      users: active,
      activeExpo,
    }),
    {
      getActiveUsers,
      loadExpo,
    }
  ),
  withRouter,
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      const { activeExpo, loadExpo } = props;

      if (!isEmpty(activeExpo.collaborators)) {
        if (!isEmpty(formData.collaborator)) {
          if (
            await dispatch(changeOwner(formData.collaborator, activeExpo.id))
          ) {
            loadExpo(activeExpo.id);
            dialog.closeDialog();
          } else
            throw new SubmissionError({
              collaborator: "*Vlastníka se nepodařilo změnit",
            });
        } else
          throw new SubmissionError({
            collaborator: "*Zadejte uživatele",
          });
      } else dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "expoShareChangeOwner",
  })
)(ExpoShareChangeOwner);
