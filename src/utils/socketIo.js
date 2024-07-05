import { io } from 'socket.io-client'
// const REACT_APP_LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND;
const socket = io(REACT_APP_BACKEND)

export default socket;