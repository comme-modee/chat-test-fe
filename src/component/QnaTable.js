import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Table } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { qnaActions } from '../action/qnaAction';

const QnaTable = ({ header, qnaList, isMobile }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ isShowDetailInfo, setIsShowDetailInfo ] = useState(false);
    const [ detailInfo, setDetailInfo ] = useState([]);

    const showDetailInfo = (qna) => {
        if(detailInfo._id === qna._id) {
            setIsShowDetailInfo(false);
            setDetailInfo([]);
            return;
        }
        setDetailInfo(qna);
        setIsShowDetailInfo(true);
    }

    const toggleBlock = (id) => {
        dispatch(qnaActions.blockQna(id))
    }

    return (
        <div className="overflow-x">
            <Table className="table-container qna-table" bordered>
                <thead>
                    <tr>
                        {header.map((title, index) => (
                            title === '제목' ? <th key={index} colSpan={isMobile ? 5 : 3}>{title}</th> : <th key={index}>{title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {qnaList?.length > 0 ? (
                        qnaList.map((qna, index) => (
                            <React.Fragment key={index}>
                                <tr className={`table-row cur-point ${detailInfo._id === qna._id ? 'select' : ''}`} onClick={() => showDetailInfo(qna)}>
                                    {!isMobile && <td>{index + 1}</td>}
                                    <td onClick={() => navigate(`/qna/${qna._id}`)}><FontAwesomeIcon icon={faLink} className='blue'/></td>
                                    <td colSpan={isMobile ? 5 : 3}>{qna.title}</td>
                                    <td>{qna.author.userName}</td>
                                    <td>카테고리</td>
                                    {!isMobile && 
                                        <React.Fragment>
                                            <td className='date'>{qna.createAt.date} {qna.createAt.time}</td>
                                            <td>{qna.answerCount}</td>
                                            <td><span className={`${qna.isDelete ? 'coral' : 'blue'}`}>{qna.isDelete ? 'Yes' : 'No'}</span></td>
                                        </React.Fragment>
                                    }
                                    {/* 신고승인 토글버튼 */}
                                    <td className='toggle-td'>
                                        <input
                                            className="react-switch-checkbox"
                                            id={`admin-confirm-${qna._id}`}
                                            type="checkbox"
                                            checked={qna.isBlock}
                                            onChange={()=> toggleBlock(qna._id)}
                                        />
                                        <label
                                            className="react-switch-label"
                                            htmlFor={`admin-confirm-${qna._id}`}
                                        >
                                        <span className={`react-switch-button`} />
                                        </label>
                                    </td>
                                </tr>
                                {isShowDetailInfo && detailInfo._id === qna._id && (
                                    <React.Fragment>
                                        {isMobile &&
                                            <React.Fragment>
                                                <tr className='detail-info-tr'>
                                                    <td className='blank-td'></td>
                                                    <td className='f-bold'>작성일</td>
                                                    <td colSpan="12">{detailInfo?.createAt.date} {detailInfo?.createAt.time}</td>
                                                </tr>
                                                <tr className='detail-info-tr'>
                                                    <td className='blank-td'></td>
                                                    <td className='f-bold'>답변 수</td>
                                                    <td colSpan="12">{detailInfo?.answerCount}</td>
                                                </tr>
                                                <tr className='detail-info-tr'>
                                                    <td className='blank-td'></td>
                                                    <td className='f-bold'>삭제여부</td>
                                                    <td colSpan="12">
                                                        <span className={`${detailInfo?.isDelete ?  'coral' : 'blue'}`}>{detailInfo?.isDelete ? 'Yes' : 'No'}</span>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        }
                                        {detailInfo?.answerCount !== 0 ? 
                                        <React.Fragment>
                                            <tr className='detail-info-tr f-bold'>
                                                {!isMobile &&<td className='blank-td'></td>}
                                                <td className='blank-td'></td>
                                                <td colSpan="12" className='hide-tab-header'>답변</td>
                                            </tr>
                                            <tr className='detail-info-tr f-bold'>
                                                {!isMobile &&<td className='blank-td'></td>}
                                                <td className='blank-td'></td>
                                                <td colSpan={4} className='hide-tab-header'>내용</td>
                                                <td className='hide-tab-header'>작성자</td>
                                                <td className='hide-tab-header'>좋아요수</td>
                                                {!isMobile && <td className='hide-tab-header'>작성일</td>}
                                                <td className='hide-tab-header'>삭제여부</td>
                                                <td className='hide-tab-header'>수정여부</td>
                                            </tr>
                                        </React.Fragment>
                                        : 
                                            <tr className='detail-info-tr f-bold'>
                                                {!isMobile &&<td className='blank-td'></td>}
                                                <td className='blank-td'></td>
                                                <td className='hide-tab-header' colSpan="12">답변 없음</td>
                                            </tr>
                                        }
                                        {detailInfo?.answerCount !== 0 && detailInfo?.answers.map((ans, index) => 
                                            <tr className='detail-info-tr' key={`${index}-${ans._id}`}>
                                                {!isMobile &&<td className='blank-td'></td>}
                                                <td className='blank-td'></td>
                                                <td colSpan={4}>{ans.content}</td>
                                                <td className='cur-point' onClick={() => navigate(`/me/${ans.author.nickName}`)}>{ans.author.nickName}</td>
                                                <td>{ans.likes}</td>
                                                {!isMobile && <td className='date'>{ans.createAt.date} {ans.createAt.time}</td>}
                                                <td><span className={`${ans.isDelete ? 'coral' : 'blue'}`}>{ans.isDelete ? 'Yes' : 'No'}</span></td>
                                                <td><span className={`${ans.isUpdated ? 'coral' : 'blue'}`}>{ans.isUpdated ? 'Yes' : 'No'}</span></td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                )}
                            </React.Fragment>

                        ))
                    ) : (
                        <tr>
                            <td colSpan={header.length}>No Data to show</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default QnaTable
