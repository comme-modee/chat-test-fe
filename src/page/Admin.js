import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from "../action/userAction";
import UserTable from "../component/UserTable";

const Admin = () => {
  const dispatch = useDispatch();
  const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 540)
  const { userList, loading } = useSelector((state) => state.user);
  const tableHeader = !isMobile ? [
    "#",
    "DEV",
    "이름/이메일",
    "성별",
    "랭크",
    "삭제",
    "레벨",
    "신고",
    "활동제한",
  ] : [
    "DEV",
    "이름/이메일",
    "삭제",
    "활동제한",
  ];

  useEffect(() => {
    dispatch(userActions.getUserList());
  }, []);


  useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth <= 540);
      };

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []); 

  return (
    <div className="locate-center">
      {userList &&
        <UserTable
          header={tableHeader}
          userList={userList}
          isMobile={isMobile}
        />
      }
    </div>
  )
}

export default Admin