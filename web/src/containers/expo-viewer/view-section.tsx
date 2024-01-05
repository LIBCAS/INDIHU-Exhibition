import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

import { screenUrl } from "../../enums/screen-type";
import { NewViewScreen } from "./view-screen";
import { fetcher } from "utils/fetcher";

interface Props {
  expoId: string;
  name: string;
  handleViewScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewSection = ({
  expoId,
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

  // Exhibition view count (after 30s of working with exhibition)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetcher(`/api/exposition/${expoId}/add-view`, { method: "POST" });
    }, 30000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NewViewScreen
      name={name}
      handleViewScreen={handleViewScreen}
      setViewScreenIsLoaded={setViewScreenIsLoaded}
    />
  );
};
