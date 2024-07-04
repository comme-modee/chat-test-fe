import api from "../utils/api";
import * as types from "../constants/user.constants";
import { commonUiActions } from "./commonUiAction";

const loginWithToken = () => async (dispatch) => {
  try {
    dispatch({ type: types.TOKEN_LOGIN_REQUEST })
    const res = await api.get('/user');
    if (res.status !== 200) {
      throw new Error('Invalid token');
    }
    else {
      dispatch({ type: types.TOKEN_LOGIN_SUCCESS, payload: res.data.data })
    }

  } catch (error) {
    dispatch({ type: types.TOKEN_LOGIN_FAIL, payload: error.message })
    dispatch(logout())
  }
};

const clearError = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_ERROR });
};

const loginWithEmail = ({ email, password }) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_REQUEST })
    const res = await api.post('/auth/login', { email, password })
    if (res.status !== 200) {
      throw new Error(res.error)
    }
    else {
      dispatch({ type: types.LOGIN_SUCCESS, payload: res.data.data })
      sessionStorage.setItem('token', res.data.data.token)
      dispatch(commonUiActions.showToastMessage(`${res.data.data.user.userName}님 환영합니다`, "success"))
    }

  } catch (error) {
    dispatch({ type: types.LOGIN_FAIL, payload: error.message })
  }
};

const logout = () => async (dispatch) => {
  dispatch({ type: types.LOGOUT });
  sessionStorage.removeItem('token');
};

const loginWithGoogle = (token) => async (dispatch) => {
  try {
    dispatch({ type: types.GOOGLE_LOGIN_REQUEST });
    const res = await api.post("/auth/google", { token });
    if (res.status === 200) {
      sessionStorage.setItem("token", res.data.token);
      dispatch({ type: types.GOOGLE_LOGIN_SUCCESS, payload: res.data });
    }
    else {
      throw new Error(res.error);
    }
  } catch (error) {
    dispatch({ type: types.GOOGLE_LOGIN_FAIL, payload: error.message });
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const register = ({ email, userName, password, gender, nickName }, navigate) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_REQUEST })
    const res = await api.post('/user', { email, userName, password, gender, nickName })
    if (res.status !== 200) {
      throw new Error(res.error)
    }
    else {
      dispatch({ type: types.REGISTER_SUCCESS })
      dispatch(commonUiActions.showToastMessage("회원가입을 완료했습니다.", "success"))
      navigate('/login')
    }

  } catch (error) {
    dispatch({ type: types.REGISTER_FAIL, payload: error.message })
  }
};

const loginWithGithub = () => async (dispatch) => { };
const loginWithFacebook = () => async (dispatch) => { };

const getUserList = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_USER_LIST_REQUEST })
    const res = await api.get("/user/all")
    if (res.status !== 200) {
      throw new Error(res.error)
    } else {
      dispatch({ type: types.GET_USER_LIST_SUCCESS, payload: res.data.data })
    }

  } catch (error) {
    dispatch({ type: types.GET_USER_LIST_FAIL, payload: error.message })
  }
}

const updateUser = (userFormData) => async (dispatch) => {
  try {
    dispatch({ type: types.UPDATE_USER_REQUEST })
    const res = await api.put('/user', userFormData);
    if (res.status !== 200) {
      throw new Error(res.error)
    }
    else {
      dispatch({ type: types.UPDATE_USER_SUCCESS, payload: res.data.data })
      dispatch(commonUiActions.showToastMessage("정보 수정이 완료되었습니다.", "success"))
    }
  } catch (error) {
    dispatch({ type: types.UPDATE_USER_FAIL, payload: error.message })
  }
};

const updateGoogleUser = (userFormData, navigate) => async (dispatch) => {
  console.log("updateGoogleUser", userFormData);
  try {
    dispatch({ type: types.UPDATE_USER_REQUEST })
    const res = await api.put('/user/google', userFormData);
    if (res.status !== 200) {
      throw new Error(res.error)
    }
    else {
      dispatch({ type: types.UPDATE_USER_SUCCESS, payload: res.data.data })
      dispatch(commonUiActions.showToastMessage("정보 수정이 완료되었습니다.", "success"))
      navigate("/");
    }
  } catch (error) {
    dispatch({ type: types.UPDATE_USER_FAIL, payload: error.message })
  }
};

