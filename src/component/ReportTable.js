import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reportActions } from '../action/reportAction';

const ReportTable = ({ header, reportList, isMobile }) => {

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

    const toggleConfirmReport = (id) => {
        dispatch(reportActions.updateReport(id))
    }

    console.log(reportList)

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
                    {reportList?.length > 0 ? ( 
                        reportList.map((report, index) => (
                            <React.Fragment key={`${index}-${report._id}`}>
                                <tr className={`table-row cur-point ${detailInfo._id === report._id ? 'select' : ''}`} onClick={() => showDetailInfo(report)}>
                                    {!isMobile && <td>{index + 1}</td>}
                                    <td onClick={() => 
                                        navigate(`/${report.contentType.toLowerCase()}/${report.contentType === 'Post' ? report.postId._id :
                                                                                        report.contentType === 'MeetUp' ? report.meetUpId._id :
                                                                                        report.contentType === 'QnA' ? report.qnaId._id : ''
                                        }`)
                                    }>
                                        <FontAwesomeIcon icon={faLink} className='blue'/>
                                    </td>
                                    <td>{report.contentType}</td>
                                    <td>
                                        {report.contentType === 'MeetUp' ? report.meetUpId.title : 
                                        report.contentType === 'Post' ? report.postId.title : 
                                        report.qnaId.title}
                                    </td>
                                    <td>{report.reported.nickName}</td>
                                    
                                    {!isMobile && 
                                        <React.Fragment>
                                            <td>{report.reporter.nickName}</td>
                                            <td className='date'>{report.createAt.date} {report.createAt.time}</td>
                                        </React.Fragment>
                                    }
                                    {/* 신고승인 토글버튼 */}
                                    <td className='toggle-td'>
                                        <input
                                            className="react-switch-checkbox"
                                            id={`admin-confirm-${report._id}`}
                                            type="checkbox"
                                            checked={report.isConfirmed}
                                            onChange={()=> toggleConfirmReport(report._id)}
                                        />
                                        <label
                                            className="react-switch-label"
                                            htmlFor={`admin-confirm-${report._id}`}
                                        >
                                        <span className={`react-switch-button`} />
                                        </label>
                                    </td>
                                </tr>
                                {isShowDetailInfo && detailInfo._id === report._id && (
                                    <React.Fragment>
                                        {isMobile &&
                                            <React.Fragment>
                                                <tr className='detail-info-tr'>
                                                    <td className='f-bold hide-tab-header'>내용</td>
                                                    <td colSpan="12">
                                                        {detailInfo.contentType === 'MeetUp' ? detailInfo.meetUpId.description : 
                                                        detailInfo.contentType === 'Post' ? detailInfo.postId.content : 
                                                        detailInfo.qnaId.content}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        }
                                            <tr className='detail-info-tr'>
                                                {!isMobile && <td className='blank-td'></td>}
                                                <td className='f-bold hide-tab-header'>신고사유</td>
                                                <td colSpan="12">{detailInfo.reasons.map((reason, index) => <div key={`${index}-${reason}`}>{reason}</div>)}</td>
                                            </tr>
                                    

                                        {isMobile &&
                                            <React.Fragment>
                                                <tr className='detail-info-tr'>
                                                    <td className='f-bold hide-tab-header'>신고자</td>
                                                    <td colSpan="12">{detailInfo.reporter.nickName}</td>
                                                </tr>
                                                <tr className='detail-info-tr'>
                                                    <td className='f-bold hide-tab-header'>신고일시</td>
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
                            <td colSpan={header.length}>신고 내역이 없습니다</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default ReportTable
