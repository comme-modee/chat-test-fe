import React from 'react';
import noImg from '../../asset/img/no-image.png'
import { useNavigate } from 'react-router-dom';

const HomePostCard = ({ post }) => {
  const navigate = useNavigate();
  const showPostDetail = () => {
    //포스트 디테일 페이지로 가기
    navigate(`/post/${post._id}`);
  }
  return (
    <div className='home-post-card' onClick={() => showPostDetail(post._id)}>
        <div className='img'><img src={post.image || noImg} alt=''/></div>
        <div className='contents'>
          <div className='small-text'>
            <span className='like'>좋아요 <span className='coral'>{post.likes}</span></span>
            <span className='comments'>댓글 <span className='green'>{post.commentCount}</span></span>
            <span className='scrap'>스크랩 <span className='blue'>{post.scrapCount}</span></span>
          </div>
          <div className='title'>
            <p>{post.title}</p>
          </div>
          <div className='author'>
            <div>{post.pageName}</div>
            <div className='small-text'>by {post.author.nickName}</div>
          </div>
        </div>
    </div>
  )
}

export default HomePostCard