import * as types from "../constants/chat.constants";

const initialState = {
    loading: false,
    error: '',
    chatRoomList: []
};

function chatReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.GET_CHAT_ROOM_LIST_REQUEST:
      return { ...state, loading: true }

    case types.GET_CHAT_ROOM_LIST_SUCCESS:
        return { ...state, loading: false, chatRoomList: payload }

    case types.GET_CHAT_ROOM_LIST_FAIL:
      return { ...state, loading: false, error: payload }

    default:
      return state;
  }
}

export default chatReducer;