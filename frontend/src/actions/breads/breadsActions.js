import * as types from "../../types/actionTypes";

function AddCurrBread(data) {
  return { type: "ADD_CURRENT_BREAD", payload: data };
}

export { AddCurrBread };
