import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { chatActions } from '../action/chatAction';
import '../style/chat.style.css';
import chatIcon from '../asset/img/chat-icon.png';
import socket from '../utils/socketIo'
import { SET_USER_ONLINE_STATE } from '../constants/user.constants'

const ChatBtn = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { chatRoomList } = useSelector((state) => state.chat);
    const [ message, setMessage ] = useState("");
    const [ selectedChatRoom, setSelectedChatRoom ] = useState("");
    const [ selectedChatRoomMessageList, setSelectedChatRoomMessageList ] = useState("");
    const [ messageList, setMessageList ] = useState([]);
    const [ isGoBackBtnShow, setIsGoBackBtnShow ] = useState(false);
    const chatRoom = useRef(null);
    const chatIn = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(chatActions.getChatRoomList())
    },[])

    useEffect(() => {
        socket.emit('user', (user._id), (res) => {
            if(res?.ok) {
                dispatch({type: SET_USER_ONLINE_STATE, payload: res.data})
            } else {
                console.log(res.error)
            }
        })
    },[user.online.online])
    
    useEffect(() => { 

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (chatRoom.current && !chatRoom.current.contains(event.target) && !event.target.closest('.chat-icon')) {
            backToChatRoomList()
            chatRoom.current.style.right = '-500px';
        }
    }

    //메세지가 업데이트될때마다 스크롤을 부드럽게 아래로 내림
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    
    const enterChatRoomAndScrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    };

    useEffect(() => {
        //채팅방에 입장하면 스크롤을 맨 아래로 내림
        enterChatRoomAndScrollToBottom()
    },[selectedChatRoomMessageList])

    const backToChatRoomList = () => {
        //채팅창 사라지는 시간(0.5s)이 지난 후에 밑의 로직이 실행됨.
        setTimeout(() => {
           //메세지를 전송하고 채팅목록으로 돌아갈때 업데이트된 내용의 채팅목록을 보여주기 위함
            dispatch(chatActions.getChatRoomList())
            setSelectedChatRoom('')
            setSelectedChatRoomMessageList([])
            if(chatRoomList.length > 0) {
                chatIn.current.style.display = 'none';
            } 
            setMessage('')
            setMessageList([])
            setIsGoBackBtnShow(false) 
        }, 500);
    }

    const handleChatRoom = () => {
        chatRoom.current.style.right = '0px';
    }

    const sendMessage = (e) => {
        e.preventDefault();
                                    //어떤 유저가 어떤 메세지를 어떤 채팅방에 보냈는지
        socket.emit('sendMessage', { roomId: selectedChatRoom.roomId._id, message, userId: user._id }, (res) => {
            //입장한 채팅방에 메세지를 보냄.
            console.log(res)
        })
        setMessage('')
    }

    //하나의 채팅방에 입장
    const enterChatRoom = (roomId) => {
        socket.emit('enterChatRoom', roomId, (res) => {
            //채팅방에 입장하면 roomId를 통해 채팅내용을 소켓이 보내준다.
            //res.data = chatMessageList
            if(res?.ok) {
                setSelectedChatRoomMessageList(res.data)
            } else {
                console.log(res.error)
            }
        })
    }

    const showChatIn = () => {
        if(chatRoomList.length > 0) {
            chatIn.current.style.display = 'flex';
        }
        setIsGoBackBtnShow(true);
    }

    useEffect(() => {
        //백엔드에서 전해주는 newMessage를 io가 여기서 알려줌
        socket.on('message', (message) => setMessageList([...messageList, message]))
        scrollToBottom()
    }, [messageList])
    

    return (
        <>
            <div className='chat-room' ref={chatRoom}>
                <div className='back-btn' onClick={() => backToChatRoomList()}>{isGoBackBtnShow ? <><FontAwesomeIcon icon={faChevronLeft}/> 채팅목록</> : <FontAwesomeIcon icon={faClose} onClick={() => chatRoom.current.style.right = '-500px'}/>}</div>
                <div className={`${isGoBackBtnShow ? 'chat-room-title' : 'header'}`}>{isGoBackBtnShow ? selectedChatRoom?.roomId?.title : '채팅목록'}</div>
                
                <div className='chat-list'>
                {chatRoomList.length > 0 ?
                <React.Fragment>
                    {/* 채팅방 입장 */}
                    <div className='chat-in' ref={chatIn}>
                        <div className="chat-messages">
                            {selectedChatRoomMessageList.length > 0 &&
                             selectedChatRoomMessageList.map((message, index) => (
                                <div 
                                    key={`chat-${index}`} 
                                    className={message.systemMessage ? 'system' : message.nickName === user.nickName ? "sender" : "recipient"}
                                >
                                    {message.systemMessage ? <div>{message.systemMessage}</div>
                                    :
                                    message.nickName === user.nickName ? 
                                        <>
                                            <div className="right">
                                                <span className="message">{message.message}</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="left small-profile-img"><img src={message.profileImage} alt=''/></div>
                                            <div className="right">
                                                <span className="user">{message.nickName}</span>
                                                <span className="message">{message.message}</span>
                                            </div>
                                        </>
                                    }
                                </div>
                            ))}
                            {messageList?.map((message, index) => (
                                <div 
                                    key={`chat-${index}`} 
                                    className={message.systemMessage ? 'system' : message.nickName === user.nickName ? "sender" : "recipient"}
                                >
                                    {message.systemMessage ? <div>{message.systemMessage}</div>
                                    :
                                    message.nickName === user.nickName ? 
                                        <>
                                            <div className="right">
                                                <span className="message">{message.message}</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="left small-profile-img"><img src={message.profileImage} alt=''/></div>
                                            <div className="right">
                                                <span className="user">{message.nickName}</span>
                                                <span className="message">{message.message}</span>
                                            </div>
                                        </>
                                    }
                                </div>
                            ))}
                            <div ref={messagesEndRef}></div>
                        </div>
                        <div className="chat-input">
                            <form onSubmit={(e) => sendMessage(e)} className='form-control'>
                                <input
                                    type="text"
                                    placeholder="메시지를 입력하세요"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyUp={(e) => e.key === 'Enter' ? sendMessage : null}
                                />
                                <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
                            </form>
                        </div>
                        </div>

                        {/* 채팅방 목록 */}
                        {chatRoomList?.map((chatRoom) => 
                            <div 
                                key={chatRoom?._id} 
                                className='chat' 
                                onClick={() => { 
                                    enterChatRoom(chatRoom?.roomId?._id);
                                    showChatIn();
                                    setMessageList([]) //selectedChatRoomMessageList 내용과 중복되어 보여지는 현상이 있어 채팅방을 들어갈때 messageList는 지워줌.
                                    setSelectedChatRoom(chatRoom)
                                }}
                            >
                                <div className='content'>
                                    <div className='left'>
                                        <div className='img'>
                                            <img src={chatRoom?.roomId?.image} alt=''/>
                                        </div>
                                        <div 
                                            className={`category ${chatRoom?.roomId?.category === '독서' ? 'green' :
                                                                    chatRoom?.roomId?.category === '프로젝트' ? 'violet' :
                                                                    chatRoom?.roomId?.category === '강의' ? 'blue' : 'red'
                                            }`}>
                                            {chatRoom?.roomId?.category}
                                        </div>
                                    </div>
                                    <div className='right'>
                                        <div className='room-title'>
                                            <span className='title'>{chatRoom?.roomId?.title}</span>
                                            <span className='participants-num'>{chatRoom?.roomId?.currentParticipants}</span>
                                        </div>
                                        <div className='room-latest-chat'>{chatRoom?.chat[chatRoom.chat.length - 1]?.message || ''}</div>
                                    </div>
                                </div>
                                {/* <div className='new'>1</div> */}
                            </div>
                        )}
                    </React.Fragment>
                    :
                    //채팅목록이 없을시
                    <div className='no-chat-list'>
                        <div>채팅목록이 없습니다.</div>
                        <br/>
                        <div>새 모임을 등록하거나 기존 모임에 참여하면</div>
                        <div>모임원들과 채팅이 가능합니다.</div>
                    </div>
                    }
                    </div>
                </div>
                

            <div className="chat-icon" onClick={() => handleChatRoom()}>
                <img src={chatIcon} alt='채팅아이콘'/>
            </div>
        </>
    )
}

export default ChatBtn;
