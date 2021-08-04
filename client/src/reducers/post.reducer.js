import { GET_POSTS } from "../actions/post.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload; //retourne le payload soit la res.data cf post.actions ligne 13
    default:
      return state;
  }
}
