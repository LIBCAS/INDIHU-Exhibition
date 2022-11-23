import { useLocalStorage } from "hooks/use-local-storage";
import { createContext, ReactNode, useContext } from "react";

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

export type TutorialStoreType = {
  overlay: boolean;
  screenChange: boolean;
};

export const TutorialStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
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
