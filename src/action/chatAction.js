import api from "../utils/api"
import * as types from "../constants/chat.constants";
import { commonUiActions } from "./commonUiAction";

const getChatRoomList = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_CHAT_ROOM_LIST_REQUEST})
        const res = await api.get('/chat')
        if(res.status === 200) {
            dispatch({ type: types.GET_CHAT_ROOM_LIST_SUCCESS, payload: res.data.chatRoomList})
        } else {
            throw new Error('채팅방 리스트를 가져오는데 실패하였습니다')
        }
    } catch (error) {
        console.log(error.message)
        dispatch({ type: types.GET_CHAT_ROOM_LIST_FAIL, payload: error.message})
    }
}

export const chatActions = {
    getChatRoomList
}