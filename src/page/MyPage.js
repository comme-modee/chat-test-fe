import React, { useEffect, useState } from 'react'
import { Nav, Modal, Row, Col } from 'react-bootstrap'
import PostTab from '../component/PostTab';
import "../style/myPage.style.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { userActions } from '../action/userAction';
import MeetUpTab from '../component/MeetUpTab';
import QnaTab from '../component/QnaTab';
import ScrapTab from '../component/ScrapTab';
import MyLikesTab from '../component/MyLikesTab';
import MyCommentsTab from '../component/MyCommentsTab';
import  entry  from "../asset/img/entry.png"
import  bronze  from "../asset/img/bronze.png"
import  silver  from "../asset/img/silver.png"
import  gold  from "../asset/img/gold.png"
import  platinum  from "../asset/img/platinum.png"
import  diamond  from "../asset/img/diamond.png"
import  master  from "../asset/img/master.png"
import  challenger  from "../asset/img/challenger.png"
import  ErrorCard  from "../component/ErrorCard"

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickName } = useParams();
  const [tab, setTab] = useState("post");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const {
    user,
    loading,
    uniqueUser,
    followSuccess,
    unfollowSuccess,
    uniqueUserPost,
    uniqueUserMeetUp,
    uniqueUserQna,
    uniqueUserScrap,
    uniqueUserLikes,
    uniqueUserPostComments,
    uniqueUserQnaComments,
    following,
    followers } = useSelector((state) => state.user);
  const isCurrentUser = user && user.nickName === nickName;
  const stackList = [
    ["Java", "096F90"], ["JavaScript", "F7DF1E"],
    ["TypeScript", "3178C6"], ["Spring", "6DB33F"],
    ["HTML", "E34F26"], ["CSS3", "1572B6"],
    ["jQuery", "0769AD"], ["Oracle", "F80000"],
    ["MySQL", "4479A1"], ["Spring Boot", "6DB33F"],
    ["PHP", "777BB4"], ["Python", "3776AB"],
    ["Node.js", "5FA04E"], ["Swift", "F05138"],
    ["React", "61DAFB"], ["React Native", "61DAFB"],
    ["Angular", "0F0F11"], ["Vue.js", "4FC08D"],
    ["Kotlin", "7F52FF"], ["MSSQL", "4479A1"],
    ["Git", "F05032"], ["Github", "181717"],
    ["Bootstrap", "7952B3"]
  ];

  useEffect(() => {
    dispatch(userActions.getUserByNickName(nickName))
    setTab("post");
  }, [nickName, dispatch])

  useEffect(() => {
    if (followSuccess || unfollowSuccess) {
      dispatch(userActions.getUserByNickName(nickName));
      dispatch(userActions.loginWithToken())
    }
  }, [followSuccess, unfollowSuccess, nickName, dispatch]);

  const handleFollow = () => {
    if (!user) {
      navigate("/login")
    } else {
      dispatch(userActions.followUser(nickName))
    }
  };

  const handleUnfollow = () => {
    dispatch(userActions.unfollowUser(nickName))
  }

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  }

  const handleCloseModal = () => setShowModal(false);

  const getTotalCommentsLength = (comments) => {
    if (!comments || comments.length === 0) {
        return 0;
    }
    return comments.reduce((totalLength, comment) => {
        return totalLength + (comment.userComments ? comment.userComments.length : 0);
    }, 0);
  };

  const getTotalAnswersLength = (answers) => {
    if (!answers || answers.length === 0) {
        return 0;
    }
    return answers.reduce((totalLength, answer) => {
        // comment.answers 배열이 존재하고 길이가 있는 경우에만 합산
        return totalLength + (answer.userComments ? answer.userComments.length : 0);
    }, 0);
  };

  const getProfileImageRank = (rank) => {
    switch (rank.toLowerCase()) {
      case "entry":
        return entry;
      case "bronze":
        return bronze;
      case "silver":
        return silver
      case "gold":
        return gold;
      case "platinum":
        return platinum;
      case "diamond":
        return diamond;
      case "master":
        return master
      case "challenger":
        return challenger;
      default:
        return entry;
    }
  }

  if (!uniqueUser) {
    return <div></div>;
  }

  const isFollowing = user && user.following && user.following.includes(uniqueUser._id)

  return (
    <div className="my-page-container">
      <div className="profile-section">
        <div className="profile-images">
          <img
            src={uniqueUser.profileImage}
            alt="Profile"
            className="profile-image"
          />
          <img
            src={`${getProfileImageRank(uniqueUser.rank)}`}
            className="profile-rank"
            alt="Rank"
          />
        </div>
        <div className="profile-info">
          <div className="user-info">
            <h2 className="user-name">
              {uniqueUser.userName} <span className="user-rank">{uniqueUser.rank}</span>
              {!isCurrentUser && (
                <button className="follow-button" onClick={isFollowing ? handleUnfollow : handleFollow}>
                  {isFollowing ? "언팔로우" : "팔로우"}
                </button>
              )}
            </h2>
            <div className='user-status'>
              <div className={`${uniqueUser.online.online ? 'on-line' : 'off-line'}`}></div>
              <span className='small-text'>{uniqueUser.online.online ? '활동중' : '자리비움'}</span>
            </div>
            <p className="description">{uniqueUser.description}</p>
            <div className="stacks-container">
              {uniqueUser.stacks && uniqueUser.stacks.map(
                (stack) => {
                  const matchedStacks = stackList.find((item) => item[0] === stack)
                  return matchedStacks ? (
                    <img
                      key={stack}
                      src={`https://img.shields.io/badge/${matchedStacks[0]}-${matchedStacks[1]}?style=for-the-badge&logo=${matchedStacks[0]}&logoColor=white`}
                      alt={stack}
                    />
                  ) : null;
                }
              )}
            </div>
          </div>
          <div className="follow-info">
            <div className="follow-item" onClick={() => handleShowModal("myActivity")}>
              <p className="follow-label">나의 활동</p>
              <p className="follow-count">
                {uniqueUserPost.length
                  + uniqueUserMeetUp.length
                  + uniqueUserQna.length
                  + uniqueUserScrap.length
                  + uniqueUserLikes.length
                  + getTotalCommentsLength(uniqueUserPostComments) + getTotalAnswersLength(uniqueUserQnaComments)}
              </p>
            </div>
            <div className="follow-item" onClick={() => handleShowModal("followers")}>
              <p className="follow-label">Followers</p>
              <p className="follow-count">{uniqueUser.followers ? uniqueUser.followers.length : 0}</p>
            </div>
            <div className="follow-item" onClick={() => handleShowModal("following")}>
              <p className="follow-label">Following</p>
              <p className="follow-count">{uniqueUser.following ? uniqueUser.following.length : 0}</p>
            </div>
          </div>
        </div>
      </div>

      <Nav variant="tabs" activeKey={tab} onSelect={(selectedKey) => setTab(selectedKey)} defaultActiveKey="post" className="custom-nav">
        <Nav.Item>
          <Nav.Link eventKey="post">Post</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="meetUp">MeetUp</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="qna">Q&A</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="scrap">Scrap</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="myLikes">My Likes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="myComments">My Comments</Nav.Link>
        </Nav.Item>
      </Nav>

      <TabContent
        tab={tab}
        uniqueUser={uniqueUser}
        uniqueUserPost={uniqueUserPost}
        uniqueUserMeetUp={uniqueUserMeetUp}
        uniqueUserQna={uniqueUserQna}
        uniqueUserScrap={uniqueUserScrap}
        uniqueUserLikes={uniqueUserLikes}
        uniqueUserPostComments={uniqueUserPostComments}
        uniqueUserQnaComments={uniqueUserQnaComments}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'following' ? 'Following' : modalType === 'followers' ? 'Followers' : "나의 활동"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'following' ? (
            following.map((user) => (
              <div
                key={user._id}
                className='user-item'
                onClick={() => {
                  navigate(`/me/${user.nickName}`);
                  handleCloseModal();
                }
                }>
                <img src={user.profileImage} alt={user.nickName} className='user-profile-image' />
                <div className='user-info'>
                  <span className='user-nickName'>{user.nickName}</span>
                  <span className='user-userName'>{user.userName}</span>
                </div>
              </div>
            ))
          ) : modalType === "followers" ? (
            followers.map((user) => (
              <div
                key={user._id}
                className='user-item'
                onClick={() => {
                  navigate(`/me/${user.nickName}`)
                  handleCloseModal();
                }
                }>
                <img src={user.profileImage} alt={user.nickName} className='user-profile-image' />
                <div className='user-info'>
                  <span className='user-nickName'>{user.nickName}</span>
                  <span className='user-userName'>{user.userName}</span>
                </div>
              </div>
            ))
            ) : <div className="my-activity">
                <p className='mb-1'>포스트: {uniqueUserPost.length}</p>
                <p className='mb-1'>MeetUp: {uniqueUserMeetUp.length}</p>
                <p className='mb-1'>Qna: {uniqueUserQna.length}</p>
                <p className='mb-1'>스크랩: {uniqueUserScrap.length}</p>
                <p className='mb-1'>나의 좋아요: {uniqueUserLikes.length}</p>
                <p className='mb-1'>나의 댓글: {getTotalCommentsLength(uniqueUserPostComments) + getTotalAnswersLength(uniqueUserQnaComments)}</p>
          </div>}
        </Modal.Body>
      </Modal>
    </div>
  )
}

