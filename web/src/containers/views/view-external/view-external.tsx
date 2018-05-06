import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { ExternalScreen } from "models";
import { AppState } from "store/store";

import cx from "classnames";
import classes from "./view-external.module.scss";
import { useMemo } from "react";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ExternalScreen,
  (viewScreen) => ({ viewScreen })
);

// - -

const ViewExternal = () => {
  const { viewScreen } = useSelector(stateSelector);

  const shouldScaleExternalData = useMemo(
    () => viewScreen.shouldScaleExternalData ?? false,
    [viewScreen.shouldScaleExternalData]
  );

  return (
    <div className="w-full h-full p-[5%]">
      {viewScreen.externalData && (
        <div
          className={cx(
            "w-full h-full flex justify-center items-center expo-scrollbar",
            {
              [classes.externalContainer]: shouldScaleExternalData === false,
              [classes.externalContainerExpanded]:
                shouldScaleExternalData === true,
            }
          )}
          dangerouslySetInnerHTML={{ __html: viewScreen.externalData }}
        />
      )}
    </div>
  );
};

export default ViewExternal;
