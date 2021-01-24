import * as types from "../../types/actionTypes";

function addDot(dot) {
  return { type: types.ADD_DOT, payload: dot };
}
function deleteDot(index) {
  return { type: types.ADD_DOT, payload: index };
}
export { addDot, deleteDot };
