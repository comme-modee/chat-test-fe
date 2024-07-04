import React, { useEffect, useState } from 'react';
import '../style/account.style.css';
import { Col, Form, Row, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../action/userAction';
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import classnames from 'classnames';

const initialFormData = {
  userName: '',
  description: '',
  originalPassword: '',
  newPassword: '',
  profileImage: '',
  stacks: [],
};

const stackList = [
  "Java", "JavaScript", "TypeScript", "Spring", "HTML", "CSS3",
  "jQuery", "Oracle", "MySQL", "Spring Boot", "PHP", "Python",
  "Node.js", "Swift", "React", "React Native", "Angular",
  "Vue.js", "Kotlin", "MSSQL", "Git", "Github", "Bootstrap"
];

const stackColor = [
  "096F90", "F7DF1E", "3178C6", "6DB33F", "E34F26", "1572B6",
  "0769AD", "F80000", "4479A1", "6DB33F", "777BB4", "3776AB",
  "5FA04E", "F05138", "61DAFB", "61DAFB", "0F0F11",
  "4FC08D", "7F52FF", "4479A1", "F05032", "181717", "7952B3"
];

const initialCheckboxStates = stackList.reduce((acc, stack) => {
  acc[stack] = false;
  return acc;
}, {});

const AccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.user);
  const [userFormData, setUserFormData] = useState({
    ...initialFormData,
    userName: user.userName,
    description: user.description,
    stacks: user.stacks.includes('none') ? [] : user.stacks,
    profileImage: user.profileImage,
    nickName: user.nickName,
    gender: user.gender
  });
  const [checkboxStates, setCheckboxStates] = useState(initialCheckboxStates);
  const [IsUpdateNickName, setIsUpdateNickName] = useState(false);
  const [IsUpdateGender, setIsUpdateGender] = useState(false);
  const [nickNameError, setNickNameError] = useState("");
  const validateNickname = (nick) => {
    return /^[a-z0-9_]+$/.test(nick);
  }

  useEffect(() => {
    if (user) {
      const updatedCheckboxStates = { ...initialCheckboxStates };
      user.stacks.forEach(stack => {
        if (updatedCheckboxStates.hasOwnProperty(stack)) {
          updatedCheckboxStates[stack] = true;
        }
      });
      setCheckboxStates(updatedCheckboxStates);
    } else {
      navigate('/login')
    }
  }, [user])

  const uploadedimage = (url) => {
    setUserFormData({ ...userFormData, profileImage: url })
  }

  const updateUserInfo = async (e) => {
    e.preventDefault();
    console.log("updateUserInfo", userFormData);
    if (user?.googleUser) {
      if (!validateNickname(userFormData.nickName)) {
        setNickNameError("닉네임은 알파벳 소문자, 밑줄(_), 숫자만 가능합니다.");
        return;
      }
      else {
        setNickNameError("");
      }

      dispatch(userActions.updateGoogleUser(userFormData, navigate));
    }
    else {
      dispatch(userActions.updateUser(userFormData));
    }

  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserFormData({ ...userFormData, [id]: value });
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxStates(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const updateNickName = () => {
    console.log("updateNickName");
    setIsUpdateNickName(true);
  }

  const updateGender = () => {
    console.log("updateGender");
    setIsUpdateGender(true);
  }

  useEffect(() => {
    let selectedStacks = Object.keys(checkboxStates).filter(key => checkboxStates[key] === true)
    setUserFormData({ ...userFormData, stacks: selectedStacks })
  }, [checkboxStates])

  return (
    <div className='account-container'>
      <div className='title'>내 계정 정보</div>

      <Form onSubmit={updateUserInfo}>
        <Form.Group className="mb-3 profile-img display-center-center gap-10" controlId="profileImage">
          <div className='img'>
            <img id="uploadedimage" src={userFormData.profileImage} alt="uploadedimage" />
          </div>
          <CloudinaryUploadWidget uploadImage={uploadedimage} />
        </Form.Group>

        <div className='fixed-info'>
          <div className='stack'>
            <div className='title'><strong>stacks</strong> {userFormData.stacks.length === 0 ? <span className='small-text'>스택을 클릭해 추가해주세요.</span> : ''}</div>
            <div className='checkboxs'>
              {stackList && stackList.map((stack, index) => (
                <Form.Check
                  key={`${stack}${index}`}
                  id={`checkbox-${stack}`}
                  type={'checkbox'}
                  label={<img src={`https://img.shields.io/badge/${stack}-${stackColor[index]}?style=for-the-badge&logo=${stack}&logoColor=white`} alt='' />}
                  name={stack}
                  checked={checkboxStates[stack]}
                  className={classnames({
                    'custom-checked-class': checkboxStates[stack],
                    'custom-unchecked-class': !checkboxStates[stack]
                  })}
                  onChange={handleCheckboxChange}
                  hidden
                />
              ))}
            </div>
          </div>
          <div className='others'>
            <div><strong>닉네임: </strong>{user?.nickName} {user?.googleUser && !user?.isNicknameAndGenderChange && <button type="button" className="white-btn" onClick={updateNickName}>닉네임 변경(최초 1회 변경 후 수정 불가합니다)</button>}</div>
            {IsUpdateNickName &&
              (<div>
                {error && (
                  <div>
                    <Alert variant="danger" className="error-message">
                      {error}
                    </Alert>
                  </div>
                )}
                <Form.Control
                  className="login-form-input"
                  type="text"
                  id="nickName"
                  placeholder="닉네임은 알파벳 소문자, _, 숫자만 가능합니다"
                  onChange={handleChange}
                  isInvalid={nickNameError}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {nickNameError}
                </Form.Control.Feedback>
              </div>)}
            <div><strong>이메일: </strong>{user?.email}</div>
            <div><strong>성별: </strong>{user?.gender === "male" ? "남자" : user?.gender === "female" ? "여자" : "없음"} {user?.googleUser && !user?.isNicknameAndGenderChange && <button type="button" className="white-btn" onClick={updateGender}>성별 변경(최초 1회 변경 후 수정 불가합니다)</button>}</div>
            {IsUpdateGender &&
              (<Form.Select
                defaultValue=""
                onChange={handleChange}
                id="gender"
                required
              >
                <option value="" disabled hidden>
                  성별 입력
                </option>
                <option value="male">남자</option>
                <option value="female">여자</option>
              </Form.Select>)}
            <div className='rank'><strong>Rank: </strong>{user?.rank}</div>
            <div><strong>가입일자: </strong>{user?.createAt.date}</div>
          </div>
        </div>

        <Form.Group controlId="userName">
          <Row>
            <Col md={2}>
              <Form.Label>이름</Form.Label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder="이름을 입력해주세요"
                required
                value={userFormData.userName}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="description">
          <Row>
            <Col md={2}>
              <Form.Label>소개글</Form.Label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder="소개글을 입력해주세요"
                value={userFormData.description}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
        </Form.Group>

        {!user?.googleUser && (<>
          <Form.Group controlId='originalPassword'>
            <Row>
              <Col md={2}>
                <Form.Label>기존 비밀번호</Form.Label>
              </Col>
              <Col md={10}>
                <Form.Control
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={userFormData.originalPassword}
                  required
                  onChange={(e) => handleChange(e)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId='newPassword'>
            <Row>
              <Col md={2}>
                <Form.Label>새 비밀번호</Form.Label>
              </Col>
              <Col md={10}>
                <Form.Control
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={userFormData.newPassword}
                  onChange={(e) => handleChange(e)}
                />
              </Col>
            </Row>
          </Form.Group>
        </>)}

        <div className="submit">
          <button className='green-btn' type="submit">
            정보 수정
          </button>
        </div>
      </Form>
    </div>
  )
}

export default AccountPage