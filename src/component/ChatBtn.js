import React, { useEffect, useRef, useState } from 'react'
import chatIcon from '../asset/img/chat-icon.png';
import '../style/chat.style.css';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import socket from "../utils/server";

const ChatBtn = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [ message, setMessage ] = useState("");
    // const [ messageList, setMessageList ] = useState([]);
    const [ isGoBackBtnShow, setIsGoBackBtnShow ] = useState(false);
    const chatRoom = useRef(null);
    const chatIn = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.emit('chatIn', user.nickName, user._id, (res) => {
            console.log('채팅에 들어간 후 백엔드에서 온 응답', res)
        })
    },[user])
    
    // useEffect(() => { 

    //     document.addEventListener('click', handleClickOutside);

    //     return () => {
    //         document.removeEventListener('click', handleClickOutside);
    //     };
    // }, []);

    // const handleClickOutside = (event) => {
    //     if (chatRoom.current && !chatRoom.current.contains(event.target) && !event.target.closest('.chat-icon')) {
    //         chatRoom.current.style.right = '-500px';
    //     }
    // }

    // //메세지가 업데이트될때마다 스크롤을 부드럽게 아래로 내림
    // const scrollToBottom = () => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // };
    
    // //메세지가 업데이트될때마다 스크롤을 부드럽게 아래로 내림
    // const enterChatRoomAndScrollToBottom = () => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView();
    //     }
    // };


    const handleChatRoom = () => {
        chatRoom.current.style.right = '0px';
    }

    const sendMessage = () => {

    }


    return (
        <>

            <div className='chat-room' ref={chatRoom}>
                <div className='chat-list'>


                        <div className="chat-input">
                            <form onSubmit={sendMessage} className='form-control'>
                                <input
                                    type="text"
                                    placeholder="메시지를 입력하세요"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
                            </form>
                        </div>
                    </div>

                </div>

                
            <div className="chat-icon" onClick={() => handleChatRoom()}>
                <img src={chatIcon} alt='채팅아이콘'/>
            </div>
        </>
    )
}

export default ChatBtn;
