import * as types from "../constants/report.constants";
const initialState = {
    loading: false,
    error: '',
    reportList: [],
    selectedReport: null,
    reportedUser: null
};

function reportReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.CREATE_REPORT_REQUEST:
    case types.GET_ALL_REPORT_REQUEST:
    case types.UPDATE_REPORT_REQUEST:
      return { ...state, loading: true }

    case types.CREATE_REPORT_SUCCESS:
      return { ...state, loading: false, error: ''}

    case types.GET_ALL_REPORT_SUCCESS:
        return { ...state, loading: false, reportList: payload }

    case types.UPDATE_REPORT_SUCCESS:
        return { ...state, loading: false, selectedReport: payload.report, reportedUser: payload.user }
        
    case types.CREATE_REPORT_FAIL:
    case types.GET_ALL_REPORT_FAIL:
    case types.UPDATE_REPORT_FAIL:
      return { ...state, loading: false, error: payload }

    default:
      return state;
  }
}

export default reportReducer;