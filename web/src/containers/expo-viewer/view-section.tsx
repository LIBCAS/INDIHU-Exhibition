import { setViewProgress } from "actions/expoActions/viewer-actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { AppDispatch } from "store/store";

import { screenUrl } from "../../enums/screen-type";
import { NewViewScreen } from "./view-screen";

interface Props {
  name: string;
  handleScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewSection = ({
  name,
  handleScreen,
  setViewScreenIsLoaded,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { params } = useRouteMatch<{ section: string }>();
  const section = params.section;

  useEffect(() => {
    const handleScreenOnMount = async () => {
      if (section === screenUrl.START || section === screenUrl.FINISH) {
        await handleScreen({ section });
      }
    };

    handleScreenOnMount();
  }, [handleScreen, section]);

  useEffect(() => {
    dispatch(setViewProgress({ shouldIncrement: true }));
  }, [dispatch]);

  return (
    <NewViewScreen
      name={name}
      handleScreen={handleScreen}
      setViewScreenIsLoaded={setViewScreenIsLoaded}
    />
  );
};
