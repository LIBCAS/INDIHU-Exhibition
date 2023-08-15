import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

import { useParams } from "react-router-dom";

// - - - - - -

type DrawerPanelProviderContextType = {
  isDrawerPanelOpen: boolean;
  setIsDrawerPanelOpen: Dispatch<SetStateAction<boolean>>;
  drawerPanelOpenedMap: Record<string, boolean>;
  setDrawerPanelOpenedMap: Dispatch<SetStateAction<Record<string, boolean>>>;
};

const DrawerPanelContext = createContext<DrawerPanelProviderContextType>(
  undefined as never
);

// - - - - -

type DrawerPanelProviderProps = {
  children: ReactNode;
};

export const DrawerPanelProvider = ({ children }: DrawerPanelProviderProps) => {
  const [isDrawerPanelOpen, setIsDrawerPanelOpen] = useState<boolean>(false);
  const [drawerPanelOpenedMap, setDrawerPanelOpenedMap] = useState<
    Record<string, boolean>
  >({});

  const valState: DrawerPanelProviderContextType = {
    isDrawerPanelOpen,
    setIsDrawerPanelOpen,
    drawerPanelOpenedMap,
    setDrawerPanelOpenedMap,
  };

  return (
    <DrawerPanelContext.Provider value={valState}>
      {children}
    </DrawerPanelContext.Provider>
  );
};

// - - - - - -

export const useDrawerPanel = () => {
  const {
    isDrawerPanelOpen,
    setIsDrawerPanelOpen,
    drawerPanelOpenedMap,
    setDrawerPanelOpenedMap,
  } = useContext(DrawerPanelContext);

  const { section, screen } = useParams<{
    section: string;
    screen: string;
  }>();

  // - - -

  const markOpenedCurrentScreen = () => {
    setDrawerPanelOpenedMap((prevValue) => {
      const key = `${section}-${screen}`;
      const newValue = { ...prevValue, [key]: true };
      return newValue;
    });
  };

  const markClosedCurrentScreen = () => {
    setDrawerPanelOpenedMap((prevValue) => {
      const key = `${section}-${screen}`;
      const newValue = { ...prevValue, [key]: false };
      return newValue;
    });
  };

  const getMarkStatusOfScreen = (section: string, screen: string) => {
    const key = `${section}-${screen}`;
    if (key in drawerPanelOpenedMap) {
      return drawerPanelOpenedMap[key];
    }
    return false;
  };

  const openDrawer = () => {
    markOpenedCurrentScreen();
    setIsDrawerPanelOpen(true);
  };

  const openDrawerWithoutMarking = () => {
    setIsDrawerPanelOpen(true);
  };

  const closeDrawer = () => {
    markClosedCurrentScreen();
    setIsDrawerPanelOpen(false);
  };

  const closeDrawerWithoutMarking = () => {
    setIsDrawerPanelOpen(false);
  };

  return {
    isDrawerPanelOpen,
    openDrawer,
    closeDrawer,
    openDrawerWithoutMarking,
    closeDrawerWithoutMarking,
    getMarkStatusOfScreen,
  };
};
