import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

// - -

export type GlassMagnifierType = "SQUARE" | "CIRCLE";

type GlassMagnifierConfigProviderContextType = {
  isGlassMagnifierEnabled: boolean;
  setIsGlassMagnifierEnabled: Dispatch<SetStateAction<boolean>>;
  scaleZoomSize: number;
  setScaleZoomSize: Dispatch<SetStateAction<number>>;
  glassMagnifierType: GlassMagnifierType;
  setGlassMagnifierType: Dispatch<SetStateAction<GlassMagnifierType>>;
  glassMagnifierPxSize: number;
  setGlassMagnifierPxSize: Dispatch<SetStateAction<number>>;
};

const GlassMagnifierConfigContext =
  createContext<GlassMagnifierConfigProviderContextType>(undefined as never);

// - -

type GlassMagnifierConfigProviderProps = { children: ReactNode };

export const GlassMagnifierConfigProvider = ({
  children,
}: GlassMagnifierConfigProviderProps) => {
  const [isGlassMagnifierEnabled, setIsGlassMagnifierEnabled] =
    useState<boolean>(false);
  const [scaleZoomSize, setScaleZoomSize] = useState<number>(2);
  const [glassMagnifierType, setGlassMagnifierType] =
    useState<GlassMagnifierType>("SQUARE");
  const [glassMagnifierPxSize, setGlassMagnifierPxSize] = useState<number>(100);

  const valState: GlassMagnifierConfigProviderContextType = {
    isGlassMagnifierEnabled,
    setIsGlassMagnifierEnabled,
    scaleZoomSize,
    setScaleZoomSize,
    glassMagnifierType,
    setGlassMagnifierType,
    glassMagnifierPxSize,
    setGlassMagnifierPxSize,
  };

  return (
    <GlassMagnifierConfigContext.Provider value={valState}>
      {children}
    </GlassMagnifierConfigContext.Provider>
  );
};

// - -

export const useGlassMagnifierConfig = () => {
  return useContext(GlassMagnifierConfigContext);
};
