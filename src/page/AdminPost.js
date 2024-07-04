import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostTable from "../component/PostTable";
import { postActions } from '../action/postAction';

const AdminPost = () => {
  const dispatch = useDispatch();
  const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 768)
  const { adminPostList } = useSelector((state) => state.post);
  const tableHeader = !isMobile ? [
    "#",
    "링크",
    "카테고리",
    "제목",
    "작성자",
    "작성일",
    "공개제한"
  ] : [
    "링크",
    "카테고리",
    "제목",
    "작성자",
    "공개제한",
  ];

  useEffect(() => {
    dispatch(postActions.getAdminPostList());
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
      {adminPostList &&
        <PostTable
          header={tableHeader}
          postList={adminPostList}
          isMobile={isMobile}
        />
      }
      
    </div>
  )
}

export default AdminPost