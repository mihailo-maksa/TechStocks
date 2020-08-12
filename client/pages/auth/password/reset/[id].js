import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../../utils/alerts";
import { withRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import jwt from "jsonwebtoken";

const ResetPassword = ({ router }) => {
  const [buttonText, setButtonText] = useState("Reset Password");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [hidden, setHidden] = useState(true);
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const decoded = jwt.decode(router.query.id);
    if (decoded) {
      setName(decoded.name);
      setToken(router.query.id);
    }
  }, [router]);

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);
  const handleChange = (e) => {
    setSuccess("");
    setError("");
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Updating Your Password...");

    try {
      const res = await axios.put(
        `${API}/reset-password`,
        { resetPasswordLink: token, newPassword },
        {
          headers: {
            contentType: "application/json"
          }
        }
      );

      setNewPassword("");
      setButtonText("Password Updated Successfully!");
      setSuccess(res.data.message);
      setShowLink(true);
    } catch (err) {
      setNewPassword("");
      setButtonText("Reset Password");
      setError(err.response.data.error);
      setShowLink(false);
    }
  };

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="input-group">
          <input
            type={hidden ? "password" : "text"}
            className="form-control"
            placeholder="New Password"
            required
            onChange={handleChange}
            value={newPassword}
            name="newPassword"
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center">Reset Your Password</h1>
          <br />
          {success && showSuccessMessage(success, closeSuccessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {passwordResetForm()}
          {showLink && (
            <React.Fragment>
              <p className="my-1 float-left bold">Welcome back, {name}!</p>
              <p className="my-1 float-right">
                <Link href="/login">
                  <a className="text-success bold">
                    Login with your new password
                  </a>
                </Link>
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
