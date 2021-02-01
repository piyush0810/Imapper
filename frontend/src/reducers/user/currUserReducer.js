const initialState = {
  username: "",
  parent_name: "",
  is_admin: "",
  is_staff: "",
  is_approved: "",
};

function currUserReducer(state = initialState, action) {
  if (action.type == "ADD_CURRENT_USER") {
    return {
      username: action.payload.username,
      parent_name: action.payload.parent_name,
      is_admin: action.payload.is_admin,
      is_staff: action.payload.is_staff,
      is_approved: action.payload.is_approved,
    };
  }
  return state;
}
export default currUserReducer;
