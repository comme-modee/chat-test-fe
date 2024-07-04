import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/postDetail.style.css';
import PostComment from '../component/PostComment';
import CommnetInput from '../component/CommentInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faEllipsisVertical, faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as emptyHeart } from '@fortawesome/free-regular-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../action/postAction';
import WriteBtn from '../component/WriteBtn';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import MarkdownEditor from '@uiw/react-md-editor';
import { reportActions } from '../action/reportAction';
import { commonUiActions } from '../action/commonUiAction';

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

const PostDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedPost } = useSelector((state) => state.post);
    const { user } = useSelector((state) => state.user);
    const [ isMyPost, setIsMyPost ] = useState(false);
    const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
    const [ isReportModalOpen, setIsReportModalOpen ] = useState(false);
    const [ isScrapModalOpen, setIsScrapModalOpen ] = useState(false);
    const [ isScrapPrivate, setIsScrapPrivate ] = useState(false);
    const [ checkboxStates, setCheckboxStates ] = useState(initialCheckboxStates);
    const [ showComments, isShowComments ] = useState(false);

    useEffect(()=>{
        if(!isReportModalOpen) {
            setCheckboxStates(initialCheckboxStates)
        }
    },[isReportModalOpen])

    useEffect(()=>{
        dispatch(postActions.getPostDetail(id))
    },[id, dispatch])

    useEffect(()=>{
        if(selectedPost && user && selectedPost.author._id === user._id) {
            setIsMyPost(true)
        } else {
            setIsMyPost(false)
        }
    },[selectedPost, user])

    const deletePost = () => {
        dispatch(postActions.deletePost(id, navigate))
    }

    const toggleLike = (id) => {
        dispatch(postActions.toggleLike(id))
    }

    const addScrap = () => {
        dispatch(postActions.addScrap(selectedPost._id, isScrapPrivate))
        setIsScrapModalOpen(false)
        setIsScrapPrivate(false)
    }

    const sendReport = () => {
        const reportedUserId = selectedPost.author._id;
        const meetUpId = undefined;
        const qnaId = undefined;
        const postId = selectedPost._id;
        const reasons = Object.keys(checkboxStates).filter(key => checkboxStates[key] === true);
        const contentType = 'Post';
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
        
    return (
        <>
            {/* 스크랩모달 */}
            <Modal show={isScrapModalOpen} onHide={() => { setIsScrapModalOpen(false); setIsScrapPrivate(false); }} dialogClassName='modal-dialog-centered' size='md'>
                <Modal.Header closeButton>
                  <h5 className="modal-title">MY DEV로 스크랩하기</h5>
                </Modal.Header>
                <Modal.Body>
                  <div><strong>작성자</strong>: {selectedPost?.author.nickName}</div>
                  <div><strong>글 제목</strong>: {selectedPost?.title}</div>
                  <hr/>
                  <div>
                    <strong>비공개로 스크랩</strong><span className='small-text'> 선택하지 않을 경우, 공개로 스크랩됩니다.</span>
                    <Form>
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                            // label=""
                            checked={isScrapPrivate}
                            onChange={() => setIsScrapPrivate(prev => !prev)}
                        />
                    </Form>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light" onClick={() => { setIsScrapModalOpen(false); setIsScrapPrivate(false); }}>
                    취소
                  </Button>
                  <Button variant="success" onClick={addScrap}>
                    확인
                  </Button>
                </Modal.Footer>
            </Modal>

            {/* 신고모달 */}
            <Modal show={isReportModalOpen} onHide={() => setIsReportModalOpen(false)} dialogClassName='modal-dialog-centered' size='md'>
                <Modal.Header closeButton>
                  <h5 className="modal-title">신고하기</h5>
                </Modal.Header>
                <Modal.Body>
                  <div><strong>작성자</strong>: {selectedPost?.author.nickName}</div>
                  <div><strong>글 제목</strong>: {selectedPost?.title}</div>
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

            {/* 삭제모달 */}
            <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} dialogClassName='modal-dialog-centered' size='sm'>
                <Modal.Header closeButton>
                  <h5 className="modal-title">포스트 삭제</h5>
                </Modal.Header>
                <Modal.Body>
                  정말 삭제하시겠습니까?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
                    취소
                  </Button>
                  <Button variant="danger" onClick={deletePost}>
                    삭제
                  </Button>
                </Modal.Footer>
            </Modal>

            <div className='contents-header-btns'>
                <WriteBtn type='post'/>
            </div>
            <div className="post-detail-card">
                <div className='title'>{selectedPost?.title}</div>
                <div className='detail-page-user-container'>
                    <div className='author'>
                        <span className='img'><img src={selectedPost?.author.profileImage} alt=''/></span>
                        <span className='user-name' onClick={() => navigate(`/me/${selectedPost?.author.nickName}`)}>{selectedPost?.author.nickName}</span>
                        <span className='small-text'>{selectedPost?.createAt.date} {selectedPost?.createAt.time}</span>
                    </div>

                    {isMyPost ? 
                    <Dropdown>
                        <Dropdown.Toggle variant='none'>
                            <FontAwesomeIcon icon={faEllipsisVertical}/> 
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate(`/post/write?type=edit&id=${id}`)}>수정하기</Dropdown.Item>
                            <Dropdown.Item onClick={() => setIsDeleteModalOpen(true)} variant='danger'>삭제하기</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> : 

                    <Dropdown>
                        <Dropdown.Toggle variant='none'>
                            <FontAwesomeIcon icon={faEllipsisVertical}/> 
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setIsScrapModalOpen(true)}>스크랩하기</Dropdown.Item>
                            <Dropdown.Item onClick={() => setIsReportModalOpen(true)}>신고하기</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>}
                
                </div>
                <div className='contents' data-color-mode='light'>
                    <MarkdownEditor.Markdown style={{ padding: 10 }} source={selectedPost?.content} />
                    <div className='tags'>
                        {selectedPost?.tags.map((tag, index) => <span key={index} className='tag' onClick={() => navigate(`/post?tag=${tag}`)}>#{tag}</span>)}
                    </div>
                </div>
            </div>


            <div className='contents-footer'>
                <div className='like-comment-num'>

                    <div className='display-flex light-btn small-btn'>
                        <div className='like' onClick={() => toggleLike(selectedPost._id)}>
                            <FontAwesomeIcon icon={selectedPost?.userLikes.some(like => like._id === user._id) ? fullHeart : emptyHeart} className='coral'/> 좋아요 
                            <span className='coral'>{selectedPost?.likes}</span>
                        </div>
                        
                        <Dropdown>
                            <Dropdown.Toggle variant='none'>
                            </Dropdown.Toggle>
                            {selectedPost?.likes !== 0 && <Dropdown.Menu>
                                {selectedPost?.userLikes.map((user) => 
                                    <Dropdown.Item key={user._id} onClick={() => navigate(`/me/${user.nickName}`)}>
                                        <div className='small-profile-img'>
                                            <img src={user.profileImage} alt=''/>
                                        </div>{user.nickName}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>}
                        </Dropdown>
                    </div>

                    <div className='display-flex light-btn small-btn' onClick={() => isShowComments(prev => !prev)}>
                        <FontAwesomeIcon icon={faComments} className='green'/> 댓글 
                        <span className='green'>{selectedPost?.commentCount}</span>
                        <span className={`${showComments ? 'small-toggle-btn-active' : 'small-toggle-btn'}`}></span>
                    </div>

                    <div className='display-flex light-btn small-btn'>
                        <FontAwesomeIcon icon={faBookBookmark} className='blue'/> 스크랩 
                        <span className='blue'>{selectedPost?.scrapCount}</span>
                    </div>

                </div>
                <div className='edit-delete-btns'>
                    {isMyPost ? (
                        <>
                            <div className='white-btn small-btn' onClick={() => navigate(`/post/write?type=edit&id=${id}`)}>수정</div>
                            <div className='coral-btn small-btn ml-1' onClick={() => setIsDeleteModalOpen(true)}>삭제</div>
                        </>
                    ) : (
                        <>
                            <div className='blue-btn small-btn' onClick={() => setIsScrapModalOpen(true)}>스크랩</div>
                            <div className='coral-btn small-btn ml-1' onClick={() => setIsReportModalOpen(true)}>신고</div>
                        </>
                    )}
                </div>
            </div>
            {showComments ? 
                <PostComment commentList={selectedPost?.comments} user={user} postId={selectedPost?._id}/>
            : ''}
            <CommnetInput isShowComments={isShowComments}/>
        </>
    )
}

export default PostDetail