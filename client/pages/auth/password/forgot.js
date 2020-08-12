import { useState } from "react";
import axios from "axios";
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../utils/alerts";
import Layout from "../../../components/Layout";
import Link from "next/link";

const ForgotPassword = () => {
  const [buttonText, setButtonText] = useState("Send Login Link");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);
  const handleChange = (e) => {
    setSuccess("");
    setError("");
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending Login Link...");

    try {
      const res = await axios.put(
        `${API}/forgot-password`,
        { email },
        {
          headers: {
            contentType: "application/json"
          }
        }
      );
      setEmail("");
      setButtonText("Login Link Sent");
      setSuccess(res.data.message);
    } catch (err) {
      setEmail("");
      setButtonText("Send Login Link");
      setError(err.response.data.error);
    }
  };

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="form-control"
          value={email}
          required
        />
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
          <h1 className="text-center">Forgot Password</h1>
          <br />
          {success && showSuccessMessage(success, closeSuccessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {passwordForgotForm()}
          <p className="my-1">
            Remember your password?{" "}
            <Link href="/login">
              <a className="text-success bold">Login</a>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
