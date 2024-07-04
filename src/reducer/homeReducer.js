import * as types from "../constants/home.constants";
const initialState = {
  loading: false,
  error: '',
  homePost: [],
  homeMeetUp: [],
  homeQna: []
};

function homeReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.GET_HOME_DATA_REQUEST:
    case types.GET_HOME_MEETUP_DATA_REQUEST:
      return { ...state, loading: true }

    case types.GET_HOME_DATA_SUCCESS:
      return { ...state, loading: false, homePost: payload.homePost, error: '' }

    case types.GET_HOME_MEETUP_DATA_SUCCESS:
      return { ...state, loading: false, homeMeetUp: payload.homeMeetUp, error: '' }

    case types.GET_HOME_DATA_FAIL:
    case types.GET_HOME_MEETUP_DATA_FAIL:
      return { ...state, loading: false, error: payload }

    default:
      return state;
  }
}

export default homeReducer;
