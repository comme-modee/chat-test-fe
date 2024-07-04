import React, { useEffect, useState } from "react";
import MarkdownEditor from "@uiw/react-md-editor";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidgetForWrite from "../utils/CloudinaryUploadWidgetForWrite";
import { qnaActions } from "../action/qnaAction";
import { commonUiActions } from "../action/commonUiAction";
import { Form } from "react-bootstrap";

const QnaWrite = ({ mode }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    const { selectedQna } = useSelector((state) => state.qna);
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    
    const [ title, setTitle ] = useState("");
    const [ markDown, setMarkdown ] = useState("");
    const [ category, setCategory ] = useState('');

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    useEffect(() => {
        if (type === "update" && selectedQna) {
            setTitle(selectedQna.title)
            setCategory(selectedQna.category)
            setMarkdown(selectedQna.content);
        } else {
            setTitle("")
            setCategory("")
            setMarkdown("");
        }
    }, [type, selectedQna]);

    const createQuestion = () => {
        if (title === "") {
            dispatch(commonUiActions.showToastMessage("제목을 입력해주세요.", "error"));
            return;
        }
        if (markDown === "") {
            dispatch(commonUiActions.showToastMessage("내용을 입력해주세요.", "error"));
            return;
        }
        if(category === '') {
            dispatch(commonUiActions.showToastMessage("카테고리를 선택해주세요.", "error"));
            return;
        }

        const qnaData = { title, content: markDown, category };

        if (type === "new") {
            dispatch(qnaActions.createQna(qnaData, navigate));
        } else {
            dispatch(qnaActions.updateQna(qnaData, selectedQna._id, navigate));
        }
    };

    const uploadContentImage = (url) => {
        setMarkdown(markDown + `![image](${url})`);
    };

    return (
        <div className="write-form-container">
            <div className="write-form">
                <div className="top">
                    <Form.Select defaultValue={type === 'new' ? category : selectedQna?.category} onChange={(e) => setCategory(e.target.value)}>
                        <option value=''>카테고리</option>
                        <option value="tech">기술</option>
                        <option value="career">커리어</option>
                        <option value="etc">기타</option>
                    </Form.Select>
                    <button className="green-btn" onClick={createQuestion}>
                        {type === "new" ? "등록" : "수정"}
                    </button>
                </div>
                <div className="qna-write-title">
                    <input
                        id="title"
                        type="text"
                        placeholder="제목을 입력해주세요"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <strong className="small-btn">본문에 사진 추가 </strong>
                    <CloudinaryUploadWidgetForWrite
                        uploadContentImage={uploadContentImage}
                    />
                </div>
                <div id="content" className="qna-write-content">
                    <div data-color-mode="light">
                        <MarkdownEditor
                            height={600}
                            value={markDown}
                            highlightEnable={false}
                            onChange={setMarkdown}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QnaWrite;
