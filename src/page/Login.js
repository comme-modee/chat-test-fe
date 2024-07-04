import * as types from "../constants/user.constants";
import React, { useState, useEffect } from "react";
import "../style/login.style.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../action/userAction";
import ClipLoader from "react-spinners/ClipLoader";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    dispatch({ type: types.SET_FIND_USER, payload: null })
  },[])

  useEffect(() => {
    // user가 있으면 메인 페이지로 이동 - 이미 로그인한 유저는 로그인 페이지에 못 들어오게 막기 위함
    if (user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(userActions.clearError());
    };
  }, [dispatch]);

  const loginWithEmail = (event) => {
    event.preventDefault();

    dispatch(userActions.loginWithEmail({ email, password }));
  }

  const handleGoogleLogin = async (googleData) => {
    // 구글로 로그인 하기
    dispatch(userActions.loginWithGoogle(googleData.credential));
  };

  return (
    <div>
      <div className='login-title'>LOGIN</div>
      <div className="login-line" />
      {loading ?
        (<div className='loading'><ClipLoader color="#28A745" loading={loading} size={100} /></div>)
        :
        (<Container className="login-container">
          {error && (
            <div>
              <Alert className="error-message" variant="danger">{error}</Alert>
            </div>
          )}

          <Form className="login-form" onSubmit={loginWithEmail}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Row>
                <Col md={4}>
                  <Form.Label className="login-form-label">이메일 아이디</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    className="login-form-input"
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    required
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Row>
                <Col md={4}>
                  <Form.Label className="login-form-label">비밀번호</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    className="login-form-input"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

            <div className="login-button-container">
              <Link to='/forgetPassword'>비밀번호를 잊으셨나요?</Link>
            </div>

            <div className="login-button-container">
              <Button className='login-button' type="submit">
                로그인
              </Button>
            </div>

            <div className="login-button-container">
              <Button className="signup-button">
                <Link to="/register">이메일로 가입하기</Link>
              </Button>
            </div>

            <div className="display-center-center" style={{ marginTop: "30px" }}>
              <div>- 외부 계정으로 로그인 -</div>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>
          </Form>
        </Container >
        )
      }

    </div>
  )
}

export default Login