import * as types from "../../types/actionTypes";
const initialState = {
  dots: [],
};

function dotReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_DOT:
      return [...state.dots, action.payload];
    case types.DELETE_DOT:
      return state.filter((e, i) => {
        return i != action.payload;
      });
    default:
      return state;
  }
}
export default dotReducer;
