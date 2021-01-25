import { combineReducers } from "redux";

import authReducer from "./auth/authReducer";
import changePasswordReducer from "./auth/changePasswordReducer";
import dotReducer from "./dot/dotReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  change_password: changePasswordReducer,
  dot: dotReducer,
});

export default rootReducer;
