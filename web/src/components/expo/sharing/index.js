import React from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import Button from "react-md/lib/Buttons/Button";

import Table from "./Table";

import { setDialog } from "../../../actions/dialogActions";

const Sharing = ({ activeExpo, setDialog, user }) => {
  const { id, author, collaborators } = activeExpo;
  const isAuthor = get(author, "id") === get(user, "id");

  return (
    <div>
      {activeExpo && (
        <div className="container container-tabMenu sharing">
          <p>Sdíleno s uživateli</p>
          <Table {...{ collaborators, author, isAuthor }} />
          <br />
          <Button
            icon
            onClick={() => {
              setDialog("ExpoShare", { id, author });
            }}
            className="color-black"
          >
            add
          </Button>
        </div>
      )}
    </div>
  );
};

export default connect(
  ({ user: { info } }) => ({ user: info }),
  { setDialog }
)(Sharing);
