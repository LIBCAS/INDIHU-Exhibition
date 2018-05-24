import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

import ScreenMenu from "../../components/views/ScreenMenu";

const ViewExternal = ({ viewScreen }) =>
  <div className="viewer-screen">
    {viewScreen.externalData &&
      <div
        className="external"
        dangerouslySetInnerHTML={{ __html: viewScreen.externalData }}
      />}
    <ScreenMenu viewScreen={viewScreen} />
  </div>;

export default compose(
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null)
)(ViewExternal);
