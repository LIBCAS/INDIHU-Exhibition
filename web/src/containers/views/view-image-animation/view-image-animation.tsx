import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Types
import { ScreenProps, ImageAnimationScreen } from "models";
import { AppState } from "store/store";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ImageAnimationScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const ViewImageAnimation = ({ screenPreloadedFiles }: ScreenProps) => {
  console.log();
  console.log("*** ViewImageAnimation ***");

  const { viewScreen } = useSelector(stateSelector);

  console.log("viewScreen: ", viewScreen);
  console.log("screenPreloadedFiles: ", screenPreloadedFiles);

  return (
    <div className="w-full h-full px-[5%] xl:px-[10%] py-[5%]">
      <div className="h-full overflow-auto expo-scrollbar pr-4 pb-16 md:pb-32">
        <div className="min-h-full flex flex-col justify-center items-center gap-8 md:gap-12">
          <div className="w-full text-center text-white font-bold text-2xl md:text-3xl mt-4 md:mt-0">
            TODO SCREEN
          </div>
        </div>
      </div>
    </div>
  );
};
