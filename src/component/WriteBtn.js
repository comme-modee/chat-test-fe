import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

const WriteBtn = ({ type }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className='new-post-btn white-btn' onClick={() => navigate(`/${type}/write?type=new`)}>
                <FontAwesomeIcon icon={faPencil}/>
                <span>
                    {type === 'post' ? '포스트 등록' : type === 'qna' ? '질문 등록' : '모임 등록'}
                </span>
            </div>
        </>
    )
}

export default WriteBtn