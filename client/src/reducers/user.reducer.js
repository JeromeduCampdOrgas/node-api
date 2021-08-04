import { GET_USER, UPLOAD_PICTURE } from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case UPLOAD_PICTURE:
      return {
        ...state, //on récupère les données utilisateur sans les écraser
        picture: action.payload,
      };

    default:
      return state;
  }
}
