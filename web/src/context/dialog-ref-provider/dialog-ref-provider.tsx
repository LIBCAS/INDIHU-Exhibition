import {
  useRef,
  MutableRefObject,
  createContext,
  useContext,
  ReactNode,
} from "react";

// - - -

type DialogRefProviderContextType = {
  dialogsDivRef: MutableRefObject<HTMLDivElement | null>;
};

const DialogRefContext = createContext<DialogRefProviderContextType>(
  undefined as never
);

// - - -

type DialogRefProviderProps = {
  children: ReactNode;
};

export const DialogRefProvider = ({ children }: DialogRefProviderProps) => {
  const dialogsDivRef = useRef<HTMLDivElement | null>(null);

  return (
    <DialogRefContext.Provider value={{ dialogsDivRef: dialogsDivRef }}>
      {children}
    </DialogRefContext.Provider>
  );
};

// - - -

export const useDialogRef = () => useContext(DialogRefContext);
