import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Table } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { meetUpActions } from '../action/meetUpAction';

const MeetUpTable = ({ header, meetUpList, isMobile }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ isShowDetailInfo, setIsShowDetailInfo ] = useState(false);
    const [ detailInfo, setDetailInfo ] = useState([]);

    const showDetailInfo = (meetUp) => {
        if(detailInfo._id === meetUp._id) {
            setIsShowDetailInfo(false);
            setDetailInfo([]);
            return;
        }
        setDetailInfo(meetUp);
        setIsShowDetailInfo(true);
    }

    const toggleBlock = (id) => {
        dispatch(meetUpActions.blockMeetUp(id))
    }

    return (
        <div className="overflow-x">
            <Table className="table-container meetup-table" bordered>
                <thead>
                    <tr>
                        {header.map((title, index) => (
                            <th key={index}>{title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {meetUpList?.length > 0 ? (
                        meetUpList.map((meetUp, index) => (
                            <React.Fragment key={index}>
                                <tr className={`table-row cur-point ${detailInfo._id === meetUp._id ? 'select' : ''}`} onClick={() => showDetailInfo(meetUp)}>
                                    {!isMobile && <td>{index + 1}</td>}
                                    <td onClick={() => navigate(`/meetup/${meetUp._id}`)}><FontAwesomeIcon icon={faLink} className='blue'/></td>
                                    <td className='title'><p>{meetUp.title}</p></td>
                                    <td>{meetUp.organizer.nickName}</td>
                                    <td>{meetUp.category}</td>
                                    {!isMobile && 
                                        <React.Fragment>
                                            <td className='date'>{meetUp.createAt.date} {meetUp.createAt.time}</td>
                                            <td><span className={`${meetUp.isDelete ? 'coral' : 'blue'}`}>{meetUp.isDelete ? 'Yes' : 'No'}</span></td>
                                        </React.Fragment>
                                    }
                                    {/* 신고승인 토글버튼 */}
                                    <td className='toggle-td'>
                                        <input
                                            className="react-switch-checkbox"
                                            id={`admin-confirm-${meetUp._id}`}
                                            type="checkbox"
                                            checked={meetUp.isBlock}
                                            onChange={()=> toggleBlock(meetUp._id)}
                                        />
                                        <label
                                            className="react-switch-label"
                                            htmlFor={`admin-confirm-${meetUp._id}`}
                                        >
                                        <span className={`react-switch-button`} />
                                        </label>
                                    </td>

                                </tr>
                                {isShowDetailInfo && detailInfo._id === meetUp._id && (
                                    <React.Fragment>
                                        {isMobile &&
                                            <tr className='detail-info-tr'>
                                                {!isMobile && <td className='blank-td'></td>}
                                                <td className='f-bold hide-tab-header'>카테고리</td>
                                                <td colSpan="12">{detailInfo?.category}</td>
                                            </tr>
                                        }
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>소개</td>
                                            <td colSpan="12">{detailInfo?.description}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>장소</td>
                                            <td colSpan="12">{detailInfo?.location === "online" ? "온라인" : detailInfo?.location.replace(/;/g, ' ')}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>일시</td>
                                            <td colSpan="12">{detailInfo?.date.date} {detailInfo?.date.time}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>참가인원</td>
                                            <td colSpan="12">
                                                {detailInfo?.participants.map((user, index) => 
                                                    <div key={`${index}-${user._id}`}>
                                                        <span className='cur-point' onClick={() => navigate(`/me/${user.nickName}`)} >
                                                            {user.nickName} ({user._id})
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>모집인원 수</td>
                                            <td colSpan="12">{detailInfo?.maxParticipants}</td>
                                        </tr>

                                        {isMobile &&
                                            <React.Fragment>
                                                <tr className='detail-info-tr'>
                                                    <td className='f-bold hide-tab-header'>삭제여부</td>
                                                    <td colSpan="12">
                                                        <span className={`${detailInfo?.isDelete ?  'coral' : 'blue'}`}>{detailInfo?.isDelete ? 'Yes' : 'No'}</span>
                                                    </td>
                                                </tr>
                                                <tr className='detail-info-tr'>
                                                    <td className='f-bold hide-tab-header'>작성일</td>
                                                    <td className='date' colSpan="12">{detailInfo?.createAt.date} {detailInfo?.createAt.time}</td>
                                                </tr>
                                            </React.Fragment>
                                        }

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

export default MeetUpTable
