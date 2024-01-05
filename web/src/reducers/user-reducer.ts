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

export type UserStateType =
  | "NOT_VERIFIED"
  | "TO_ACCEPT"
  | "ACCEPTED"
  | "REJECTED"
  | "DELETED"; // special mark in DB

export type UserTableFilter = UserStateType | "ALL";
export type UserTableSort =
  | "updated"
  | "created"
  | "userName"
  | "firstName"
  | "surname"
  | "email"
  | "institution";

// - -

export type UserInfoObj = {
  accepted: boolean;
  deletedUser: boolean;
  email: string; // could be undefined
  firstName: string;
  id: string;
  institution: string; // could be undefined
  ldapUser: boolean;
  registrationNotifications: boolean;
  state: UserStateType;
  surname: string;
  userName: string;
  verifiedEmail: boolean;
  deleted?: string; // deleted timestamp, if user was deleted this is present, otherwise undefined
};

export type AllUsers = {
  list: UserInfoObj[];
  count: number;
  page: number;
  pageSize: number;
  filter: UserTableFilter;
  sort: UserTableSort;
  search: string;
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
