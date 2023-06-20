import { useLocalStorage } from "hooks/use-local-storage";
import { createContext, ReactNode, useContext } from "react";

export type TutorialStoreType = {
  overlay: boolean;
  screenChange: boolean;
};

type TutorialContextType = readonly [
  store: TutorialStoreType,
  setStore: (
    value: TutorialStoreType | ((val: TutorialStoreType) => TutorialStoreType)
  ) => void
];

const TutorialStoreContext = createContext<TutorialContextType>(
  undefined as never
);

export const useTutorialStore = () => useContext(TutorialStoreContext);

// - - -

type TutorialStoreProviderProps = {
  children: ReactNode
};

export const TutorialStoreProvider = ({ children }: TutorialStoreProviderProps) => {
  const store = useLocalStorage<TutorialStoreType>("tutorial", {
    overlay: true,
    screenChange: true,
  });

  return (
    <TutorialStoreContext.Provider value={store}>
      {children}
    </TutorialStoreContext.Provider>
  );
};