const getUserByNickName = (nickName) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_USER_BY_NICKNAME_REQUEST })
    const res = await api.get(`/user/me/${nickName}`)
    if (res.status !== 200) {
      throw new Error(res.error)
    } else {
      dispatch({ type: types.GET_USER_BY_NICKNAME_SUCCESS, payload: res.data.data })
    }

  } catch (error) {
    dispatch({ type: types.GET_USER_BY_NICKNAME_FAIL, payload: error.message })
  }
}

const followUser = (nickName) => async (dispatch) => {
  try {
    dispatch({ type: types.FOLLOW_USER_REQUEST });
    const res = await api.post(`/user/me/${nickName}/follow`);
    if (res.status !== 200) {
      throw new Error(res.error)
    } else {
      dispatch({ type: types.FOLLOW_USER_SUCCESS, payload: res.data.data })
    }
  } catch (error) {
    dispatch({ type: types.FOLLOW_USER_FAIL, payload: error.message })
  }
}

const unfollowUser = (nickName) => async (dispatch) => {
  try {
    dispatch({ type: types.UNFOLLOW_USER_REQUEST });
    const res = await api.post(`/user/me/${nickName}/unfollow`);
    if (res.status !== 200) {
      throw new Error(res.error)
    } else {
      dispatch({ type: types.UNFOLLOW_USER_SUCCESS, payload: res.data.data })
    }
  } catch (error) {
    dispatch({ type: types.UNFOLLOW_USER_FAIL, payload: error.message })
  }
}

const blockUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: types.BLOCK_USER_REQUEST })
    const res = await api.post('/user/block', { userId });
    if (res.status !== 200) {
      throw new Error(res.error)
    } else {
      dispatch({ type: types.BLOCK_USER_SUCCESS })
      dispatch(getUserList())
      dispatch(commonUiActions.showToastMessage(res.message, 'success'))
    }
  } catch (error) {
    dispatch({ type: types.BLOCK_USER_FAIL })
    dispatch(commonUiActions.showToastMessage(error.message, 'error'))
  }
}


const forgetPassword = (nickName, userName, email) => async (dispatch) => {
    try {
        dispatch({ type: types.FORGET_PASSWORD_REQUEST })
        const res =  await api.post('/user/forgetpassword', { nickName, userName, email });
        if (res.status !== 200) {
          throw new Error(res.error)
        } else {
          dispatch({ type: types.FORGET_PASSWORD_SUCCESS, payload: res.data.data })
          dispatch(getUserList())
          dispatch(commonUiActions.showToastMessage('새로 변경할 비밀번호를 입력해주세요', 'success'))
        }
    } catch (error) {
        dispatch({ type: types.FORGET_PASSWORD_FAIL })
        dispatch(commonUiActions.showToastMessage(error.message, 'error'))
    }
}

const setNewPassword = (userId, password, navigate) => async (dispatch) => {
    try {
        dispatch({ type: types.SET_PASSWORD_WHEN_FORGET_REQUEST })
        const res =  await api.post('/user/resetpassword', { userId, password })
        if (res.status !== 200) {
          throw new Error(res.error)
        } else {
          dispatch({ type: types.SET_PASSWORD_WHEN_FORGET_SUCCESS });
          dispatch(commonUiActions.showToastMessage('비밀번호가 변경되었습니다', 'success'));
          navigate('/login');
          dispatch({ type: types.SET_FIND_USER, payload: null })
        }
    } catch (error) {
        dispatch({ type: types.SET_PASSWORD_WHEN_FORGET_FAIL });
        dispatch(commonUiActions.showToastMessage(error.message, 'error'));
    }
}


export const userActions = {
  loginWithToken,
  loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
  loginWithFacebook,
  logout,
  updateUser,
  updateGoogleUser,
  register,
  clearError,
  getUserList,
  getUserByNickName,
  followUser,
  unfollowUser,
  blockUser,
  forgetPassword,
  setNewPassword
};
