import { compose } from "recompose";
import { connect } from "react-redux";

const ViewExternal = ({ viewScreen }) => (
  <div className="viewer-screen">
    {viewScreen.externalData && (
      <div
        className="external"
        dangerouslySetInnerHTML={{ __html: viewScreen.externalData }}
      />
    )}
  </div>
);

export default compose(
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null)
)(ViewExternal);
