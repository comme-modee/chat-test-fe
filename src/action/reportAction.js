import api from "../utils/api";
import * as types from "../constants/report.constants";
import { commonUiActions } from "./commonUiAction";

const createReport = (reportedUserId, postId, meetUpId, qnaId, contentType, reasons) => async (dispatch) => {
  try {
        dispatch({type: types.CREATE_REPORT_REQUEST})
        const res = await api.post('/report', {
            reportedUserId,
            postId,
            meetUpId,
            qnaId,
            contentType,
            reasons
        })
        if(res.status !== 200) {
            throw new Error('신고접수에 실패하였습니다.')
        } else {
            dispatch({type: types.CREATE_REPORT_SUCCESS})
            dispatch(commonUiActions.showToastMessage(res.data.message, "success"))
        }
  } catch (error) {
        dispatch({type: types.CREATE_REPORT_FAIL, payload: error.message})
        dispatch(commonUiActions.showToastMessage(error.message, "error"))
  }
};

const updateReport = (reportId) => async (dispatch) => {
  try {
      dispatch({type: types.UPDATE_REPORT_REQUEST});
      const res = await api.put(`/report`, { reportId });
      if(res.status !== 200) {
        throw new Error('신고 승인에 실패하였습니다.')
    } else {
        dispatch({type: types.UPDATE_REPORT_SUCCESS, payload: res.data.data})
        dispatch(commonUiActions.showToastMessage(res.data.message, "success"))
        dispatch(getAllReport())
    }
  } catch (error) {
    dispatch({type: types.UPDATE_REPORT_FAIL, payload: error.message})
    dispatch(commonUiActions.showToastMessage(error.message, "error"))
  }
};

const getAllReport = () => async (dispatch) => {
  try {
        dispatch({type: types.GET_ALL_REPORT_REQUEST})
        const res = await api.get('/report')
        if(res.status !== 200) {
            throw new Error(res.data.message)
        } else {
            dispatch({type: types.GET_ALL_REPORT_SUCCESS, payload: res.data.data.reportList})
            dispatch(commonUiActions.showToastMessage(res.data.message, "success"))
        }
  } catch (error) {
        dispatch({type: types.GET_ALL_REPORT_FAIL, payload: error.message})
        // dispatch(commonUiActions.showToastMessage(error.message, "error"))
  }
}




export const reportActions = {
  createReport,
  updateReport,
  getAllReport
};
