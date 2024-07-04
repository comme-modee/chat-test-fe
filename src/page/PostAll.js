import '../style/postAll.style.css';
import '../style/switch.style.css';
import React, { useEffect, useState } from 'react';
import PostCard from '../component/PostCard';
import WriteBtn from '../component/WriteBtn';
import ErrorCard from '../component/ErrorCard';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../action/postAction';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import * as types from "../constants/post.constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const PostAll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ query, setQuery ] = useSearchParams();
  const [ keywordValue, setKeywordValue ] = useState('');
  const [ tagValue, setTagValue ] = useState(query.get('tag') || '');
  const { postList, error } = useSelector((state) => state.post);
  const { isFollowing } = useSelector((state) => state.post);
  const [ isFollowingState, setIsFollowingState ] = useState(isFollowing);
  
  const [ searchQuery, setSearchQuery ] = useState({
    tag: query.get("tag") || '',
    type: query.get("type") || '',
    keyword: query.get("keyword") || '',
    isFollowing: isFollowing,
  });

  const updateQueryParams = () => {
    const { tag, keyword, type } = searchQuery;
    const queryParams = new URLSearchParams();
    
    if (tag) queryParams.set('tag', tag);
    if (keyword) queryParams.set('keyword', keyword);
    if (type) queryParams.set('type', type);

    navigate(`/post?${queryParams.toString()}`);
  };

  useEffect(()=>{
    if(query.size === 0) {
      setTagValue('')
      setKeywordValue('')
      setSearchQuery({ ...searchQuery, tag: '', keyword: '', type: '' })
      dispatch(postActions.getPostList({ ...searchQuery }));
    }
  },[query])

  useEffect(() => {
    dispatch(postActions.getPostList({ ...searchQuery }));
    updateQueryParams();
  }, [searchQuery.isFollowing, searchQuery.tag, searchQuery.type, searchQuery.keyword]);

  useEffect(()=>{
    dispatch({type: types.SET_ISFOLLOWING, payload: isFollowingState})
    setSearchQuery({ ...searchQuery, isFollowing: isFollowingState })
  },[isFollowingState])

  const searchKeywordByEnter = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(prevState => ({
        ...prevState,
        keyword: e.target.value || ''
      }));
      updateQueryParams();
    }
  };

  const searchKeywordBySearchIcon = () => {
    setSearchQuery(prevState => ({
      ...prevState,
      keyword: keywordValue || ''
    }));
    updateQueryParams();
  }

  const searchTagByEnter = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(prevState => ({
        ...prevState,
        tag: e.target.value || ''
      }));
      updateQueryParams();
    }
  };

  const searchTagBySearchIcon = () => {
    setSearchQuery(prevState => ({
      ...prevState,
      tag: tagValue || ''
    }));
    updateQueryParams();
  }

  const getPostListByType = (type) => {
    setSearchQuery(prevState => ({
      ...prevState,
      type: type
    }));
    updateQueryParams();
  };

  return (
    <div className='post-all-container'> 

      <div className='contents-header-btns post-header-btns'>
        <div>
          <div className='form-control search-input'>
            <input 
              type='text' 
              placeholder='태그를 입력하세요' 
              value={tagValue}
              onKeyUp={(e) => searchTagByEnter(e)}
              onChange={(e) => setTagValue(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} onClick={() => searchTagBySearchIcon()}/>
          </div>
          <div className='form-control search-input'>
            <input 
              type='text' 
              placeholder='검색어를 입력하세요' 
              value={keywordValue}
              onKeyUp={(e) => searchKeywordByEnter(e)}
              onChange={(e) => setKeywordValue(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} onClick={() => searchKeywordBySearchIcon()}/>
          </div>
        </div>
        
        <div>
          <Dropdown>
            <Dropdown.Toggle className='gradient-btn-blue'>
              정렬
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => getPostListByType('popularity')}>좋아요 순</Dropdown.Item>
              <Dropdown.Item onClick={() => getPostListByType('comments')}>댓글 순</Dropdown.Item>
              <Dropdown.Item onClick={() => getPostListByType('scrap')}>스크랩 순</Dropdown.Item>
              <Dropdown.Item onClick={() => getPostListByType('latest')}>최신 순</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <WriteBtn type='post'/>
        </div>
      </div>

      <div className='following-toggle display-center-center'>
        <div className='small-text'>팔로잉</div>
        <input
          className="react-switch-checkbox"
          id={`view-following`}
          type="checkbox"
          checked={isFollowingState}
          onChange={() => setIsFollowingState(prev => !prev)}
        />
        <label
          className="react-switch-label"
          htmlFor={`view-following`}
        >
          <span className={`react-switch-button`} />
        </label>
      </div>

      {error ? <ErrorCard errorMessage={error}/> : postList?.map((post) => <PostCard key={post._id} post={post} searchQuery={searchQuery}/>)}
    </div>
  )
}

export default PostAll