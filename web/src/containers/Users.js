import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import { getUsers } from "../actions/adminActions";

import AppHeader from "../components/AppHeader";
import Header from "../components/users/Header";
import Table from "../components/users/Table";
import Pagination from "../components/users/Pagination";

const Users = ({ users }) =>
  <div>
    <AppHeader adminStyle />
    <div className="container">
      <Header />
      <Table tableType={users.table} />
      <Pagination />
    </div>
  </div>;

export default compose(
  connect(({ user: { users: { all } } }) => ({ users: all }), {
    getUsers
  }),
  lifecycle({
    componentWillMount() {
      const { users, getUsers } = this.props;

      getUsers(
        users.page,
        users.pageSize,
        users.filter,
        users.sort,
        users.search,
        users.table
      );
    }
  })
)(Users);
