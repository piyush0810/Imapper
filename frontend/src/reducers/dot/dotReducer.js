import * as types from "../../types/actionTypes";
const initialState = {
  dots: [],
};

function dotReducer(state = initialState, action) {
  if (action.type === "ADD_DOT") {
    return { ...state, dots: [...state.dots, action.payload] };
  }
  if (action.type === "DELETE_DOT") {
    return {
      ...state,
      dots: state.dots.filter((e, i) => {
        return i != action.payload;
      }),
    };
  }
  return state;
}
export default dotReducer;
