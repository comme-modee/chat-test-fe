import React, { useState } from 'react';
import '../style/postComment.style.css';
import { useDispatch } from 'react-redux';
import { postActions } from '../action/postAction';

const PostComment = ({ commentList, user, postId }) => {
    const dispatch = useDispatch();
    const [ isOpenEditCommentInput, setIsOpenEditCommentInput ] = useState(false);
    const [ editCommentId, setEditCommentId ] = useState(null);
    const [ editCommentValue, setEditCommentValue ] = useState('');

    const updateComment = (commentId) => {
        dispatch(postActions.updateComment(postId, commentId, editCommentValue))
        setIsOpenEditCommentInput(false)
    }

    const editComment = (id, content) => {
        setIsOpenEditCommentInput(true)
        setEditCommentId(id)
        setEditCommentValue(content)
    }

    const deleteComment = (commentId) => {
        dispatch(postActions.deleteComment(postId, commentId))
    }

    return (
        <>
            {commentList?.map((comment)=>(
                !comment.isDelete && 
                <div className='post-comment' key={comment._id}>
                    <div className='img'><img src={comment.author.profileImage} alt=''/></div>
                    <div className='header'>
                        <div className='left'>
                            <div>{comment.author.nickName}</div>
                            <div className='small-text'>|</div>
                            <div className='small-text'>{comment.createAt.date} {comment.createAt.time}</div>
                        </div>

                        {/* 유저 본인의 댓글일 경우에만 수정/삭제 가능하게 */}
                        { user._id === comment.author._id && editCommentId === comment._id && isOpenEditCommentInput ? 
                            <div className='right small-text'>
                                <div className='cur-point' onClick={() => setIsOpenEditCommentInput(false)}>취소</div>
                                <div className='cur-point' onClick={() => updateComment(comment._id)}>완료</div>
                            </div> : 
                        user._id === comment.author._id ? 
                            <div className='right small-text'>
                                <div className='cur-point' onClick={() => editComment(comment._id, comment.content)}>수정</div>
                                <div className='cur-point' onClick={() => deleteComment(comment._id)}>삭제</div>
                            </div> : ''}

                    </div>
                    <div className='body'>
                        <p>
                            {isOpenEditCommentInput && editCommentId === comment._id ? (
                                <textarea 
                                    className='form-control'
                                    value={editCommentValue}
                                    onChange={(e) => setEditCommentValue(e.target.value)}
                                />
                            ) : ( comment.content )}
                        </p>
                    </div>
                </div>
            ))}
        </>
    )
}

export default PostComment