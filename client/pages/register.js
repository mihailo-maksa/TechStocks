import { useState } from "react";
import Layout from "../components/Layout";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Register");
  const [hidden, setHidden] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    setUserData({
      name: "",
      email: "",
      password: ""
    });
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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
              className="input-group-text"
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
        <h1>Register</h1>
        <br />
        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
