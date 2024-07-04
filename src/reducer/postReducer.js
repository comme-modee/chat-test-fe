import * as types from "../constants/post.constants";
const initialState = {
  loading: false,
  error: '',
  postList: [],
  selectedPost: null,
  isFollowing: false,
  commentLoading: false,
  adminPostList: []
};

function postReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.POST_CREATE_REQUEST:
    case types.POST_GET_REQUEST:
    case types.GET_POST_DETAIL_REQUEST:
    case types.POST_DELETE_REQUEST:
    case types.POST_EDIT_REQUEST:
    case types.ADD_LIKE_ON_POST_REQUEST:
    case types.ADD_SCRAP_REQUEST:
    case types.BLOCK_POST_REQUEST:
    case types.GET_ADMIN_POST_LIST_REQUEST:
    case types.TOGGLE_SCRAP_PRIVATE_REQUEST:
    case types.DELETE_SCRAP_REQUEST:
        return {...state, loading: true}

    case types.CREATE_POST_COMMENT_REQUEST:
    case types.UPDATE_POST_COMMENT_REQUEST:
    case types.DELETE_POST_COMMENT_REQUEST:
        return {...state, commentLoading: true}

    case types.POST_CREATE_SUCCESS:
    case types.POST_DELETE_SUCCESS:
    case types.POST_EDIT_SUCCESS:
    case types.ADD_LIKE_ON_POST_SUCCESS:
    case types.ADD_SCRAP_SUCCESS:
    case types.BLOCK_POST_SUCCESS:
    case types.TOGGLE_SCRAP_PRIVATE_SUCCESS:
    case types.DELETE_SCRAP_SUCCESS:
      return {...state, loading: false, error: ''}

    case types.CREATE_POST_COMMENT_SUCCESS:
    case types.UPDATE_POST_COMMENT_SUCCESS:
    case types.DELETE_POST_COMMENT_SUCCESS:
      return {...state, commentLoading: false, error: ''}
      
    case types.GET_POST_DETAIL_SUCCESS:
      return {...state, loading: false, selectedPost: payload, error: ''}

    case types.POST_GET_SUCCESS:
        return {...state, loading: false, postList: payload, error: ''}

    case types.GET_ADMIN_POST_LIST_SUCCESS:
        return { ...state, loading: false, adminPostList: payload, error: ''}

    case types.POST_CREATE_FAIL:
    case types.POST_GET_FAIL:
    case types.GET_POST_DETAIL_FAIL:
    case types.POST_DELETE_FAIL:
    case types.POST_EDIT_FAIL:
    case types.ADD_LIKE_ON_POST_FAIL:
    case types.ADD_SCRAP_FAIL:
    case types.BLOCK_POST_FAIL:
    case types.GET_ADMIN_POST_LIST_FAIL:
    case types.TOGGLE_SCRAP_PRIVATE_FAIL:
    case types.DELETE_SCRAP_FAIL:
        return {...state, loading: false, error:payload}

    case types.CREATE_POST_COMMENT_FAIL:
    case types.UPDATE_POST_COMMENT_FAIL:
    case types.DELETE_POST_COMMENT_FAIL:
      return {...state, commentLoading: false, error:payload}

    case types.SET_ISFOLLOWING:
        return {...state, isFollowing: payload}
    default:
        return state;
  }
}

export default postReducer;