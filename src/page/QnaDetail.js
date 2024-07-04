import React, { useEffect } from "react";
import WriteBtn from "../component/WriteBtn";
import MarkdownEditor from "@uiw/react-md-editor";
import { useState } from "react";
import "../style/qnaDetail.style.css";
import Answer from "../component/Answer";
import AnswerInput from "../component/AnswerInput";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { qnaActions } from "../action/qnaAction";
import { commonUiActions } from "../action/commonUiAction";
import { reportActions } from "../action/reportAction";
import { Button, Dropdown, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const reasons = [ 
    '스팸홍보/도배글입니다.',
    '음란물입니다.',
    '불법정보를 포함하고 있습니다.',
    '청소년에게 유해한 내용입니다.',
    '욕설/생명경시/혐오/차별적 표현입니다.',
    '개인정보 노출 게시물입니다.',
    '불쾌한 표현이 있습니다.',
    '명예훼손 또는 저작권이 침해되었습니다.',
    '불법촬영물 등이 포함되어 있습니다.'
];

const initialCheckboxStates = reasons.reduce((acc, reason) => {
    acc[reason] = false;
    return acc;
}, {});

const QnaDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedQna } = useSelector((state) => state.qna);
    const { user } = useSelector((state) => state.user);
    const { id } = useParams();
    const [markDown, setMarkdown] = useState("");

    const [ isMyPost, setIsMyPost ] = useState(false);
    const [ isReportModalOpen, setIsReportModalOpen ] = useState(false);
    const [ checkboxStates, setCheckboxStates ] = useState(initialCheckboxStates);

    useEffect(()=>{
        if(selectedQna && user && selectedQna.author._id === user._id) {
            setIsMyPost(true)
        } else {
            setIsMyPost(false)
        }
    },[selectedQna, user])

    useEffect(() => {
        dispatch(qnaActions.getQnaDetail(id));
    }, [id, dispatch]);

    useEffect(() => {
        selectedQna && setMarkdown(selectedQna.content);
    }, [selectedQna]);

    const sendReport = () => {
        const reportedUserId = selectedQna.author._id;
        const postId = undefined;
        const meetUpId = undefined;
        const qnaId = selectedQna._id;
        const reasons = Object.keys(checkboxStates).filter(key => checkboxStates[key] === true);
        const contentType = 'QnA';
        if(reasons.length === 0) {
            dispatch(commonUiActions.showToastMessage('신고 사유를 선택해주세요.', 'error'))
            return
        }
        dispatch(reportActions.createReport(reportedUserId, postId, meetUpId, qnaId, contentType, reasons))
        setIsReportModalOpen(false)
    }
  
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxStates(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleDelete = () => {
        if (window.confirm("정말로 이 QnA를 삭제하시겠습니까?")) {
            dispatch(qnaActions.deleteQna(id));
            navigate('/qna')
        }
    };

    const handleUpdate = () => {
        dispatch(qnaActions.getQnaDetail(id));
        navigate("/qna/write?type=update");
    };

    return (
        <>
            {/* 신고모달 */}
            <Modal show={isReportModalOpen} onHide={() => setIsReportModalOpen(false)} dialogClassName='modal-dialog-centered' size='md'>
                <Modal.Header closeButton>
                    <h5 className="modal-title">신고하기</h5>
                </Modal.Header>
                <Modal.Body>
                    <div><strong>작성자</strong>: {selectedQna?.author.nickName}</div>
                    <div><strong>질문 제목</strong>: {selectedQna?.title}</div>
                    <hr/>
                    <div>
                    <strong>사유선택</strong>
                    <Form>
                        {reasons && reasons.map((reason, index) => (
                            <Form.Check
                                key={`${index}`}
                                id={`reason-${index+1}`}
                                type={'checkbox'}
                                name={reason}
                                label={reason}
                                checked={checkboxStates[reason]}
                                onChange={handleCheckboxChange}
                            />
                        ))}
                    </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setIsReportModalOpen(false)}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={sendReport}>
                        신고하기
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <div className="contents-header-btns">
                    <WriteBtn type="qna" />
                </div>

                <div className="qna-detail-container">
                    <div className="qna-detail-q-container">
                        <div className="title">{selectedQna?.title}</div>
                        <div className='detail-page-user-container'>
                            <div className='author'>
                                <span className='img'><img src={selectedQna?.author.profileImage} alt=''/></span>
                                <span className='user-name' onClick={() => navigate(`/me/${selectedQna?.author.nickName}`)}>{selectedQna?.author.nickName}</span>
                                <span className='small-text'>{selectedQna?.createAt.date} {selectedQna?.createAt.time}</span>
                            </div>

                            {isMyPost ? 
                            <Dropdown>
                                <Dropdown.Toggle variant='none'>
                                    <FontAwesomeIcon icon={faEllipsisVertical}/> 
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleUpdate()}>수정하기</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDelete()} variant='danger'>삭제하기</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> : 

                            <Dropdown>
                                <Dropdown.Toggle variant='none'>
                                    <FontAwesomeIcon icon={faEllipsisVertical}/> 
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {/* <Dropdown.Item onClick={() => setIsScrapModalOpen(true)}>스크랩하기</Dropdown.Item> */}
                                    <Dropdown.Item onClick={() => setIsReportModalOpen(true)}>신고하기</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>}
                        </div>
                        <div className="question">
                            <MarkdownEditor.Markdown
                                style={{ padding: 10 }}
                                source={markDown}
                            />
                        </div>
                    </div>
                    <div className="qna-detail-q-container">
                        <AnswerInput/>
                    </div>
                    
                    <div className="question-num no-drag">{`${selectedQna?.answerCount}개의 답변`}</div>

                    {selectedQna?.answers.map((answer) => (
                        <div className="answer" key={answer._id}>
                            <Answer answer={answer}/>
                        </div>
                    ))}
                </div>
            </div>
        </>
        
    );
};

export default QnaDetail;
