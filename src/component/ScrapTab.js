import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { postActions } from '../action/postAction';
import meetingImg from "../asset/img/meeting-img-01.jpg"
import { Col, Row, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import ErrorCard from './ErrorCard';

const ScrapTab = ({ uniqueUser, uniqueUserScrap }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user)
    const [scrapedPost, setScrapedPost] = useState([]);
    const isCurrentUser = user && user._id === uniqueUser._id;
    console.log("uniqueUserScrap", uniqueUserScrap)

    useEffect(() => {
        if (uniqueUserScrap) {
            const filteredScrap = uniqueUserScrap.filter((post) => 
                uniqueUser.scrap.some((scrapItem) => 
                scrapItem.post === post._id && 
                (isCurrentUser || !scrapItem.isPrivate)
                )
            );
            setScrapedPost(filteredScrap);
        }
    }, [uniqueUserScrap, isCurrentUser]);

    const handleCardClick = (post) => {
        if (post.isDelete) {
            alert("삭제된 포스트입니다");
        } else {
            navigate(`/post/${post._id}`);
        }
    }

    const handleScrapPrivate = (postId) => {
        dispatch(postActions.toggleScrapPrivate(user.nickName, postId))
    }

    const handleDeleteScrap = (postId) => {
        dispatch(postActions.deleteScrap(user.nickName, postId))
    }

  return (
      <Row>
      {scrapedPost.length !== 0 ? scrapedPost.map((post) => (
          <Col key={post._id} xs={12} sm={6} md={4} lg={4}>
                <Card className="mypagetab-card shadow-sm scrap-card" onClick={() => handleCardClick(post)}>

                    {isCurrentUser && 
                    <div className='state-btns'>
                        <div 
                            className={`private-toggle-btn blue-btn small-btn 
                            ${uniqueUser.scrap.find((i)=> i.post === post._id && i.isPrivate) ? 'private' : 'public'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleScrapPrivate(post._id);
                            }}
                        >
                            {`${uniqueUser.scrap.find((i)=> i.post === post._id && i.isPrivate) ? '비공개' : '공개'}`}
                        </div>
                        <div 
                            className='delete-btn coral-btn small-btn' 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteScrap(post._id);
                            }}
                        >
                            삭제
                        </div>
                    </div>}

                    <Card.Img variant="top" src={post.image || meetingImg} alt={post.title} className="card-thumbnail" />
                    <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <div className="tags">
                        {post.tags.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1">#{tag}</Badge>
                        ))}
                    </div>
                    <div className="user-likes mt-2">
                        <span className="me-3">
                            <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} /> {post.likes}
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faComment} /> {post.comments.filter(comment => !comment.isDelete).length}
                        </span>
                    </div>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                    생성 날짜: {post.createAt.date} {post.createAt.time}
                    </Card.Footer>
                </Card>
          </Col>
      )) : <ErrorCard errorMessage={"스크랩한 포스트가 없습니다"}/>}
    </Row>
  )
}

export default ScrapTab
