import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

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

  return (
    <NewViewScreen
      name={name}
      handleScreen={handleScreen}
      setViewScreenIsLoaded={setViewScreenIsLoaded}
    />
  );
};
