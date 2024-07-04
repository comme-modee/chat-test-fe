import React from 'react'
import { useNavigate } from 'react-router-dom';

const HomeQnaCard = ({ qna }) => {
  const navigate = useNavigate();

    const goToQnaDetail = () => {
        navigate(`/qna/${qna._id}`);
    }
  return (
    <div className='home-qna-card' onClick={() => goToQnaDetail()}>
      <div className='content'>
        <div className='title'>{qna.title}</div>
        <div className='content'>{qna.content.replace(/!\[image\]\(.*?\)|#/g, '')}</div>
      </div>
      <div className='bottom'>
        <div className='user'>
          <div className='small-profile-img'>
            <img src={qna.author.profileImage} alt="프로필 이미지" />
          </div>
          <span>{qna.author.nickName}</span>
        </div>
        <div className='info'>
          <div className={`category ${qna.category}`}>{qna.category === 'tech' ? '기술' : qna.category === 'career' ? '커리어' : '기타' }</div>
          <div className='answers'>답변 <span>{qna.answers.length}</span></div>
        </div>
      </div>
    </div>
  )
}

export default HomeQnaCard