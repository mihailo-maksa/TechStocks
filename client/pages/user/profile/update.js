import Layout from "../../../components/Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import withUser from "../../withUser";
import { updateUser } from "../../../utils/auth";

const Profile = ({ user, token }) => {
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    password: ""
  });
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hidden, setHidden] = useState(true);
  const [buttonText, setButtonText] = useState("Update");
  const [favoriteCategories, setFavoriteCategories] = useState(user.categories);

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);

      setLoadedCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Updating...");

    try {
      const res = await axios.put(
        `${API}/user`,
        {
          name: userData.name,
          password: userData.password,
          categories: favoriteCategories
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update user in the localStorage
      updateUser(res.data, () => {
        setButtonText("Profile Updated");
        setTimeout(() => setButtonText("Update"), 1000);
        setSuccess("Profile updated successfully.");
      });
    } catch (err) {
      setButtonText("Update");
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
          checked={favoriteCategories.includes(c._id)}
          className="mr-2"
        />
        <label className="form-check-label">{c.name}</label>
      </li>
    ));

  const updateProfileForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted bold">Name</label>
        <input
          onChange={handleChange}
          value={userData.name}
          name="name"
          type="text"
          className="form-control"
          placeholder="Name"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">Email </label>
        <small> (Cannot be updated)</small>
        <input
          onChange={handleChange}
          value={userData.email}
          name="email"
          type="email"
          className="form-control"
          placeholder="Email"
          required
          disabled
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">New Password</label>
        <div className="input-group">
          <input
            onChange={handleChange}
            value={userData.password}
            name="password"
            type={hidden ? "password" : "text"}
            className="form-control"
            placeholder="New Password"
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center">Update Your Profile</h1>
          <br />
          {success && showSuccessMessage(success, closeSuccessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {updateProfileForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(Profile);
