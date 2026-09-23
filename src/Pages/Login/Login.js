import React, { useState } from "react";
import Styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";
import { loginAuth } from "../../Services/login.service";
import { useDispatch } from "react-redux";
import { setToast } from "../../Redux/Reducer/ToastReducer";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (value) => {
    value.preventDefault();
    try {
      const payload = {
        email: usernameOrEmail,
        password,
      };
      const res = await loginAuth(payload);
      console.log(res, "LRES");
      if (res.data?.token) {
        console.log("Hoo");
        // Store token in localStorage or sessionStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data._id);

        navigate("/dashboard");
      }

      dispatch(
        setToast({
          message: res.message || "Login Successfully",
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        setToast({
          message: err.message || "Failed to load users",
          type: "error",
        })
      );
    }
  };

  return (
    <div className={Styles.container}>
      <form className={Styles.loginBox} onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className={Styles.inputGroup}>
          <label>Username or Email</label>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>

        <div className={Styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={Styles.loginBtn}>
          Login
        </button>

        <p className={Styles.signupText}>
          Don’t have an account? <a href="/signUp">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
