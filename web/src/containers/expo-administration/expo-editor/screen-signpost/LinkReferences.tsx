import { useDispatch } from "react-redux";

import LinkItem from "./LinkItem";
import {
  HeaderTextField,
  SubheaderTextField,
  ReferenceTypeSelect,
} from "./Fields";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { SignpostScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import ScreenChooser from "./ScreenChooser";
import { useTranslation } from "react-i18next";

// - -

type LinkReferencesProps = {
  activeScreen: SignpostScreen;
};

const LinkReferences = ({ activeScreen }: LinkReferencesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.signpostScreen",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        {/* Selectfields */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-4">
            <div className="w-11/12 sm:w-2/5">
              <HeaderTextField activeScreen={activeScreen} />
            </div>
            <div className="w-11/12 sm:w-2/5">
              <SubheaderTextField activeScreen={activeScreen} />
            </div>
          </div>

          <div className="w-full flex justify-around items-center gap-4">
            <div className="w-2/5">
              <ReferenceTypeSelect activeScreen={activeScreen} />
            </div>
            <div className="w-2/5">
              <ScreenChooser
                label={t("nextScreenChooserLabel")}
                value={activeScreen.nextScreenReference ?? null}
                onChange={(newScreenId) =>
                  dispatch(
                    updateScreenData({
                      nextScreenReference: newScreenId,
                    })
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="mt-6 max-w-full flex flex-col gap-2">
          {activeScreen?.links?.map((currLink, currLinkIndex) => {
            const currLinkImageId = activeScreen?.links?.[currLinkIndex]?.image;
            const currLinkImage = dispatch(getFileById(currLinkImageId));

            const setCurrLinkImage = (image: IndihuFile) => {
              dispatch(
                updateScreenData({
                  links: activeScreen?.links?.map((l, lidx) =>
                    currLinkIndex === lidx ? { ...l, image: image.id } : l
                  ),
                })
              );
            };

            return (
              <LinkItem
                key={currLinkIndex}
                currLinkObj={currLink}
                currLinkIndex={currLinkIndex}
                activeScreen={activeScreen}
                currLinkImage={currLinkImage}
                setCurrLinkImage={setCurrLinkImage}
              />
            );
          })}
        </div>

        {/* New Link Button */}
        <div className="w-full flex justify-center items-center mt-6">
          <Button
            color="secondary"
            iconBefore={<Icon name="add" />}
            onClick={() => {
              dispatch(
                updateScreenData({
                  links: [...activeScreen.links, { reference: null }],
                })
              );
            }}
          >
            {t("addNewReferenceLabel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkReferences;
