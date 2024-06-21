import { combineReducers } from "redux";
import UsersReducer from "./UsersReducer";
import MuiReducer from "./MuiReducer";
import AlertsReducer from "./AlertsReducer";

const rootReducer = combineReducers({
  usersReducer: UsersReducer,
  muiReducer: MuiReducer,
  alertsReducer:AlertsReducer
});

export default rootReducer;