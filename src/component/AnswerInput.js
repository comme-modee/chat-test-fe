import React, { useEffect, useState } from "react";
import "../style/answer.style.css";
import { Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import { qnaActions } from "../action/qnaAction";

const AnswerInput = () => {
    const { id } = useParams();
    const [content, setContent] = useState("");
    const { user } = useSelector((state) => state.user);
    const [imageUrl, setImageUrl] = useState("");
    const dispatch = useDispatch();

    const fetchCreateAnswer = (e) => {
        e.preventDefault();
        dispatch(qnaActions.createAnswer(content, imageUrl, id));
        setContent("");
        setImageUrl("");
    };

    const uploadedimage = (url) => {
        setImageUrl(url);
    };

    return (
        <div>
            {user ? (
                <div className="answer-input no-drag">
                    <div className="header">
                        <div className="small-profile-img">
                            <img src={user.profileImage} alt="" />
                        </div>
                        <div>{user.nickName}</div>
                    </div>
                    <Form className="body" onSubmit={fetchCreateAnswer}>
                        <Form.Group controlId="comment">
                            <Form.Control
                                as="textarea"
                                type="text"
                                rows={3}
                                placeholder="답변을 작성해주세요."
                                onChange={(e) => setContent(e.target.value)}
                                value={content}
                            />
                        </Form.Group>
                        <div className="img-container">
                            <div className="img">
                                <img
                                    id="uploadedimage"
                                    src={
                                        imageUrl ||
                                        "https://cdn-icons-png.flaticon.com/128/1829/1829586.png"
                                    }
                                    alt="uploadedimage"
                                />
                                <CloudinaryUploadWidget
                                    uploadImage={uploadedimage}
                                />
                            </div>{" "}
                        </div>
                        <button type="submit" className="green-btn">
                            등록
                        </button>
                    </Form>
                </div>
            ) : (
                <div>로그인 후 이용 가능합니다.</div>
            )}
        </div>
    );
};

export default AnswerInput;
