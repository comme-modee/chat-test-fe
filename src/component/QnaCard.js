import React from "react";
import "../style/qna.style.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { qnaActions } from "../action/qnaAction";

const QnaCard = ({ qna }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const showQnaDetail = () => {
        //Q&A 디테일 페이지로 가기
        navigate(`/qna/${qna._id}`);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        if (window.confirm("정말로 이 QnA를 삭제하시겠습니까?")) {
            dispatch(qnaActions.deleteQna(qna._id, navigate));
        }
    };

    const handleUpdate = (event) => {
        event.stopPropagation();
        dispatch(qnaActions.getQnaDetail(qna._id));
        navigate("/qna/write?type=update");
    };

    const removeImages = (content) => {
        // 이미지 마크다운 구문을 매칭하는 정규 표현식
        const regex = /!\[.*?\]\(.*?\)/g;
        // 이미지 마크다운 구문을 빈 문자열로 대체하여 이미지를 제거한 순수 텍스트를 반환
        const plainTextContent = content.replace(regex, "");
        return plainTextContent;
    };

    return (
        <div className="qna-card-container" onClick={() => showQnaDetail()}>
            <div className="left-side">
                <div className={`category-overlay ${qna.category}`}>{qna.category === 'tech' ? '기술' : qna.category === 'career' ? '커리어' : '기타'}</div>
                <div className="answer-count no-drag">
                    <div>답변</div>
                    <div className="num">{qna.answerCount}</div>
                </div>
            </div>

            <div className="title-content">
                <div className="title">{qna.title}</div>
                <div className="content">{removeImages(qna.content)}</div>
            </div>

            <div className="author no-drag cur-point">
                <span className="small-profile-img">
                    <img src={qna.author.profileImage} />
                </span>
                <span className="name">{qna.author.nickName}</span>
                <span className="small-text">{qna.createAt.date} {qna.createAt.time}</span>
            </div>
            {user._id === qna.author._id && (
                <div className="btns small-text no-drag">
                    <p className="white-btn" onClick={(event) => handleUpdate(event)}>수정</p>
                    <p className="coral-btn" onClick={(event) => handleDelete(event)}>삭제</p>
                </div>
            )}
        </div>
    );
};

export default QnaCard;
