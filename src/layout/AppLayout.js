import React, { useEffect } from "react";
import { useLocation } from "react-router";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import CustomContainer from "../component/CustomContainer";
import ToastMessage from "../component/ToastMessage";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from '../action/userAction';
import '../style/admin.style.css';
import ChatBtn from "../component/ChatBtn";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
// 토큰이 있다면 로그인 상태로 넘겨주기
  useEffect(() => {
    dispatch(userActions.loginWithToken());
  }, [dispatch]);

  return (
    <div>
      <ToastMessage />
      { !location.pathname.includes("/me/") && location.pathname.includes("admin") ? (
        <div className="admin-page">
          <div className="sidebar mobile-sidebar">
            <Sidebar />
          </div>
          <div className="contents">
            {children}
          </div>
        </div>
      ) : (
        <>
          {user && <ChatBtn/>}
          <Navbar user={user} />
          <CustomContainer children={children}></CustomContainer>
        </>
      )}
    </div>
  );
};

export default AppLayout;
