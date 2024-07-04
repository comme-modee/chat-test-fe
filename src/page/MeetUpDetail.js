import React, { useEffect, useState } from 'react';
import "../style/meetUpDetail.style.css";
import { Row, Col, Accordion, Modal, Button, Dropdown, Form } from 'react-bootstrap';
import MeetUpMemberProfile from '../component/MeetUpMemberProfile';
import Map from '../component/Map';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { meetUpActions } from '../action/meetUpAction';
import ClipLoader from 'react-spinners/ClipLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { commonUiActions } from '../action/commonUiAction';
import { reportActions } from '../action/reportAction';
import WriteBtn from '../component/WriteBtn';


////////////////////////////////////////////////////////////////////////////////
//추가된 부분 ↓↓↓ 신고사유
const reasons = [ 
  '모임 참가비 과액 유도',
  '모임 참여 멤버 외에 외부인원 초대',
  '개인 연락처 또는 1:1 만남 강요',
  '특정 종교의 권유, 포교, 전도 목적 의심',
  '사기, 허위, 범죄 등 오해의 소지가 있는 내용 포함',
  '기타'
];

//신고사유들 오브젝트 형식으로 변환. 기본세팅값 모두 false로 세팅. 이후 사용자가 체크하면 true되게
const initialCheckboxStates = reasons.reduce((acc, reason) => {
    acc[reason] = false;
    return acc;
}, {});
////////////////////////////////////////////////////////////////////////////////



const MeetUpDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { selectedMeetUp, loading } = useSelector((state) => state.meetUp);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  ////////////////////////////////////////////////////////////////////////////////
  //추가된 부분 ↓↓↓
  const [ isMyPost, setIsMyPost ] = useState(false);
  const [ isReportModalOpen, setIsReportModalOpen ] = useState(false);
  const [ checkboxStates, setCheckboxStates ] = useState(initialCheckboxStates);

  useEffect(() => {
    dispatch(meetUpActions.getMeetUpDetail(id));
  }, [id, dispatch]);


  //추가된 부분 ↓↓↓ 내 글인지 확인하고 isMyPost 세팅
  useEffect(()=>{
      if(selectedMeetUp && user && selectedMeetUp.organizer._id === user._id) {
          setIsMyPost(true)
      } else {
          setIsMyPost(false)
      }
  },[selectedMeetUp, user])
  ////////////////////////////////////////////////////////////////////////////////////


  const joinMeetUp = (status) => {
    if (status === "join") {
      if (window.confirm("참여하시겠습니까?")) {
        dispatch(meetUpActions.joinMeetUp(id, navigate));
      }
    }

    if (status === "cancel") {
      dispatch(meetUpActions.leaveMeetUp(id, navigate));
    }
  }

  const updateMeetUp = () => {
    navigate(`/meetUp/write?type=edit&id=${id}`);
  }

  const deleteMeetUp = () => {
    // 현재 인원이 1인 경우(organizer만 있는 경우) 삭제 가능, 참여 인원이 있으면 삭제 불가
    if (selectedMeetUp.currentParticipants == 1) {
      dispatch(meetUpActions.deleteMeetUp(id, navigate));
    }
    else {
      setIsDeleteModalOpen(false);
      if (window.confirm("참여 인원이 있어 삭제하실 수 없습니다. 운영자에게 문의해주세요.")) {
        console.log("삭제 불가");
      }
    }
  }

  //추가된 부분 ↓↓↓////////////////////////////////////////////////////////
  const sendReport = () => {
      const reportedUserId = selectedMeetUp.organizer._id;
      const postId = undefined;
      const qnaId = undefined;
      const meetUpId = selectedMeetUp._id;
      const reasons = Object.keys(checkboxStates).filter(key => checkboxStates[key] === true);
      const contentType = 'MeetUp';
      if(reasons.length === 0) {
          dispatch(commonUiActions.showToastMessage('신고 사유를 선택해주세요.', 'error'))
          return
      }
      dispatch(reportActions.createReport(reportedUserId, postId, meetUpId, qnaId, contentType, reasons))
      setIsReportModalOpen(false)
  }

  const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setCheckboxStates(prevState => ({
          ...prevState,
          [name]: checked
      }));
  };
  ////////////////////////////////////////////////////////////////////////


  if (loading) {
    return (
      <div className='loading' >
        <ClipLoader color="#28A745" loading={loading} size={100} />
      </div>);
  }

  return (
    <>
            {/* 추가된 부분 ↓↓↓ */}
            {/* 신고모달 */}
            <Modal show={isReportModalOpen} onHide={() => setIsReportModalOpen(false)} dialogClassName='modal-dialog-centered' size='md'>
              <Modal.Header closeButton>
                <h5 className="modal-title">신고하기</h5>
              </Modal.Header>
              <Modal.Body>
                <div><strong>작성자</strong>: {selectedMeetUp?.organizer.nickName}</div>
                <div><strong>모임 제목</strong>: {selectedMeetUp?.title}</div>
                <hr/>
                <div>
                  <strong>사유선택</strong>
                  <Form>
                      {reasons && reasons.map((reason, index) => (
                          <Form.Check
                              key={`${index}`}
                              id={`reason-${index+1}`}
                              type={'checkbox'}
                              name={reason}
                              label={reason}
                              checked={checkboxStates[reason]}
                              onChange={handleCheckboxChange}
                          />
                      ))}
                  </Form>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="light" onClick={() => setIsReportModalOpen(false)}>
                  취소
                </Button>
                <Button variant="danger" onClick={sendReport}>
                  신고하기
                </Button>
              </Modal.Footer>
          </Modal>




      <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} dialogClassName='modal-dialog-centered' size='sm'>
        <Modal.Header closeButton>
          <h5 className="modal-title">모임 삭제</h5>
        </Modal.Header>
        <Modal.Body>
          정말 삭제하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={deleteMeetUp}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <div className='contents-header-btns'>
                <WriteBtn type='meetup'/>
        </div>
        <div className='meetup-detail-container'>
          <div className='title'>{selectedMeetUp?.title}</div>



          {/* 추가된 부분 ↓↓↓ */}
          <div className='detail-page-user-container'>
            <div className='author'>
                <span className='img'><img src={selectedMeetUp?.organizer.profileImage} alt=''/></span>
                <span className='user-name' onClick={() => navigate(`/me/${selectedMeetUp?.organizer.nickName}`)}>{selectedMeetUp?.organizer.nickName}</span>
                <span className='small-text'>{selectedMeetUp?.createAt.date} {selectedMeetUp?.createAt.time}</span>
            </div>

            {isMyPost ? 
            <Dropdown>
                <Dropdown.Toggle variant='none'>
                    <FontAwesomeIcon icon={faEllipsisVertical}/> 
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => updateMeetUp()}>수정하기</Dropdown.Item>
                    <Dropdown.Item onClick={() => setIsDeleteModalOpen(true)} variant='danger'>삭제하기</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> : 

            <Dropdown>
                <Dropdown.Toggle variant='none'>
                    <FontAwesomeIcon icon={faEllipsisVertical}/> 
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {/* <Dropdown.Item onClick={() => setIsScrapModalOpen(true)}>스크랩하기</Dropdown.Item> */}
                    <Dropdown.Item onClick={() => setIsReportModalOpen(true)}>신고하기</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>}
        </div>
        {/* 추가된 부분 ↑↑↑ */}



          <div className='content'>
            <div className='content-title'>소개</div>
            {selectedMeetUp?.description}
          </div>

          <div className='meetup-info'>
            <div><span className='meetup-info-title'>카테고리 : </span>{selectedMeetUp?.category}</div>
            <Row>
              <Col md={3}>
                <span className='meetup-info-title'>모집 인원 : </span>{selectedMeetUp?.currentParticipants}/{selectedMeetUp?.maxParticipants}
              </Col>
              <Col md={3}>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>멤버 보기({selectedMeetUp?.currentParticipants})</Accordion.Header>
                    <Accordion.Body>
                      {selectedMeetUp?.participants.map((participant, index) => (
                        <MeetUpMemberProfile key={index} participant={participant} />
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
            <div><span className='meetup-info-title'>시작 예정 : </span>{selectedMeetUp?.date.date} {selectedMeetUp?.date.time}</div>
            <div><span className='meetup-info-title'>장소 : </span>{selectedMeetUp?.location === "online" ? (<span>온라인</span>) : selectedMeetUp?.location.replace(/;/g, ' ')}</div>
            <div>{selectedMeetUp?.location === "online" ? (<></>) : (<Map location={selectedMeetUp?.location} />)}</div>
            <div style={{ marginTop: "30px" }}></div>
            <div className='meetup-info-title'>관련 이미지</div>
            <img className="meetup-img" src={selectedMeetUp?.image} />
          </div>

          {user._id === selectedMeetUp?.organizer._id ?
            (<></>)
            :
            (
              (selectedMeetUp?.isClosed) ?
                (<div className='meetup-btn-container'>
                  <button className='white-btn-disabled' disabled={true} >모집 마감</button>
                </div>)
                :
                (selectedMeetUp?.participants.find(participant => participant.nickName === user.nickName) ?
                  (
                    <div className='meetup-btn-container'>
                      <button className='white-btn' onClick={() => joinMeetUp("cancel")}>참여취소</button>
                    </div>)
                  :
                  (
                    <div className='meetup-btn-container'>
                      <button className='white-btn' onClick={() => joinMeetUp("join")}>참여하기</button>
                    </div>
                  )
                )
            )
          }


        </div>
      </div>

    </>
  )
}

export default MeetUpDetail