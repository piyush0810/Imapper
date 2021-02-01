import { combineReducers } from "redux";

import authReducer from "./auth/authReducer";
import changePasswordReducer from "./auth/changePasswordReducer";
import dotReducer from "./dot/dotReducer";
import imageReducer from "./image/imageReducer";
import sensorReducer from "./sensors/sensorsReducer";
import currUserReducer from "./user/currUserReducer";
import breadcrumbReducer from "./breadcrumbs/breadcrumbs";
const rootReducer = combineReducers({
  auth: authReducer,
  change_password: changePasswordReducer,
  dot: dotReducer,
  img: imageReducer,
  sensor: sensorReducer,
  curr_user: currUserReducer,
  breads: breadcrumbReducer,
});

export default rootReducer;
