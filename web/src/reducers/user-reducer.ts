import { Reducer } from "redux";
import {
  USER,
  USERS,
  USER_INFO,
  USER_DELETE,
  USER_REACTIVATE,
  USER_SET,
} from "../actions/constants";
import * as storage from "../utils/storage";
import { map } from "lodash";

// - -

export type UserInfoObj = {
  id: string;
  firstName: string;
  surName: string;
  email: string;
  verifiedEmail: boolean;
  userName: string;
  institution: string;
  state: string;
  accepted: boolean;
  ldapUser: boolean;
  deletedUser: boolean;
};

export type AllUsers = {
  list: UserInfoObj[];
  count: number;
  page: number;
  pageSize: number;
  filter: string;
  sort: string;
  search: string;
  table: string;
};

export type UsersObj = {
  all: AllUsers;
  active: any[];
};

export type UserReducerState = {
  role: string[];
  userName: string | null;
  users: UsersObj;
  info: UserInfoObj | Record<string, never>;
};

// - -

const roleString = storage.get("role");

const initialState: UserReducerState = {
  role: roleString ? JSON.parse(roleString) || [] : [],
  userName: storage.get("userName") || null,
  users: {
    all: {
      list: [],
      count: 0,
      page: 0,
      pageSize: 20,
      filter: "ALL",
      sort: "updated",
      search: "",
      table: "ALL",
    },
    active: [],
  },
  info: {},
};

// - -

const reducer: Reducer<UserReducerState> = (state = initialState, action) => {
  switch (action.type) {
    case USER:
      return { ...state, ...action.payload };
    case USERS:
      return {
        ...state,
        users: { ...state.users, ...action.payload },
      };
    case USER_SET:
      return {
        ...state,
        users: {
          ...state.users,
          all: {
            ...state.users.all,
            list: map(state.users.all.list, (l) =>
              l.id !== action.payload.id ? l : action.payload
            ),
          },
        },
      };
    case USER_INFO:
      return { ...state, ...action.payload };
    case USER_DELETE:
      return {
        ...state,
        users: {
          ...state.users,
          all: {
            ...state.users.all,
            list: map(state.users.all.list, (l) =>
              l.id !== action.payload.id ? l : { ...l, deletedUser: true }
            ),
          },
        },
      };
    case USER_REACTIVATE:
      return {
        ...state,
        users: {
          ...state.users,
          all: {
            ...state.users.all,
            list: map(state.users.all.list, (l) =>
              l.id !== action.payload.id ? l : { ...l, deletedUser: false }
            ),
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
