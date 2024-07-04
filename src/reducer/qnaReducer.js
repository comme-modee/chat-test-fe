import * as types from "../constants/qna.constants";
const initialState = {
    loading: false,
    error: "",
    qnaList: [],
    selectedQnA: null,
    newQnaId: "",
    adminQnaList: []
};

function qnaReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case types.QNA_CREATE_REQUEST:
        case types.QNA_GET_REQUEST:
        case types.GET_QNA_DETAIL_REQUEST:
        case types.QNA_ANSWER_DELETE_REQUEST:
        case types.QNA_ANSWER_ADDLIKE_REQUEST:
        case types.QNA_ANSWER_CREATE_REQUEST:
        case types.BLOCK_QNA_REQUEST:
        case types.GET_ADMIN_QNA_LIST_REQUEST:
            return { ...state, loading: true };

        case types.QNA_CREATE_SUCCESS:
        case types.QNA_ANSWER_UPDATE_SUCCESS:
            return { ...state, loading: false, error: "", newQnaId: payload };

        case types.QNA_ANSWER_CREATE_SUCCESS:
        case types.QNA_ANSWER_DELETE_SUCCESS:
        case types.QNA_ANSWER_ADDLIKE_SUCCESS:
        case types.BLOCK_QNA_SUCCESS:
            return { ...state, loading: false, error: "" };

        case types.QNA_GET_SUCCESS:
            return { ...state, loading: false, qnaList: payload, error: '' };

        case types.GET_ADMIN_QNA_LIST_SUCCESS:
            return { ...state, loading: false, adminQnaList: payload }

        case types.QNA_CREATE_FAIL:
        case types.QNA_GET_FAIL:
        case types.QNA_ANSWER_CREATE_FAIL:
        case types.QNA_ANSWER_DELETE_FAIL:
        case types.QNA_ANSWER_ADDLIKE_FAIL:
        case types.QNA_ANSWER_UPDATE_FAIL:
        case types.BLOCK_QNA_FAIL:
        case types.GET_ADMIN_QNA_LIST_FAIL:
            return { ...state, loading: false, error: payload };

        case types.GET_QNA_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                error: "",
                selectedQna: payload,
            };

        default:
            return state;
    }
}

export default qnaReducer;