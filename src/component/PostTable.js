import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postActions } from '../action/postAction';

const PostTable = ({ header, postList, isMobile }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ isShowDetailInfo, setIsShowDetailInfo ] = useState(false);
    const [ detailInfo, setDetailInfo ] = useState([]);

    const showDetailInfo = (report) => {
        if(detailInfo._id === report._id) {
            setIsShowDetailInfo(false);
            setDetailInfo([]);
            return;
        }
        setDetailInfo(report);
        setIsShowDetailInfo(true);
    }

    const toggleBlock = (id) => {
        dispatch(postActions.blockPost(id))
    }

    return (
        <div className="overflow-x">
            <Table className="table-container report-table" bordered>
                <thead>
                    <tr>
                        {header.map((title, index) => (
                            <th key={index}>{title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {postList?.length > 0 ? ( 
                        postList.map((post, index) => (
                            <React.Fragment key={`${index}-${post._id}`}>
                                <tr className={`table-row cur-point ${detailInfo._id === post._id ? 'select' : ''}`} onClick={() => showDetailInfo(post)}>
                                    {!isMobile && <td>{index + 1}</td>}
                                    <td onClick={() => navigate(`/post/${post._id}`)}>
                                        <FontAwesomeIcon icon={faLink} className='blue'/>
                                    </td>
                                    <td>카테고리</td>
                                    <td>{post.title}</td>
                                    <td>{post.author.nickName}</td>
                                    {!isMobile &&<td className='date'>{post.createAt.date} {post.createAt.time}</td>}
                                    
                                    {/* 신고승인 토글버튼 */}
                                    <td className='toggle-td'>
                                        <input
                                            className="react-switch-checkbox"
                                            id={`admin-confirm-${post._id}`}
                                            type="checkbox"
                                            checked={post.isBlock}
                                            onChange={()=> toggleBlock(post._id)}
                                        />
                                        <label
                                            className="react-switch-label"
                                            htmlFor={`admin-confirm-${post._id}`}
                                        >
                                        <span className={`react-switch-button`} />
                                        </label>
                                    </td>
                                </tr>
                                {isShowDetailInfo && detailInfo._id === post._id && (
                                    <React.Fragment>

                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='blank-td'></td>
                                            <td className='f-bold hide-tab-header'>내용</td>
                                            <td className='post-content-td' colSpan="12"><p>{detailInfo.content}</p></td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='blank-td'></td>
                                            <td className='f-bold hide-tab-header'>태그</td>
                                            <td colSpan="12">
                                                {detailInfo.tags[0] === '' ? 
                                                <span>태그 없음</span> :
                                                detailInfo.tags.map((tag, index) => <span key={`${index}-${tag}`} className='tag'>{tag}</span>)}
                                            </td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='blank-td'></td>
                                            <td className='f-bold hide-tab-header'>좋아요</td>
                                            <td colSpan="12">{detailInfo.likes}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='blank-td'></td>
                                            <td className='f-bold hide-tab-header'>댓글</td>
                                            <td colSpan="12">{detailInfo.commentCount}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='blank-td'></td>
                                            <td className='f-bold hide-tab-header'>스크랩</td>
                                            <td colSpan="12">{detailInfo.scrapCount}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='blank-td'></td>
                                            <td className='f-bold hide-tab-header'>삭제여부</td>
                                            <td colSpan="12">
                                                <span className={`${detailInfo?.isDelete ?  'coral' : 'blue'}`}>{detailInfo?.isDelete ? 'Yes' : 'No'}</span>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                )}
                            </React.Fragment>

                        ))
                    ) : (
                        <tr>
                            <td colSpan={header.length}>신고 내역이 없습니다</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default PostTable
