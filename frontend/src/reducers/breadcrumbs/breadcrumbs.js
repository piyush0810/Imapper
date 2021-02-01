const initialState = [
  {
    imageID: "",
    image_name: "",
  },
];

function breadcrumbReducer(state = initialState, action) {
  if (action.type == "ADD_CURRENT_BREAD") {
    return [
      ...state,
      {
        imageID: action.payload.imageID,
        image_name: action.payload.image_name,
      },
    ];
  }
  return state;
}
export default breadcrumbReducer;
