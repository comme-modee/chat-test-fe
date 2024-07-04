import React, { useEffect, useState } from 'react'
import WriteBtn from '../component/WriteBtn'
import MeetUpCard from '../component/MeetUpCard'
import '../style/meetUp.style.css'
import '../style/switch.style.css';
import { useDispatch, useSelector } from 'react-redux'
import { meetUpActions } from '../action/meetUpAction'
import ErrorCard from "../component/ErrorCard"
import { Dropdown } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const MeetUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const { meetUpList, loading, error } = useSelector((state) => state.meetUp);
  const [keywordValue, setKeywordValue] = useState('');
  const [isRecruitState, setisRecruitState] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    type: query.get("type") || '',
    keyword: query.get("keyword") || '',
    category: query.get("category") || '',
    isRecruit: false,
  });

  useEffect(() => {
    dispatch(meetUpActions.getMeetUpList({ ...searchQuery }));
    updateQueryParams();
  }, [searchQuery, searchQuery.type, searchQuery.keyword, searchQuery.category])

  useEffect(() => {
    setSearchQuery({ ...searchQuery, isRecruit: isRecruitState })
  }, [isRecruitState])

  const updateQueryParams = () => {
    const { keyword, type, category } = searchQuery;
    const queryParams = new URLSearchParams();

    if (keyword) queryParams.set('keyword', keyword);
    if (type) queryParams.set('type', type);
    if (category) queryParams.set('category', category);

    navigate(`/meetup?${queryParams.toString()}`);
  };

  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(prevState => ({
        ...prevState,
        keyword: e.target.value || ''
      }));
      updateQueryParams();
    }
  };

  const getMeetUpListByType = (type) => {
    setSearchQuery(prevState => ({
      ...prevState,
      type: type
    }));
    updateQueryParams();
  };
  const getMeetUpListByCategory = (category) => {
    setSearchQuery(prevState => ({
      ...prevState,
      category: category
    }));
    updateQueryParams();
  };

  const searchKeywordBySearchIcon = () => {
    setSearchQuery(prevState => ({
      ...prevState,
      keyword: keywordValue || ''
    }));
    updateQueryParams();
  }

  return (
    <div className='meetup-all-container'>
      <div className='meetup-header'>
        
        <div className='contents-header-btns'>
          <div className='form-control search-input'>
            <input
                type='text'
                placeholder='검색어를 입력하세요'
                value={keywordValue}
                onKeyUp={(e) => onCheckEnter(e)}
                onChange={(e) => setKeywordValue(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} onClick={() => searchKeywordBySearchIcon()}/>
          </div>
          <Dropdown>
            <Dropdown.Toggle className='gradient-btn-pink'>
              카테고리
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>카테고리별로 모아보기</Dropdown.Header>
              <Dropdown.Item onClick={() => getMeetUpListByCategory('전체')}>전체</Dropdown.Item>
              <Dropdown.Item onClick={() => getMeetUpListByCategory('스터디')}>스터디</Dropdown.Item>
              <Dropdown.Item onClick={() => getMeetUpListByCategory('프로젝트')}>프로젝트</Dropdown.Item>
              <Dropdown.Item onClick={() => getMeetUpListByCategory('강의')}>강의</Dropdown.Item>
              <Dropdown.Item onClick={() => getMeetUpListByCategory('독서')}>독서</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle className='gradient-btn-blue'>
              정렬
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => getMeetUpListByType('latest')}>최근등록 순</Dropdown.Item>
              <Dropdown.Item onClick={() => getMeetUpListByType('closed')}>마감임박 순</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <WriteBtn type='meetUp' />
        </div>
      </div>

      <div className='following-toggle display-center-center'>
        <div className='small-text'>모집중</div>
        <input
          className="react-switch-checkbox"
          id={`view-following`}
          type="checkbox"
          checked={isRecruitState}
          onChange={() => setisRecruitState(prev => !prev)}
        />
        <label
          className="react-switch-label"
          htmlFor={`view-following`}
        >
          <span className={`react-switch-button`} />
        </label>
      </div>

      {meetUpList.length > 0 ?
        <div className='meet-up-container'>
              {meetUpList?.map((meetUp) => <MeetUpCard key={meetUp._id} meetUp={meetUp} />)}
        </div> :
        <ErrorCard errorMessage={"현재 모집 중인 모임이 없습니다."} />
      }
    </div>
  )
}

export default MeetUp