import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomePostCard from '../component/home/HomePostCard';
import HomeQnaCard from '../component/home/HomeQnaCard';
import HomeMeetUpCard from '../component/home/HomeMeetUpCard';
import '../style/home.style.css';
import { homeActions } from '../action/homeAction';
import { qnaActions } from '../action/qnaAction';

const Home = () => {
  const dispatch = useDispatch();
  const { homePost, homeMeetUp } = useSelector((state) => state.home);
  const { qnaList } = useSelector((state) => state.qna);

    
  useEffect(() => {
    dispatch(homeActions.getHomePostData())
    dispatch(homeActions.getHomeMeetUpData());
    dispatch(qnaActions.getQnaList());
  },[])

  return (
    <div className='home'>
        <div className='main-title'>
            <div>Our</div>
            <div className='italic'>Creative, Passionate, Inquisitive</div>
            <div>Coding Story.</div>
        </div>
        <h5 className='sub-title'>데빙에서 개발자들의 다양한 이야기들을 만나보세요.</h5>
        <div className='post-container'>{homePost?.map((post)=><HomePostCard key={post._id} post={post}/>)}</div>
        <div className='meet-up-container'>{homeMeetUp?.map((meetUp) => <HomeMeetUpCard key={meetUp._id} meetUp={meetUp}/>)}</div>
        <div className='qna-container'>{qnaList?.map((qna) => <HomeQnaCard key={qna._id} qna={qna}/>)}</div>
    </div>
  )
}

export default Home