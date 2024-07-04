import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import "../style/meetUpWrite.style.css";
import CloudinaryUploadWidget from '../utils/CloudinaryUploadWidget';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { meetUpActions } from '../action/meetUpAction';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { commonUiActions } from '../action/commonUiAction';

const initialFormData = {
  title: '',
  description: '',
  date: '',
  category: '',
  image: '',
  maxParticipants: 2,
  location: 'online'
};

const MeetUpWrite = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { selectedMeetUp, loading } = useSelector((state) => state.meetUp);
  // selectedMeetUp의 date를 다시 Date 객체로
  const dateString = selectedMeetUp?.date.date + " " + selectedMeetUp?.date.time;
  const dateObject = parse(dateString, 'yyyy.MM.dd HH:mm:ss', new Date());

  const [query, setQuery] = useSearchParams();
  const [type, setType] = useState(query.get("type"));
  const open = useDaumPostcodePopup();

  const [formData, setFormData] = useState({ ...initialFormData });
  const [imageUrl, setImageUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedEditDate, setSelectedEditDate] = useState(dateObject);
  const [selectedEditTime, setSelectedEditTime] = useState(dateObject);
  const [zipcode, setZipCode] = useState("");
  const [address, setAddress] = useState(type === "edit" ? (selectedMeetUp.location === "online" ? "online" : selectedMeetUp.location.split(";")[0].trim()) : "online");
  const [detailAddress, setDetailAddress] = useState(type === "edit" ? (selectedMeetUp.location === "online" ? "" : selectedMeetUp.location.split(";").slice(1).join('').trim()) : "");
  const [isOffline, setIsOffline] = useState(type === "edit" ? (selectedMeetUp.location === "online" ? false : true) : false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //selectedMeetUp 있으면 그 내용으로 채우고 없으면 null
  const [editFormData, setEditFormData] = useState(selectedMeetUp ? {
    title: selectedMeetUp.title,
    description: selectedMeetUp.description,
    date: dateObject,
    category: selectedMeetUp.category,
    image: selectedMeetUp.image,
    maxParticipants: selectedMeetUp.maxParticipants,
    location: selectedMeetUp.location,
  } : null);

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user])

  const submitMeeting = (event) => {
    event.preventDefault();

    if (type === "new") {
      if (address === "online") {
        setFormData({ ...formData, location: "online" });
      }
      else {
        setFormData({ ...formData, location: address + ";" + detailAddress });
      }
    }
    else if (type === "edit") {
      if (address === "online") {
        setEditFormData({ ...editFormData, location: "online" });
      }
      else {
        setEditFormData({ ...editFormData, location: address + ";" + detailAddress });
      }
    }

    setIsModalOpen(true);
  }

  const addMeeting = (event) => {
    if (type === "new") {
      // 만약 image가 빈 값이면 아예 image 속성 제거
      if (formData.image === "") {
        delete formData.image;
      }
      dispatch(meetUpActions.createMeetUp(formData, navigate));

      setIsModalOpen(false);
    }
  }

  const updateMeeting = (event) => {
    if (type === "edit") {
      dispatch(meetUpActions.updateMeetUp(editFormData, selectedMeetUp._id, navigate));

      setIsModalOpen(false);
    }
  }

  const uploadedimage = (url) => {
    if (type === "new") {
      setFormData({ ...formData, image: url });
    }
    else if (type === "edit") {
      setEditFormData({ ...editFormData, image: url });
    }
  }

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (type === "new") {
      setFormData({ ...formData, [id]: value });
    }
    else if (type === "edit") {
      setEditFormData({ ...editFormData, [id]: value });
    }

  }

  const handleDateChange = (date) => {
    if (type === "new") {
      setSelectedDate(date);
      if (date && selectedTime) {
        setFormData({ ...formData, date: format(date, "yyyy-MM-dd'T'") + format(selectedTime, 'HH:mm:ss') });
      }
    }
    else if (type === "edit") {
      setSelectedEditDate(date);
      if (date && selectedEditTime) {
        setEditFormData({ ...editFormData, date: format(date, "yyyy-MM-dd'T'") + format(selectedEditTime, 'HH:mm:ss') });
      }
    }
  }

  const handleTimeChange = (time) => {
    if (type === "new") {
      setSelectedTime(time);
      if (selectedDate && time) {
        setFormData({ ...formData, date: format(selectedDate, "yyyy-MM-dd'T'") + format(time, 'HH:mm:ss') });
      }
    }
    else if (type === "edit") {
      setSelectedEditTime(time);
      if (selectedEditDate && time) {
        setEditFormData({ ...editFormData, date: format(selectedEditDate, "yyyy-MM-dd'T'") + format(time, 'HH:mm:ss') });
      }
    }
  }

  const handleComplete = (data) => {
    setIsOffline(true);

    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    // console.log(data); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    setZipCode(data.zonecode);
    setAddress(fullAddress);
  };

  const handleToggle = (e) => {
    setIsOffline(e.target.checked);

    if (e.target.checked) {
      open({ onComplete: handleComplete });
    }
    else {
      setIsOffline(false);
      setZipCode("");
      setAddress("online");
      setDetailAddress("");
    }
  };

  const changeLocation = () => {
    open({ onComplete: handleComplete });
  }

  const errorController = (error) => {
    dispatch(commonUiActions.showToastMessage("이미지 등록에 실패했습니다.", "error"));
  }

  return (
    <>

      {
        type === "new" ?
          (
            <>
              <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} dialogClassName='modal-dialog-centered' size='md'>
                <Modal.Header closeButton>
                  <h5 className="modal-title">등록하시겠습니까?</h5>
                </Modal.Header>
                <Modal.Body>
                  <div className='mb-1'><strong>모임 이름 :</strong> {formData?.title}</div>
                  <div className='mb-1'><strong>내용 :</strong> {formData?.description}</div>
                  <div className='mb-1'><strong>카테고리 :</strong> {formData?.category}</div>
                  <div className='mb-1'><strong>날짜 :</strong> {formData?.date && format(formData?.date, "yyyy/MM/dd HH:mm")}</div>
                  <div className='mb-1'><strong>위치 :</strong> {formData?.location === "online" ? (<span>온라인</span>) : (<span>{formData?.location}</span>)}</div>
                  <div className='mb-1'><strong>참가인원 :</strong> {formData?.maxParticipants}</div>
                  <div style={{ color: "red" }}>모임 생성 후, 참여 인원이 없을 경우에만 삭제가 가능합니다.</div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light" onClick={() => setIsModalOpen(false)}>
                    취소
                  </Button>
                  <Button variant="danger" onClick={addMeeting}>
                    등록
                  </Button>
                </Modal.Footer>
              </Modal>
              <Container className='meetup-container'>
                <div className='title'>모임 등록</div>
                <Form className="meetup-form" onSubmit={submitMeeting}>
                  <Row className="meetup-user-info">
                    <Col className="meetup-user-info-img" md={2} xs={2}>
                      <img src={user.profileImage} />
                    </Col>
                    <Col md={10} xs={10}>
                      <div className="meetup-user-info-name">{user.userName}</div>
                      <div className="meetup-user-info-des">{user.description}</div>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">모임 이름<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Control
                      id="title"
                      className="form-input"
                      type="text"
                      placeholder="모임 이름을 입력해주세요"
                      onChange={(event) => handleChange(event)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">내용<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Control
                      id='description'
                      className="form-input"
                      as="textarea"
                      type="text"
                      rows={3}
                      placeholder="모임 내용을 입력해주세요
            ex)1주일 1번 노드JS 스터디 함께 해요!"
                      onChange={(event) => handleChange(event)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">대표 이미지 업로드</Form.Label>
                    <div className='meetup-thumbnail'>
                      <img id="uploadedimage" src={imageUrl || "https://cdn-icons-png.flaticon.com/128/1829/1829586.png"} alt="uploadedimage" />
                      {" "}<CloudinaryUploadWidget uploadImage={uploadedimage} errorController={errorController} />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">카테고리<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Select
                      id="category"
                      defaultValue={formData?.category || ''}
                      onChange={(event) => handleChange(event)}
                      required
                    >
                      <option value='' disabled hidden>카테고리 선택</option>
                      <option value='스터디'>스터디</option>
                      <option value='프로젝트'>프로젝트</option>
                      <option value='강의'>강의</option>
                      <option value='독서'>독서</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">날짜<a style={{ color: "#28A745" }}>*</a></Form.Label>{" "}
                    <DatePicker
                      id="meet-date"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      placeholderText='날짜를 선택해주세요'
                      required
                    />
                    {selectedDate &&
                      (<div>선택된 날짜 : {selectedDate.toLocaleDateString()}</div>)}
                    <div></div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">시간<a style={{ color: "#28A745" }}>*</a></Form.Label>{" "}
                    <DatePicker
                      id="meet-time"
                      selected={selectedTime}
                      onChange={handleTimeChange}
                      dateFormat="HH:mm"
                      showTimeSelect
                      showTimeSelectOnly
                      placeholderText='시간을 선택해주세요'
                      required
                    />
                    {selectedTime &&
                      (<div>선택된 시간 : {selectedTime.toLocaleTimeString()}</div>)}
                    <div></div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">위치<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      checked={isOffline}
                      onChange={handleToggle}
                      label="오프라인으로 진행하면 눌러주세요"
                    />
                    <div>내 선택 : {isOffline ? (<span>오프라인</span>) : (<span>온라인</span>)}</div>
                    {
                      isOffline &&
                      (
                        <>
                          <Form.Control
                            className="form-input-disabled"
                            type="text"
                            placeholder="우편번호"
                            value={zipcode}
                            disabled
                          />
                          <Form.Control
                            className="form-input-disabled"
                            type="text"
                            placeholder="기본 주소"
                            value={address === "online" ? "" : address}
                            disabled
                          />
                          <Form.Control
                            value={detailAddress}
                            className="form-input"
                            type="text"
                            placeholder="상세 주소"
                            onChange={(event) => setDetailAddress(event.target.value)}
                            required
                          />
                          <button type="button" className='white-btn' onClick={changeLocation}>주소 변경</button>
                        </>
                      )
                    }
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">모집 인원<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Control
                      id="maxParticipants"
                      value={formData?.maxParticipants}
                      type="number"
                      placeholder="인원 수"
                      className="form-input"
                      min={2}
                      max={10}
                      onChange={(event) => handleChange(event)}
                    />
                  </Form.Group>

                  <Button className="green-btn" type="submit">등록</Button>
                </Form>
              </Container >
            </>
          )
          :
          (<div></div>)
      }
      {
        type === "edit" ?
          (
            <>
              <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} dialogClassName='modal-dialog-centered' size='sm'>
                <Modal.Header closeButton>
                  <h5 className="modal-title">수정하시겠습니까?</h5>
                </Modal.Header>
                <Modal.Body>
                  <div>모임 이름 : {editFormData?.title}</div>
                  <div>내용 : {editFormData?.description}</div>
                  <div>카테고리 : {editFormData?.category}</div>
                  <div>날짜 : {editFormData?.date && format(editFormData?.date, "yyyy/MM/dd HH:mm")}</div>
                  <div>위치 : {editFormData?.location === "online" ? (<span>온라인</span>) : (<span>{editFormData?.location}</span>)}</div>
                  <div>참가인원 : {editFormData?.maxParticipants}</div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light" onClick={() => setIsModalOpen(false)}>
                    취소
                  </Button>
                  <Button variant="danger" onClick={updateMeeting}>
                    수정
                  </Button>
                </Modal.Footer>
              </Modal>
              <Container className='meetup-container'>
                <div className='title'>모임 수정</div>
                <div className='highlight-text'>이미지와 모집 인원만 수정 가능합니다</div>
                <Form className="meetup-form" onSubmit={submitMeeting}>
                  <Row className="meetup-user-info">
                    <Col className="meetup-user-info-img" md={2} xs={2}>
                      <img src={user.profileImage} />
                    </Col>
                    <Col md={10} xs={10}>
                      <div className="meetup-user-info-name">{user.userName}</div>
                      <div className="meetup-user-info-des">{user.description}</div>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">모임 이름<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Control
                      id="title"
                      className="form-input-disabled"
                      value={editFormData.title}
                      type="text"
                      placeholder="모임 이름을 입력해주세요"
                      onChange={(event) => handleChange(event)}
                      required
                      disabled={true}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">내용<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Control
                      id='description'
                      className="form-input-disabled"
                      value={editFormData.description}
                      as="textarea"
                      type="text"
                      rows={3}
                      placeholder="모임 내용을 입력해주세요
                                   ex)1주일 1번 노드JS 스터디 함께 해요!"
                      onChange={(event) => handleChange(event)}
                      required
                      disabled={true}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">대표 이미지 업로드</Form.Label>
                    <div className='meetup-thumbnail'>
                      <img id="uploadedimage" src={editFormData.image} alt="uploadedimage" />
                      {" "}<CloudinaryUploadWidget uploadImage={uploadedimage} errorController={errorController} />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3"> 
                    <Form.Label className="form-label">카테고리<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Select
                      id="category"
                      value={editFormData?.category[0] || ''}
                      onChange={(event) => handleChange(event)}
                      required
                      disabled={true}
                      multiple={false}
                    >
                      <option value='' disabled hidden>카테고리 선택</option>
                      <option value='스터디'>스터디</option>
                      <option value="프로젝트">프로젝트</option>
                      <option value='강의'>강의</option>
                      <option value='독서'>독서</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">날짜<a style={{ color: "#28A745" }}>*</a></Form.Label>{" "}
                    <DatePicker
                      id="meet-date-disabled"
                      selected={selectedEditDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      placeholderText='날짜를 선택해주세요'
                      disabled={true}
                      required
                    />
                    {selectedEditDate &&
                      (<div>선택된 날짜 : {selectedEditDate.toLocaleDateString()}</div>)}
                    <div></div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">시간<a style={{ color: "#28A745" }}>*</a></Form.Label>{" "}
                    <DatePicker
                      id="meet-time-disabled"
                      selected={selectedEditTime}
                      onChange={handleTimeChange}
                      dateFormat="HH:mm"
                      showTimeSelect
                      showTimeSelectOnly
                      placeholderText='시간을 선택해주세요'
                      disabled={true}
                      required
                    />
                    {selectedEditTime &&
                      (<div>선택된 시간 : {selectedEditTime.toLocaleTimeString()}</div>)}
                    <div></div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">위치<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      checked={isOffline}
                      onChange={handleToggle}
                      label="오프라인으로 진행하면 눌러주세요"
                      disabled={true}
                    />
                    <div>내 선택 : {isOffline ? (<span>오프라인</span>) : (<span>온라인</span>)}</div>
                    {
                      isOffline &&
                      (
                        <>
                          {(zipcode !== "") &&
                            <Form.Control
                              className="form-input-disabled"
                              type="text"
                              placeholder="우편번호"
                              value={zipcode}
                              disabled
                            />
                          }

                          <Form.Control
                            className="form-input-disabled"
                            type="text"
                            placeholder="기본 주소"
                            value={address === "online" ? "" : address}
                            disabled
                          />
                          <Form.Control
                            value={detailAddress}
                            className="form-input-disabled"
                            type="text"
                            placeholder="상세 주소"
                            onChange={(event) => setDetailAddress(event.target.value)}
                            disabled
                            required
                          />
                        </>
                      )
                    }
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">모집 인원<a style={{ color: "#28A745" }}>*</a></Form.Label>
                    <Form.Control
                      id="maxParticipants"
                      value={editFormData?.maxParticipants}
                      type="number"
                      placeholder="인원 수"
                      className="form-input"
                      min={selectedMeetUp?.currentParticipants}
                      max={10}
                      onChange={(event) => handleChange(event)}
                    />
                  </Form.Group>

                  <Button className="green-btn" type="submit">수정</Button>
                </Form>
              </Container >
            </>
          )
          :
          (<div></div>)
      }
    </>
  )
}

export default MeetUpWrite