const TabContent = ({
  tab,
  uniqueUser,
  uniqueUserPost,
  uniqueUserMeetUp,
  uniqueUserQna,
  uniqueUserScrap,
  uniqueUserLikes,
  uniqueUserPostComments,
  uniqueUserQnaComments, }) => {
  if (tab === "post") {
    return <Row>
      {uniqueUserPost.length !== 0 ? uniqueUserPost.map((post) => (
        <Col key={post._id} xs={12} sm={6} md={4} lg={4}>
          <PostTab post={post} key={post._id} />
        </Col>
      )) : <ErrorCard errorMessage={"등록한 포스트가 없습니다"}/>}
    </Row>
  }

  if (tab === "meetUp") {
    return <div className="meetUp-container">
      {uniqueUserMeetUp.length !== 0 ? uniqueUserMeetUp.map((meetUp) => (
        <MeetUpTab meetUp={meetUp} key={meetUp._id} />
      )) : <ErrorCard errorMessage={"등록한 모임이 없습니다"}/>}
    </div>
  }

  if (tab === "qna") {
    return <>
      {uniqueUserQna.length !== 0 ? uniqueUserQna.map((qna) => (
        <QnaTab qna={qna} key={qna._id} />
      )) : <ErrorCard errorMessage={"등록한 질문이 없습니다"}/>}
    </>
  }
  if (tab === "scrap") {
    return <ScrapTab uniqueUser={uniqueUser} uniqueUserScrap={uniqueUserScrap} />
  }
  if (tab === "myLikes") {
    return <MyLikesTab uniqueUserLikes={uniqueUserLikes} />
  }
  if (tab === "myComments") {
    return (
      <>
        {uniqueUserPostComments.length === 0 && uniqueUserQnaComments.length === 0 ? 
            <ErrorCard errorMessage={"등록한 댓글이 없습니다"}/> :
            <MyCommentsTab
              uniqueUser={uniqueUser}
              uniqueUserPostComments={uniqueUserPostComments}
              uniqueUserQnaComments={uniqueUserQnaComments}
            />
        }
      </>
    )
  }

}

export default MyPage