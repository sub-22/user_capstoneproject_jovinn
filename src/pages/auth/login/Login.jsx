import "./login.scss";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { clearMessage } from "../../../redux/message";
import { login } from "../../../redux/authSlice";
import Link from "@material-ui/core/Link";
import { fetchCurrentUser } from "../../../redux/userSlice";
const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const [successful, setSuccessful] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const { message } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearMessage());
    if (user) navigate("/buyerHome");
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("user name password: ", { username, password });
    if (
      !/^[^\s][a-zA-Z0-9]{4,28}[^\s]$/.test(username) ||
      password.length < 6 ||
      password.length > 30
    ) {
      setCheck(true);
    } else {
      dispatch(login({ username, password }))
        .unwrap()
        .then(() => {
          setSuccessful(true);
          dispatch(fetchCurrentUser());
        })
        .then(() => {
          navigate("/buyerhome");
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };
  return (
    <div className="login">
      <Link href="/">
        <p className="logo_login">Jovinn.</p>
      </Link>

      <form className="form" onSubmit={handleLogin}>
        <p className="title_form">Đăng nhập</p>
        <TextField
          className="input"
          variant="outlined"
          label="Tên đăng nhập"
          onChange={(e) => setUsername(e.target.value)}
          error={!/^[^\s][a-zA-Z0-9]{4,28}[^\s]$/.test(username) && check}
          helperText={
            (username.length < 6 || username.length > 30) &&
            check &&
            "Từ 6 đến 30 kí tự"
          }
          required
        />
        <TextField
          className="input"
          variant="outlined"
          type="password"
          label="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
          error={(password.length < 6 || password.length > 30) && check}
          helperText={
            (password.length < 6 || password.length > 30) &&
            check &&
            "Từ 6 đến 30 kí tự"
          }
          required
        />

        <Button variant="outlined" className="btn" type="submit">
          Đăng nhập
        </Button>
        <Link href="/auth/sendMail" color="#5327ef" className="link">
          Quên mật khẩu?
        </Link>
        <span className="link">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" color="#5327ef">
            Đăng kí
          </Link>
        </span>
        {message && (
          <div
            className={successful ? "login_success" : "login_error"}
            role="alert"
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
