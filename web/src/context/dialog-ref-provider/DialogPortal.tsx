import ReactDOM from "react-dom";
import { useDialogRef } from "./dialog-ref-provider";

// - -

type DialogPortalProps = { component: React.ReactNode };

const DialogPortal = ({ component }: DialogPortalProps) => {
  const { dialogsDivRef } = useDialogRef();

  if (!dialogsDivRef.current) {
    return null;
  }

  return ReactDOM.createPortal(component, dialogsDivRef.current);
};

export default DialogPortal;
