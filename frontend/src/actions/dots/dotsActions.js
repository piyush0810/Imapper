import * as types from "../../types/actionTypes";

function AddDot(dot) {
  return { type: types.ADD_DOT, payload: dot };
}
function DeleteDot(index) {
  return { type: types.DELETE_DOT, payload: index };
}

export { AddDot, DeleteDot };
