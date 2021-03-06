import * as types from "../../types/actionTypes";
const initialState = {};

function imageReducer(state = initialState, action) {
  if (action.type == "FETCH_IMAGES") {
    return { ...action.payload };
  }
  return state;
}
export default imageReducer;
