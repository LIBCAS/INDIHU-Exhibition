import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import { getUsers } from "../../actions/admin-actions";

import AppHeader from "../../components/app-header";
import Header from "./header";
import Table from "./table";
import Pagination from "./pagination";

const Users = ({ users }) => (
  <div>
    <AppHeader adminStyle />
    <div className="container">
      <Header />
      <Table tableType={users.table} />
      <Pagination />
    </div>
  </div>
);

export default compose(
  connect(
    ({
      user: {
        users: { all },
      },
    }) => ({ users: all }),
    {
      getUsers,
    }
  ),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { users, getUsers } = this.props;

      getUsers(
        users.page,
        users.pageSize,
        users.filter,
        users.sort,
        users.search,
        users.table
      );
    },
  })
)(Users);
