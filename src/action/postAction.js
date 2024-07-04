import api from "../utils/api";
import * as types from "../constants/post.constants";
import { commonUiActions } from "./commonUiAction";
import { userActions } from "./userAction";

const getPostList = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: types.POST_GET_REQUEST })
        const res = await api.get(`/post/all`, {
            params: { ...searchQuery },
        });
        if (res.status !== 200) {
            throw new Error('포스트를 불러오는데 실패하였습니다.')
        } else {
            dispatch({ type: types.POST_GET_SUCCESS, payload: res.data.data.allPost })
        }
    } catch (error) {
        dispatch({ type: types.POST_GET_FAIL, payload: error.message })
        // dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
};

const getPostDetail = (id) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_POST_DETAIL_REQUEST })
        const res = await api.get(`/post/${id}`);
        if (res.status !== 200) {
            throw new Error('포스트를 불러오는데 실패하였습니다.')
        } else {
            dispatch({ type: types.GET_POST_DETAIL_SUCCESS, payload: res.data.data.post })
        }
    } catch (error) {
        dispatch({ type: types.GET_POST_DETAIL_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
};

const createPost = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: types.POST_CREATE_REQUEST })
        const res = await api.post('/post', formData);
        if (res.status !== 200) {
            throw new Error('새 포스트 등록에 실패하였습니다. 다시 시도해주세요.')
        } else {
            dispatch({ type: types.POST_CREATE_SUCCESS, payload: res.data.data })
            dispatch(commonUiActions.showToastMessage("새 포스트가 등록되었습니다.", "success"))
            navigate(`/post/${res.data.data.newPost._id}`)
        }
    } catch (error) {
        dispatch({ type: types.POST_CREATE_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
};

const deletePost = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: types.POST_DELETE_REQUEST })
        const res = await api.delete(`/post/${id}`);
        if (res.status !== 200) {
            throw new Error('포스트 삭제에 실패하였습니다.')
        } else {
            dispatch({ type: types.POST_DELETE_SUCCESS })
            dispatch(commonUiActions.showToastMessage("포스트를 삭제하였습니다.", "success"))
            navigate(`/post`)
        }
    } catch (error) {
        dispatch({ type: types.POST_DELETE_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
};

const updatePost = (id, formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: types.POST_EDIT_REQUEST });
        const res = await api.put(`/post/${id}`, formData);
        if (res.status !== 200) {
            throw new Error('포스트 수정에 실패하였습니다.')
        } else {
            dispatch({ type: types.POST_EDIT_SUCCESS })
            dispatch(commonUiActions.showToastMessage("포스트가 수정되었습니다.", "success"))
            navigate(`/post/${id}`)
        }
    } catch (error) {
        dispatch({ type: types.POST_EDIT_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
};

const createComment = (id, newComment) => async (dispatch) => {
    try {
        dispatch({ type: types.CREATE_POST_COMMENT_REQUEST })
        const res = await api.post(`/post/comment`, { postId: id, content: newComment });
        if (res.status !== 200) {
            throw new Error('댓글 등록에 실패하였습니다.')
        } else {
            dispatch({ type: types.CREATE_POST_COMMENT_SUCCESS })
            dispatch(commonUiActions.showToastMessage("댓글이 등록되었습니다.", "success"))
            dispatch(getPostDetail(id))
        }
    } catch (error) {
        dispatch({ type: types.CREATE_POST_COMMENT_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const updateComment = (postId, commentId, content) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_POST_COMMENT_REQUEST })
        const res = await api.put(`/post/${postId}/comment/${commentId}`, { content });
        if (res.status !== 200) {
            throw new Error('댓글 수정에 실패하였습니다.')
        } else {
            dispatch({ type: types.UPDATE_POST_COMMENT_SUCCESS })
            dispatch(getPostDetail(postId))
        }
    } catch (error) {
        dispatch({ type: types.UPDATE_POST_COMMENT_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const deleteComment = (postId, commentId) => async (dispatch) => {
    try {
        dispatch({ type: types.DELETE_POST_COMMENT_REQUEST })
        const res = await api.delete(`/post/${postId}/comment/${commentId}`);
        if (res.status !== 200) {
            throw new Error('댓글 삭제에 실패하였습니다.')
        } else {
            dispatch({ type: types.DELETE_POST_COMMENT_SUCCESS })
            dispatch(getPostDetail(postId))
        }
    } catch (error) {
        dispatch({ type: types.DELETE_POST_COMMENT_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const toggleLike = (id, searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: types.ADD_LIKE_ON_POST_REQUEST });
        const res = await api.post(`/post/like`, { postId: id });
        if (res.status !== 200) {
            throw new Error('좋아요에 실패하였습니다.')
        } else {
            dispatch({ type: types.ADD_LIKE_ON_POST_SUCCESS });
            dispatch(getPostList({ ...searchQuery }));
            dispatch(getPostDetail(id));
        }
    } catch (error) {
        dispatch({ type: types.ADD_LIKE_ON_POST_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const addScrap = (postId, isPrivate) => async (dispatch) => {
    try {
        dispatch({ type: types.ADD_SCRAP_REQUEST });
        const res = await api.post(`/post/scrap`, { postId, isPrivate });
        if (res.status !== 200) {
            throw new Error('스크랩에 실패하였습니다.')
        } else {
            dispatch({ type: types.ADD_SCRAP_SUCCESS });
            dispatch(commonUiActions.showToastMessage("MY DEV에 스크랩되었습니다.", "success"))
        }
    } catch (error) {
        dispatch({ type: types.ADD_SCRAP_FAIL, payload: error.message })
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const blockPost = (id) => async (dispatch) => {
    try {
        dispatch({type: types.BLOCK_POST_REQUEST})
        const res = await api.put(`/post/block/${id}`);
        if(res.status !== 200) {
            throw new Error('공개 제한에 실패하였습니다.')
        } else {
            dispatch({type: types.BLOCK_POST_SUCCESS});
            dispatch(getAdminPostList())
            dispatch(commonUiActions.showToastMessage(res.message, "success"))
        }
    } catch (error) {
        dispatch({type: types.BLOCK_POST_FAIL, payload: error.message})
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const getAdminPostList = () => async (dispatch) => {
    try {
        dispatch({type: types.GET_ADMIN_POST_LIST_REQUEST})
        const res = await api.get('/admin/post');
        if(res.status !== 200) {
            throw new Error('포스트가 없습니다.')
        } else {
            dispatch({type: types.GET_ADMIN_POST_LIST_SUCCESS, payload: res.data.data.adminPostList });
            dispatch(commonUiActions.showToastMessage(res.message, "success"))
        }
    } catch (error) {
        dispatch({type: types.GET_ADMIN_POST_LIST_FAIL, payload: error.message})
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
    }
}

const toggleScrapPrivate = (nickName, postId) => async (dispatch) => {
    try {
        dispatch({type: types.TOGGLE_SCRAP_PRIVATE_REQUEST})
        const res = await api.put('/post/scrap/private', { postId });
        if(res.status !== 200) {
            throw new Error('비공개 전환에 실패하였습니다.')
        } else {
            dispatch({type: types.TOGGLE_SCRAP_PRIVATE_SUCCESS});
            dispatch(userActions.getUserByNickName(nickName))
            dispatch(commonUiActions.showToastMessage(res.message, "success"))
        }
    } catch (error) {
        dispatch({type: types.TOGGLE_SCRAP_PRIVATE_FAIL, payload: error.message})
    }
}

const deleteScrap = (nickName, postId) => async (dispatch) => {
    try {
        dispatch({type: types.DELETE_SCRAP_REQUEST})
        const res = await api.put('/post/scrap/delete', { postId });
        if(res.status !== 200) {
            throw new Error('스크랩 삭제에 실패하였습니다.')
        } else {
            dispatch({type: types.DELETE_SCRAP_SUCCESS});
            dispatch(userActions.getUserByNickName(nickName))
            dispatch(commonUiActions.showToastMessage(res.message, "success"))
        }
    } catch (error) {
        dispatch({type: types.DELETE_SCRAP_FAIL, payload: error.message})
    }
}

export const postActions = {
  getPostList,
  createPost,
  deletePost,
  updatePost,
  getPostDetail,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
  addScrap,
  blockPost,
  getAdminPostList,
  toggleScrapPrivate,
  deleteScrap,
};
