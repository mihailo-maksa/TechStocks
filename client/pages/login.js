import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { API } from "../config";
import { authenticate, isAuth } from "../utils/auth";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Logging you in...");

    try {
      const res = await axios.post(
        `${API}/login`,
        {
          email: userData.email,
          password: userData.password
        },
        { headers: { "Content-Type": "application/json" } }
      );

      authenticate(res, () =>
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user")
      );

      setUserData({
        email: "",
        password: ""
      });
      setButtonText("Submitted");
      setSuccess(res.data.message);
    } catch (err) {
      setUserData({ ...userData, password: "" });
      setButtonText("Login");
      setError(err.response.data.error);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          onChange={handleChange}
          value={userData.email}
          name="email"
          type="email"
          className="form-control"
          placeholder="Email"
          required
        />
      </div>
      <div className="form-group">
        <div className="input-group">
          <input
            onChange={handleChange}
            value={userData.password}
            name="password"
            type={hidden ? "password" : "text"}
            className="form-control"
            placeholder="Password"
            required
          />
          <div className="input-group-append">
            <div
              className="input-group-text eye-btn"
              onClick={() => setHidden(!hidden)}
            >
              <i className={hidden ? "fas fa-eye" : "fas fa-eye-slash"} />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <button className="btn btn-outline-success bold-btn">
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1 className="text-center">Login</h1>
        <br />
        {success && showSuccessMessage(success, closeSuccessAlert)}
        {error && showErrorMessage(error, closeErrorAlert)}
        {loginForm()}
        <p className="my-1">
          Don't have an account?{" "}
          <Link href="/register">
            <a className="text-success bolder">Register</a>
          </Link>
          <Link href="/auth/password/forgot">
            <a className="text-danger float-right bold">Forgot Password</a>
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;
