import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Components
import { Container } from "@mui/material";
import ExpoStateRadioOptions from "./ExpoStateRadioOptions";
import ExpoUrlChangeField from "./ExpoUrlChangeField";
import EmbedCodeField from "./EmbedCodeField";
import TagsSelect from "./tags/TagsSelect";
import ClosedExpoSettings from "./ClosedExpoSettings";
import CollaboratorsTable from "./CollaboratorsTable";

// Models
import { ActiveExpo } from "models";
import { AppState } from "store/store";

// Utils and actions
import { isEmpty } from "lodash";
import { isAdmin } from "utils";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.info,
  ({ user }: AppState) => user.role,
  (userInfo, userRole) => ({ userInfo: userInfo, userRole: userRole })
);

// - -

type ExpoSettingsProps = {
  activeExpo: ActiveExpo;
};

const ExpoSettings = ({ activeExpo }: ExpoSettingsProps) => {
  const { t } = useTranslation("expo");
  const { userInfo, userRole } = useSelector(stateSelector);
  const isCurrentUserAuthor = activeExpo.author.id === userInfo.id;
  const isCurrentUserAdmin = isAdmin(userRole);

  if (isEmpty(activeExpo)) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <div className="pt-36 pb-16 flex flex-col gap-6">
        {/* Expo State Radio Options */}
        <div className="w-fit flex flex-col gap-2">
          <div className="font-bold text-lg">
            {t("settingsAndSharing.expoState")}
          </div>
          <div>
            <ExpoStateRadioOptions activeExpo={activeExpo} />
          </div>
        </div>

        {/* URL change */}
        <div className="w-fit flex flex-col gap-2">
          <div className="font-bold text-lg">
            {t("settingsAndSharing.expoUrl")}
          </div>
          {activeExpo && activeExpo?.url && (
            <div>
              <ExpoUrlChangeField expoUrl={activeExpo.url} />
            </div>
          )}
        </div>

        {/* Exhibition Embed code */}
        <div className="w-fit flex flex-col gap-2">
          <div className="font-bold text-lg">
            {t("settingsAndSharing.expoEmbedCode")}
          </div>
          {activeExpo && activeExpo?.url && (
            <div className="mt-1">
              <EmbedCodeField expoUrl={activeExpo.url} />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="max-w-[600px] flex flex-col gap-2">
          <div className="font-bold text-lg">
            {t("settingsAndSharing.expoTags")}
          </div>
          <div>
            <TagsSelect activeExpo={activeExpo} />
          </div>
        </div>

        {/* Closed Expo Information */}
        <div className="max-w-[600px] flex flex-col gap-2">
          <div className="font-bold text-lg">
            {t("settingsAndSharing.expoEndedInfo.info")}
          </div>
          <div>
            <ClosedExpoSettings activeExpo={activeExpo} />
          </div>
        </div>

        {/* Collaborators table */}
        <div className="flex flex-col gap-2">
          <div className="font-bold text-lg">
            {t("settingsAndSharing.shareWithUsers")}
          </div>
          <div>
            <CollaboratorsTable
              collaborators={activeExpo.collaborators}
              author={activeExpo.author}
              isCurrentUserAuthor={isCurrentUserAuthor}
              isCurrentUserAdmin={isCurrentUserAdmin}
              expoId={activeExpo.id}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ExpoSettings;
