import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { useEffect } from "react";

// Components
import AppHeader from "components/app-header";
import Header from "./header";
import Table from "./table";
import Pagination from "./pagination";

// Models
import { AppState, AppDispatch } from "store/store";

// Utils
import { getUsers } from "actions/admin-actions";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.users.all,
  (all) => ({ users: all })
);

// - -

const Users = () => {
  const { users } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getUsers(
        users.page,
        users.pageSize,
        users.filter,
        users.sort,
        users.search,
        users.table
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AppHeader adminStyle />
      <div className="container">
        <Header />
        <Table tableType={users.table} />
        <Pagination />
      </div>
    </div>
  );
};

export default Users;
