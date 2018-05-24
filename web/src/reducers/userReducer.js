import { map } from "lodash";

import {
  USER,
  USERS,
  USER_INFO,
  USER_DELETE,
  USER_REACTIVATE,
  USER_SET
} from "../actions/constants";
import * as storage from "../utils/storage";

const initialState = {
  role: JSON.parse(storage.get("role")) || [],
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
      table: "ALL"
    },
    active: []
  },
  info: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER:
      return { ...state, ...action.payload };
    case USERS:
      return {
        ...state,
        users: { ...state.users, ...action.payload }
      };
    case USER_SET:
      return {
        ...state,
        users: {
          ...state.users,
          all: {
            ...state.users.all,
            list: map(
              state.users.all.list,
              l => (l.id !== action.payload.id ? l : action.payload)
            )
          }
        }
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
            list: map(
              state.users.all.list,
              l =>
                l.id !== action.payload.id ? l : { ...l, deletedUser: true }
            )
          }
        }
      };
    case USER_REACTIVATE:
      return {
        ...state,
        users: {
          ...state.users,
          all: {
            ...state.users.all,
            list: map(
              state.users.all.list,
              l =>
                l.id !== action.payload.id ? l : { ...l, deletedUser: false }
            )
          }
        }
      };
    default:
      return state;
  }
};

export default reducer;
