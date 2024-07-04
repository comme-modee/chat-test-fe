import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Table } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../action/userAction';

const UserTable = ({ header, userList, isMobile }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ isShowDetailInfo, setIsShowDetailInfo ] = useState(false);
    const [ detailInfo, setDetailInfo ] = useState([]);

    const showDetailInfo = (user) => {
        if (detailInfo._id === user._id) {
            setIsShowDetailInfo(false);
            setDetailInfo([]);
            return;
        }
        setDetailInfo(user);
        setIsShowDetailInfo(true);
    }
    
    const toggleBlock = (id) => {
        dispatch(userActions.blockUser(id))
    }
    
    return (
        <div className="overflow-x">
            <Table className="table-container user-table" bordered>
                <thead>
                    <tr>
                        {header.map((title, index) => (
                            <th key={index}>{title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {userList?.length > 0 ? (
                        userList.map((user, index) => (
                            <React.Fragment key={index}>
                                <tr className={`table-row cur-point ${detailInfo._id === user._id ? 'select' : ''}`} onClick={() => showDetailInfo(user)}>
                                    {!isMobile && <td>{index + 1}</td>}
                                    <td onClick={() => navigate(`/me/${user.nickName}`)}><FontAwesomeIcon icon={faLink} className='blue' /></td>
                                    <td className="table-cell">
                                        <img src={user.profileImage} alt={user.userName} />
                                        <div className="user-info">
                                            <span>{user.userName}</span>
                                            <span className="small-text">{user.email}</span>
                                        </div>
                                    </td>
                                    {!isMobile && <td>{user.gender === "male" ? "남자" : user?.gender === "female" ? "여자" : "없음"}</td>}
                                    {!isMobile && <td>{user.rank}</td>}
                                    <td><span className={`${user.isDelete ? 'coral' : 'blue'}`}>{user.isDelete ? 'Yes' : 'No'}</span></td>
                                    {!isMobile && <td>{user.level}</td>}
                                    {!isMobile && <td>{user.report}</td>}
                                    {/* 신고승인 토글버튼 */}
                                    <td className='toggle-td'>
                                        {user.level !== 'admin' && 
                                        <><input
                                            className="react-switch-checkbox"
                                            id={`admin-confirm-${user._id}`}
                                            type="checkbox"
                                            checked={user.isBlock}
                                            onChange={() => toggleBlock(user._id)}
                                        />
                                        <label
                                            className="react-switch-label"
                                            htmlFor={`admin-confirm-${user._id}`}
                                        >
                                            <span className={`react-switch-button`} />
                                        </label></>}
                                    </td>
                                </tr>
                                {isShowDetailInfo && detailInfo._id === user._id && (
                                    <React.Fragment>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>소개</td>
                                            <td colSpan="12">{detailInfo?.description}</td>
                                        </tr>

                                        {isMobile &&
                                            <React.Fragment>
                                                <tr className='detail-info-tr'>
                                                    {!isMobile && <td className='blank-td'></td>}
                                                    <td className='f-bold hide-tab-header'>성별</td>
                                                    <td colSpan="12">{detailInfo?.gender}</td>
                                                </tr>
                                                <tr className='detail-info-tr'>
                                                    {!isMobile && <td className='blank-td'></td>}
                                                    <td className='f-bold hide-tab-header'>랭크</td>
                                                    <td colSpan="12">{detailInfo?.rank}</td>
                                                </tr>
                                                <tr className='detail-info-tr'>
                                                    {!isMobile && <td className='blank-td'></td>}
                                                    <td className='f-bold hide-tab-header'>레벨</td>
                                                    <td colSpan="12">{detailInfo?.level}</td>
                                                </tr>
                                            </React.Fragment>
                                        }

                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>스택</td>
                                            <td colSpan="12">{detailInfo?.stacks.map((stack, index) => <div key={`${index}-${stack}`}>{stack}</div>)}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>팔로잉</td>
                                            <td colSpan="12">{detailInfo?.following.map((id, index) => <div key={`${index}-${id}`}>{id}</div>)}</td>
                                        </tr>
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>팔로워</td>
                                            <td colSpan="12">{detailInfo?.followers.map((id, index) => <div key={`${index}-${id}`}>{id}</div>)}</td>
                                        </tr>
                                        {isMobile &&
                                            <tr className='detail-info-tr'>
                                                {!isMobile && <td className='blank-td'></td>}
                                                <td className='f-bold hide-tab-header'>신고</td>
                                                <td colSpan="12">{detailInfo?.report}</td>
                                            </tr>
                                        }
                                        <tr className='detail-info-tr'>
                                            {!isMobile && <td className='blank-td'></td>}
                                            <td className='f-bold hide-tab-header'>가입일</td>
                                            <td colSpan="12">{user.createAt ? `${user.createAt.date} ${user.createAt.time}` : "Date Not Provided"}</td>
                                        </tr>
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

export default UserTable
