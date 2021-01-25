import { combineReducers } from "redux";

import authReducer from "./auth/authReducer";
import changePasswordReducer from "./auth/changePasswordReducer";
import dotReducer from "./dot/dotReducer";
import imageReducer from "./image/imageReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  change_password: changePasswordReducer,
  dot: dotReducer,
  img: imageReducer,
});

export default rootReducer;
