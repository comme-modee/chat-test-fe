import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reportActions } from "../action/reportAction";
import ReportTable from "../component/ReportTable";

const AdminReport = () => {
  const dispatch = useDispatch();
  const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 768)
  const { reportList } = useSelector((state) => state.report);
  const tableHeader = !isMobile ? [
    "#",
    "링크",
    "카테고리",
    "제목",
    "작성자",
    "신고자",
    "신고일시",
    "신고승인"
  ] : [
    "링크",
    "카테고리",
    "제목",
    "작성자",
    "신고승인",
  ];

  useEffect(() => {
    dispatch(reportActions.getAllReport());
  }, [dispatch]);


  useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []); 

  return (
    <div className="locate-center">
      {reportList &&
        <ReportTable
          header={tableHeader}
          reportList={reportList}
          isMobile={isMobile}
        />
      }
      
    </div>
  )
}

export default AdminReport