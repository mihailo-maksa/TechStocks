import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { API } from "../config";
import { isAuth, setCookie } from "../utils/auth";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Register");
  const [hidden, setHidden] = useState(true);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [favoriteCategories, setFavoriteCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);

      setLoadedCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    isAuth() && Router.push("/");
    loadCategories();
  }, [success]);

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
    setButtonText("Registering...");

    try {
      const res = await axios.post(
        `${API}/register`,
        {
          // body
          username: userData.username,
          email: userData.email,
          password: userData.password,
          categories: favoriteCategories
        },
        { headers: { "Content-Type": "application/json" } } // config
      );

      setUserData({
        username: "",
        email: "",
        password: ""
      });
      setButtonText("Submitted");
      setSuccess(res.data.message);
    } catch (err) {
      setUserData({ ...userData, password: "" });
      setButtonText("Register");
      setError(err.response.data.error);
    }
  };

  const handleToggle = (id) => {
    const clickedCategoryId = favoriteCategories.indexOf(id);
    const allChosenCategories = [...favoriteCategories];

    if (clickedCategoryId === -1) {
      allChosenCategories.push(id);
    } else {
      allChosenCategories.splice(clickedCategoryId, 1);
    }

    setFavoriteCategories(allChosenCategories);
    setError("");
    setSuccess("");
  };

  const showCategories = () =>
    loadedCategories &&
    loadedCategories.map((c) => (
      <li className="list-unstyled ml-4" key={c._id}>
        <input
          type="checkbox"
          onChange={() => handleToggle(c._id)}
          className="mr-2"
        />
        <label className="form-check-label">{c.name}</label>
      </li>
    ));

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          onChange={handleChange}
          value={userData.username}
          name="username"
          type="text"
          className="form-control"
          placeholder="Name"
          required
        />
      </div>
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
        <label className="text-muted ml-4 bold">
          What topics are you interested in the most?
        </label>
        <ul className="list-group category-list">{showCategories()}</ul>
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
        <h1 className="text-center">Register</h1>
        <br />
        {success && showSuccessMessage(success, closeSuccessAlert)}
        {error && showErrorMessage(error, closeErrorAlert)}
        {registerForm()}
        <p className="my-1">
          Already have an account?{" "}
          <Link href="/login">
            <a className="text-success bolder">Login</a>
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Register;
