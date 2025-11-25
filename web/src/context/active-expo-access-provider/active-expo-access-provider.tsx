import { useContext, createContext, ReactNode } from "react";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { AppState } from "store/store";
import { ActiveExpo } from "models";
// - -

type ActiveExpoAccessProviderContextType = {
  isReadWriteAccess: boolean;
};

const ActiveExpoAccessProviderContext =
  createContext<ActiveExpoAccessProviderContextType>(undefined as never);

// - -

type ActiveExpoAccessProviderProps = {
  children: ReactNode;
};

const expoStateSelector = createSelector(
  ({ expo }: AppState) => (expo.activeExpo as ActiveExpo)?.canEdit ?? false,
  (canEdit) => ({ canEdit })
);

export const ActiveExpoAccessProvider = ({
  children,
}: ActiveExpoAccessProviderProps) => {
  const { canEdit } = useSelector(expoStateSelector);

  return (
    <ActiveExpoAccessProviderContext.Provider
      value={{ isReadWriteAccess: canEdit }}
    >
      {children}
    </ActiveExpoAccessProviderContext.Provider>
  );
};

// - -

export const useActiveExpoAccess = () =>
  useContext(ActiveExpoAccessProviderContext);
