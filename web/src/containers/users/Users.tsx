import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { useDebounce } from "hooks/debounce-hook";

// Components
import AppHeader from "components/app-header/AppHeader";
import Header from "./Header";
import Table from "./Table";
import { Pagination } from "components/pagination/Pagination";

// Models
import { AppState, AppDispatch } from "store/store";
import { UserTableFilter, UserTableSort } from "reducers/user-reducer";

// Actions
import { getUsers } from "actions/admin-actions";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.users.all,
  ({ user }: AppState) => user.userName,
  (usersAll, userName) => ({ usersAll, userName })
);

// - -

export type UserTableStateObj = {
  page: number;
  pageSize: number;
  filter: UserTableFilter;
  sort: UserTableSort;
  search: string;
};

type UserTableStateKey = keyof UserTableStateObj;

export type UserTableSetter = <K extends keyof UserTableStateObj>(
  userStateKey: K,
  newValue: UserTableStateObj[K]
) => void;

// - -

const Users = () => {
  const { usersAll, userName } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("users");

  const [userTableState, setUserTableState] = useState<UserTableStateObj>({
    page: 0,
    pageSize: 20,
    filter: "ALL",
    sort: "updated",
    search: "",
  });

  const setTableState: UserTableSetter = useCallback(
    <K extends UserTableStateKey>(
      userStateKey: K,
      newValue: UserTableStateObj[K]
    ) => {
      setUserTableState((prev) => ({ ...prev, [userStateKey]: newValue }));
    },
    []
  );

  const debouncedSearchFilter = useDebounce(userTableState.search, 400);

  // - -

  useEffect(() => {
    dispatch(
      getUsers(
        userTableState.page,
        userTableState.pageSize,
        userTableState.filter,
        userTableState.sort,
        debouncedSearchFilter
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userTableState.page,
    userTableState.pageSize,
    userTableState.filter,
    userTableState.sort,
    debouncedSearchFilter,
  ]);

  // - -

  return (
    <div>
      <AppHeader adminStyle />
      <div className="container">
        <Header tableState={userTableState} setTableState={setTableState} />
        <Table
          usersAll={usersAll}
          userName={userName as string}
          userTableState={userTableState}
        />

        <div className="mt-2 p-4 w-full flex justify-center md:justify-end items-center">
          <Pagination
            page={userTableState.page}
            pageSize={userTableState.pageSize}
            itemsCount={usersAll.count}
            onPageSizeChange={(newPageSize: number) => {
              setTableState("page", 0);
              setTableState("pageSize", newPageSize);
            }}
            pageSizeId="users-table-pagesize"
            pageSizeLabel={t("pagesizeLabel")}
            onPageBefore={(newPage: number, _newPageSize: number) => {
              setTableState("page", newPage);
            }}
            onPageAfter={(newPage: number, _newPageSize: number) => {
              setTableState("page", newPage);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
