import {
  DELETE_POST,
  GET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  UPDATE_POST,
} from "../actions/post.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload; //retourne le payload soit la res.data cf post.actions ligne 13
    case LIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: [action.payload.userId, ...post.likers],
          };
        }
        return post;
      });
    case UNLIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: post.likers.filter((id) => id !== action.payload.userId),
          };
        }
        return post;
      });
    case UPDATE_POST: //si c'est l'action UPDATE_POST qui est actionnée
      return state.map((post) => {
        //on cherche notre post dans tous les posts
        if (post._id === action.payload.postId) {
          //dans cette map des post, si l'Id est = à l'id du post traité dans l'action
          return {
            ...post, //tu nous retourne ce post
            message: action.payload.message, //en revanche tu modifies le message avec ce qui est envoyé dans l'action
          };
        } else return post; //ici, simple gestion d'erreur console
      });
    case DELETE_POST:
      return state.filter((post) => post._id !== action.payload.postId); //Tu me retournes les posts sauf celui a deleter
    default:
      return state;
  }
}
