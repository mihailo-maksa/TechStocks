import { useState, useEffect } from "react";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import { API } from "../../../config";
import Layout from "../../../components/Layout";

const ActivateAccount = ({ router }) => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [buttonText, setButtonText] = useState("Activate Account");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { username } = jwt.decode(token);
      setName(username);
      setToken(token);
    }
  }, [router]);

  const handleClick = async (e) => {
    e.preventDefault();
    setButtonText("Activating...");

    try {
      const res = await axios.post(
        `${API}/register/activate`,
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      setName("");
      setToken("");
      setButtonText("Activated");
      setSuccess(res.data.message);
    } catch (err) {
      setButtonText("Activate Account");
      setError(err.response.data.error);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center">
            Welcome to TechStocks, {name && name}!
          </h1>
          <br />
          {success && showSuccessMessage(success, closeSuccessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          <button
            onClick={handleClick}
            className="btn btn-outline-success btn-block bold-btn"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
