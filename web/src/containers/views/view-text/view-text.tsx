import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import WysiwygPreview from "components/editors/WysiwygEditor/WysiwygPreview";

import { AppState } from "store/store";
import { TextScreen } from "models";

import cx from "classnames";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as TextScreen,
  (viewScreen) => ({ viewScreen })
);

// - -

export const ViewText = () => {
  const { viewScreen } = useSelector(stateSelector);

  const { t } = useTranslation("screen");
  const { fgTheming } = useExpoDesignData();

  return (
    <div className="w-full h-full px-[5%] sm:px-[10%] md:px-[20%] pt-[10%] pb-32">
      <div className="w-full h-full flex flex-col gap-6 overflow-y-auto pr-0 md:pr-6 expo-scrollbar">
        <div
          className={cx("text-[40px] text-bold mt-auto", {
            ...fgTheming,
          })}
        >
          {viewScreen.title ?? t("no-title")}
        </div>
        <div className="mb-auto">
          <WysiwygPreview
            htmlMarkup={viewScreen.mainText ?? ""}
            fontSize="xl"
          />
        </div>
      </div>
    </div>
  );
};
