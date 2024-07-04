import api from "../utils/api";
import * as types from "../constants/home.constants";
import { toast } from "react-toastify";
import { commonUiActions } from "./commonUiAction";

const getHomePostData = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_HOME_DATA_REQUEST })
        const res = await api.get(`/home`);
        if (res.status !== 200) {
            throw new Error('데이터을 불러오는데 실패하였습니다.')
        } else {
            dispatch({ type: types.GET_HOME_DATA_SUCCESS, payload: res.data.data });
        }
    } catch (error) {
        dispatch({ type: types.GET_HOME_DATA_FAIL, payload: error.message });
        // dispatch(commonUiActions.showToastMessage(error.message, "error"));
    }
};

const getHomeMeetUpData = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_HOME_MEETUP_DATA_REQUEST })
        const res = await api.get(`/home/meetup`);
        if (res.status !== 200) {
            throw new Error('데이터을 불러오는데 실패하였습니다.')
        } else {
            dispatch({ type: types.GET_HOME_MEETUP_DATA_SUCCESS, payload: res.data.data });
        }
    } catch (error) {
        dispatch({ type: types.GET_HOME_MEETUP_DATA_FAIL, payload: error.message });
        // dispatch(commonUiActions.showToastMessage(error.message, "error"));
    }
};

export const homeActions = {
    getHomePostData,
    getHomeMeetUpData,
};
