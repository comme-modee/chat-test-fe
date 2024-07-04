import React, { useEffect, useState } from 'react';
import '../style/postCard.style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as emptyHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import noImg from '../asset/img/no-image.png';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../action/postAction';

const PostCard = ({ post, searchQuery }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const toggleLike = (id) => {
    dispatch(postActions.toggleLike(id, searchQuery))
  }

  const showPostDetail = () => {
    //포스트 디테일 페이지로 가기
    navigate(`/post/${post._id}`);
  }

  return (
    <div className='post-card'>
      <div className='like'>
        <span>
          <FontAwesomeIcon icon={post.userLikes.includes(user._id) ? fullHeart : emptyHeart} className='coral' onClick={() => toggleLike(post._id)}/>
        </span>
        <span>좋아요 <span className='coral'>{post.likes}</span></span>
        <span>댓글 <span className='green'>{post.commentCount}</span></span>
        <span>스크랩 <span className='blue'>{post.scrapCount}</span></span>
      </div>
      <div className='contents' onClick={() => showPostDetail(post._id)}>
        <div className='info'>
          <div className='title'>
            <p>{post.title}</p>
          </div>
          <div className='content'>
            <p>{post.content.replace(/!\[image\]\(.*?\)|#/g, '')}</p>
          </div>
          <div className='author'>
            <span className='img'><img src={post.author.profileImage} alt=''/></span>
            <span className='user-name'>{post.author.nickName}</span>
            <span className='date small-text'>{post.createAt.date} {post.createAt.time}</span>
          </div>
        </div>
        <div className='thumbnail'>
          <img src={post.image || noImg} alt=''/>
        </div>
      </div>
    </div>
  )
}

export default PostCard