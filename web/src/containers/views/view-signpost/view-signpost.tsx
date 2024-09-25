import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import ReferenceItem from "./ReferenceItem";

import { ScreenProps, SignpostScreen } from "models";
import { AppState } from "store/store";
import { isReferenceObjFilledSufficiently } from "containers/expo-administration/expo-editor/screen-signpost/LinkItem";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as SignpostScreen,
  (viewScreen) => ({ viewScreen })
);

export const ViewSignpost = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);

  const referenceType = useMemo(
    () => viewScreen.referenceType ?? "TEXT_IMAGES",
    [viewScreen.referenceType]
  );

  return (
    <div className="w-full h-full p-4 md:p-8 lg:p-16 xl:p-20 flex flex-col justify-center items-center gap-6">
      <div className="text-white font-bold text-3xl text-center mt-16">
        {viewScreen.header ?? ""}
      </div>
      <div className="text-white font-semibold text-xl text-center">
        {viewScreen.subheader ?? ""}
      </div>

      {/* Links */}
      <div className="mt-6 w-full flex flex-wrap justify-evenly items-center gap-8 overflow-auto expo-scrollbar pb-32">
        {viewScreen?.links?.map((reference, referenceIndex) => {
          if (!isReferenceObjFilledSufficiently(reference)) {
            return null;
          }

          return (
            <ReferenceItem
              key={referenceIndex}
              referenceObj={reference}
              referenceIndex={referenceIndex}
              preloadedReferenceImgSrc={
                screenPreloadedFiles.links?.[referenceIndex]?.image ?? ""
              }
              referenceType={referenceType}
              numberOfTotalReferences={viewScreen.links.length}
            />
          );
        })}
      </div>
    </div>
  );
};
