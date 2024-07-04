import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { meetUpActions } from "../action/meetUpAction";
import MeetUpTable from "../component/MeetUpTable";

const AdminMeetUp = () => {
  const dispatch = useDispatch();
  const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 768)
  const { adminMeetUpList } = useSelector((state) => state.meetUp);
  const tableHeader = !isMobile ? [
    "#",
    "링크",
    "제목",
    "작성자",
    "카테고리",
    "작성일",
    "삭제여부",
    "공개제한"
  ] : [
    "링크",
    "제목",
    "작성자",
    "카테고리",
    "공개제한"
  ];

  useEffect(() => {
    dispatch(meetUpActions.getAdminMeetUpList());
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
      {adminMeetUpList &&
        <MeetUpTable
          header={tableHeader}
          meetUpList={adminMeetUpList}
          isMobile={isMobile}
        />
      }
      
    </div>
  )
}

export default AdminMeetUp