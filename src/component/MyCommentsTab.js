import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import meetingImg from "../asset/img/meeting-img-01.jpg"
import { Dropdown } from 'react-bootstrap';

const MyCommentsTab = ({ uniqueUser, uniqueUserPostComments, uniqueUserQnaComments }) => {
    const navigate = useNavigate();
    const [myPostComments, setMyPostComments] = useState([]);
    const [myQnaComments, setMyQnaComments] = useState([]);
    const [selectedTab, setSelectedTab] = useState("all")
    const [dropdownText, setDropdownText] = useState("전체 댓글")

    const formatDateTime = (dateString) => {
        return dateString.replace("T", " ").replace(/\.\d+Z$/, "");
    };

    useEffect(() => {
        if (uniqueUserPostComments) {
            setMyPostComments(uniqueUserPostComments)
        }
    }, [uniqueUserPostComments, uniqueUser])

    useEffect(() => {
        if (uniqueUserQnaComments) {
            setMyQnaComments(uniqueUserQnaComments)
        }
    }, [uniqueUserQnaComments, uniqueUser])

    const handleSelect = (tab, text) => {
        setSelectedTab(tab);
        setDropdownText(text);
    };


  return (
      <div className="myComment-tab-container">
        <div className="contents-header-btns">      
        <Dropdown>
            <Dropdown.Toggle className="white-btn">
                {dropdownText}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSelect('all', '전체 댓글')}>전체 댓글</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('posts', '게시물')}>게시물</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('qna', 'QnA')}>QnA</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
      {(selectedTab === 'all' || selectedTab === 'posts') && myPostComments.map((post) => (
        <div className="myComment-tab" key={post._id}>
          <div className="post-content" onClick={() => { navigate(`/post/${post._id}`) }}>
            <img src={post.image || meetingImg} alt="postImg" className="post-image" />
            <div className="post-text">
              <h3>{post.title}</h3>
              <div className="post-details">
                <span>Tags: {post.tags.join(", ")}</span>
                <span>Likes: {post.userLikes.length}</span>
                <span>Posted on: {formatDateTime(post.createAt)}</span>
              </div>
            </div>
          </div>
          <div className="comments-section">
            {post.userComments.map((comment) => (
              <div className="comment" key={comment._id}>
                <div className="comment-author">
                  <img src={uniqueUser.profileImage} alt="author" className="author-image" />
                  <span className="author-name">{uniqueUser.userName}</span>
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <span className="comment-date">{formatDateTime(comment.createAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
        {(selectedTab === 'all' || selectedTab === 'qna') && myQnaComments.map((qna) => (
        <div className="myComment-tab" key={qna._id}>
          <div className="post-content" onClick={() => { navigate(`/qna/${qna._id}`) }}>
            <div className="post-text">
              <h3>Q. {qna.title}</h3>
              <div className="post-details">
                <span>{qna.answers.filter(comment => !comment.isDelete).length} 개의 답변</span>
                <span>Tags: {qna.tags.length === 0 ? "없음" : qna.tags.join(", ")}</span>
                <span>게시일: {formatDateTime(qna.createAt)}</span>
              </div>
            </div>
          </div>
          <div className="comments-section">
            {qna.userComments.map((answer) => (
              <div className="comment" key={answer._id}>
                <div className="comment-author">
                  <img src={uniqueUser.profileImage} alt="author" className="author-image" />
                  <span className="author-name">{uniqueUser.userName}</span>
                </div>
                <div className="comment-content">
                  <p>{answer.content}</p>
                  <span className="comment-date">{formatDateTime(answer.createAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyCommentsTab
