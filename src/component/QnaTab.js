import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const QnaTab = ({ qna }) => {
    const navigate = useNavigate();
  return (
        <Card className="qna-card cur-point" onClick={() => navigate(`/qna/${qna._id}`)}>
        <Card.Body>
            <Card.Title>{qna.title}</Card.Title>
            <div className="qna-tags">
            {qna.tags.map((tag, index) => (
                <Badge key={index} pill bg="secondary" className="qna-tag">
                {tag}
                </Badge>
            ))}
            </div>
            <div className="qna-info">
            <span className="qna-answers">{qna.answerCount} 개의 답변</span>
            </div>
        </Card.Body>
        </Card>
    )
}

export default QnaTab


