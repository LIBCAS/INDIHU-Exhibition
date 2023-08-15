import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

import { screenUrl } from "../../enums/screen-type";
import { NewViewScreen } from "./view-screen";

interface Props {
  name: string;
  handleViewScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewSection = ({
  name,
  handleViewScreen,
  setViewScreenIsLoaded,
}: Props) => {
  const { params } = useRouteMatch<{ section: string }>();
  const section = params.section;

  useEffect(() => {
    const handleViewScreenOnMount = async () => {
      if (section === screenUrl.START || section === screenUrl.FINISH) {
        await handleViewScreen({ section });
      }
    };

    handleViewScreenOnMount();
  }, [handleViewScreen, section]);

  return (
    <NewViewScreen
      name={name}
      handleViewScreen={handleViewScreen}
      setViewScreenIsLoaded={setViewScreenIsLoaded}
    />
  );
};
