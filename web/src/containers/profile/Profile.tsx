import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Components
import AppHeader from "components/app-header/AppHeader";
import UserInfoChange from "./UserInfoChange";
import PasswordChange from "./PasswordChange";

import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import Divider from "react-md/lib/Dividers";

// Models
import { AppState, AppDispatch } from "store/store";
import { UserInfoObj } from "reducers/user-reducer";

// Utils and actions
import { isEmpty } from "lodash";
import { getCurrentUser } from "actions/user-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.info,
  (userInfo) => ({ userInfo })
);

// - -

type ProfileProps = {
  isAdmin: boolean;
};

const Profile = ({ isAdmin }: ProfileProps) => {
  const { userInfo } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("profile");

  useEffect(() => {
    dispatch(getCurrentUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AppHeader profileStyle />

      {!isEmpty(userInfo) && (
        <div className="container edit-profile">
          <div className="flex-row flex-centered">
            <h2>{t("title")}</h2>
            <div />
          </div>

          <div className="flex-form">
            <h3 className="margin-none" style={{ fontSize: 18 }}>
              {t("editProfileSubtitle")}
            </h3>
          </div>
          <UserInfoChange
            userInfo={userInfo as UserInfoObj}
            isAdmin={isAdmin}
          />

          <div className="flex-form margin-top">
            <h3 className="margin-none" style={{ fontSize: 18 }}>
              {t("changePasswordSubtitle")}
            </h3>
          </div>
          <PasswordChange userInfo={userInfo as UserInfoObj} />

          <div className="flex-form margin-top padding-bottom">
            <Divider />
            <div className="flex-row flex-centered margin-top">
              <Button
                primary
                flat
                label={t("deleteAccountActionButtonLabel")}
                className="edit-profile-button"
                onClick={() =>
                  dispatch(setDialog(DialogType.DeleteAccount, {}))
                }
              >
                <FontIcon className="color-black">delete</FontIcon>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
