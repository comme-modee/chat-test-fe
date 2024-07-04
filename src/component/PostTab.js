import React from 'react'
import { useNavigate } from 'react-router-dom'
import meetingImg from "../asset/img/meeting-img-03.jpg"
import { Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'

const PostTab = ({ post }) => {
    const navigate = useNavigate();
    const image = post.image || meetingImg;
    const commentsCount = post.comments.filter(comment => !comment.isDelete).length;

  return (
    <Card className="mypagetab-card shadow-sm" onClick={() => { navigate(`/post/${post._id}`) }}>
        <Card.Img variant="top" src={image} alt={post.title} className="card-thumbnail" />
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          {/* <Card.Text>{truncatedContent}</Card.Text> */}
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
                <FontAwesomeIcon icon={faComment} /> {commentsCount}
            </span>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          생성 날짜: {post.createAt.date} {post.createAt.time}
        </Card.Footer>
      </Card>

  )
}

export default PostTab
