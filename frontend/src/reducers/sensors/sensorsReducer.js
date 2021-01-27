const initialState = {};

function imageReducer(state = initialState, action) {
  if (action.type == "FETCH_SENSORS") {
    return { ...state, ...action.payload };
  }
  return state;
}
export default imageReducer;
