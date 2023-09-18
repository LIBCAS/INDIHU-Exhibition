import { useDialogRef } from "./dialog-ref-provider";

const DialogsRef = () => {
  const { dialogsDivRef } = useDialogRef();
  return <div ref={dialogsDivRef} id="dialogs-div-ref"></div>;
};

export default DialogsRef;
