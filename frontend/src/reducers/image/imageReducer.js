import * as types from "../../types/actionTypes";
const initialState = {
  fetchImageCall: 0,
};

function imageReducer(state = initialState, action) {
  if (action.type == "FETCH_IMAGES") {
    return { ...state, ...action.payload };
  }
  if (action.type == "CALL_FETCH") {
    return { ...state, fetchImageCall: state.fetchImageCall + 1 };
  }

  return state;
}
export default imageReducer;
