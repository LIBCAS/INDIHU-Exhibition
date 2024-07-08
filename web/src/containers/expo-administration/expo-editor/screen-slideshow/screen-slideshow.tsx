import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Slideshow from "./slideshow";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  SlideshowScreen,
} from "models";
import { AppDispatch } from "store/store";

import { updateScreenData } from "actions/expoActions";
import { find } from "lodash";

// - -

export type ScreenEditorSlideshowProps =
  ConcreteScreenEditorProps<SlideshowScreen>;

const ScreenSlideshow = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const slideshowProps = props as ScreenEditorSlideshowProps;
  const { activeScreen } = slideshowProps;

  const rowNum = match.params.position.match(/^(\d*)/)?.[0];
  const colNum = match.params.position.match(/(\d*)$/)?.[0];

  const timePhotosManual = useMemo(
    () => activeScreen.timePhotosManual,
    [activeScreen.timePhotosManual]
  );

  const sumOfPhotosTimes = useMemo(() => {
    const sumOfPhotosTimes = activeScreen?.images?.reduce((acc, currImage) => {
      const currTime = currImage?.time ?? 5;
      return acc + currTime;
    }, 0);

    return sumOfPhotosTimes ?? null;
  }, [activeScreen]);

  // When sumOfPhotosTimes changes, that means that some particular image changed its time
  // React and update the total time!
  useEffect(() => {
    if (activeScreen?.timePhotosManual && sumOfPhotosTimes) {
      dispatch(updateScreenData({ time: sumOfPhotosTimes }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumOfPhotosTimes]);

  // When user activated timePhotosManual checkbox, keep the time + divide this time between images
  useEffect(() => {
    if (!timePhotosManual || !activeScreen.images) {
      return;
    }
    if (timePhotosManual === true) {
      const onePart = activeScreen.time / activeScreen.images.length;
      dispatch(
        updateScreenData({
          images: activeScreen.images.map((img) => ({ ...img, time: onePart })),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePhotosManual]);

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.slideshowTab"),
            link: `${match.url}/slideshow`,
          },
          {
            label: t("tabs.documentsTab"),
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => (
          <ScreenDescription
            activeScreen={activeScreen}
            sumOfPhotosTimes={sumOfPhotosTimes}
            rowNum={rowNum}
            colNum={colNum}
          />
        )}
      />
      <Route
        path={`${match.url}/slideshow`}
        render={() => (
          <Slideshow
            activeScreen={activeScreen}
            sumOfPhotosTimes={sumOfPhotosTimes}
          />
        )}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={rowNum}
        colNum={colNum}
        noActions={
          !!find(activeScreen.images, (image) =>
            find(image?.infopoints, (item) => item.edit)
          )
        }
        history={history}
        url={props.url}
      />
    </div>
  );
};

export default ScreenSlideshow;
