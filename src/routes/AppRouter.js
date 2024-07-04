import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

const Home = lazy(() => import('../page/Home'));
const Login = lazy(() => import('../page/Login'));
const Register = lazy(() => import('../page/Register'));
const ForgetPassword = lazy(() => import('../page/ForgetPassword'));
const PostAll = lazy(() => import('../page/PostAll'));
const PostDetail = lazy(() => import('../page/PostDetail'));
const PostWrite = lazy(() => import('../page/PostWrite'));
const Qna = lazy(() => import('../page/Qna'));
const QnaDetail = lazy(() => import('../page/QnaDetail'));
const QnaWrite = lazy(() => import('../page/QnaWrite'));
const MeetUp = lazy(() => import('../page/MeetUp'));
const MeetUpDetail = lazy(() => import('../page/MeetUpDetail'));
const MeetUpWrite = lazy(() => import('../page/MeetUpWrite'));
const MyPage = lazy(() => import('../page/MyPage'));
const AccountPage = lazy(() => import('../page/AccountPage'));
const Admin = lazy(() => import('../page/Admin'));
const AdminPost = lazy(() => import('../page/AdminPost'));
const AdminQna = lazy(() => import('../page/AdminQna'));
const AdminMeetUp = lazy(() => import('../page/AdminMeetUp'));
const AdminReport = lazy(() => import('../page/AdminReport'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));


const AppRouter = () => {
  return (
    <Suspense fallback={<div className='loading-page'></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/me/:nickName" element={<MyPage />} />
        <Route element={<PrivateRoute permissionLevel="user" />}>
          <Route path="/post" element={<PostAll />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/write" element={<PostWrite />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/qna/:id" element={<QnaDetail />} />
          <Route path="/qna/write" element={<QnaWrite />} />
          <Route path="/meetup" element={<MeetUp />} />
          <Route path="/meetup/:id" element={<MeetUpDetail />} />
          <Route path="/meetup/write" element={<MeetUpWrite />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route element={<PrivateRoute permissionLevel="admin" />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/post" element={<AdminPost />} />
          <Route path="/admin/qna" element={<AdminQna />} />
          <Route path="/admin/meetup" element={<AdminMeetUp />} />
          <Route path="/admin/report" element={<AdminReport />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
