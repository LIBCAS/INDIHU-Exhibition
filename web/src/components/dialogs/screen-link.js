import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from "react-md/lib/Buttons/Button";

import Dialog from "./dialog-wrap";
import { useTranslation } from "react-i18next";

const ScreenLink = ({
  handleSubmit,
  initialValues,
  showCopied,
  setShowCopied,
  timeoutId,
  setTimeoutId,
}) => {
  const { t } = useTranslation("expo", { keyPrefix: "screenLinkDialog" });

  return initialValues.link ? (
    <Dialog
      title={t("title")}
      name="ScreenLink"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
      noStornoButton={true}
      big={true}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex-row">
          <h4>{`${window.location.origin}/view/${initialValues.link}`}</h4>
        </div>
        <div className="flex-row">
          <CopyToClipboard
            text={`${window.location.origin}/view/${initialValues.link}`}
          >
            <div style={{ position: "relative" }}>
              {showCopied && (
                <div
                  className="chip"
                  style={{
                    position: "absolute",
                    top: -40,
                    left: "50%",
                    transform: "translateX(-50%)",
                    margin: 0,
                  }}
                >
                  {t("copied")}
                </div>
              )}
              <Button
                raised
                label={t("copyToClipboardLabel")}
                onClick={() => {
                  setShowCopied(true);
                  clearTimeout(timeoutId);
                  setTimeoutId(setTimeout(() => setShowCopied(false), 1500));
                }}
              />
            </div>
          </CopyToClipboard>
        </div>
      </form>
    </Dialog>
  ) : (
    <div />
  );
};

export default compose(
  withState("showCopied", "setShowCopied", false),
  withState("timeoutId", "setTimeoutId", null),
  connect(({ dialog: { data } }) => ({
    initialValues: { link: data ? data.link : null },
  })),
  withHandlers({
    onSubmit: (dialog) => async () => {
      dialog.closeDialog();
    },
  }),
  lifecycle({
    componentWillUnmount() {
      const { timeoutId, setTimeoutId } = this.props;

      clearTimeout(timeoutId);
      setTimeoutId(null);
    },
  }),
  reduxForm({
    form: "screenLink",
    enableReinitialize: true,
  })
)(ScreenLink);
