import Layout from "../../../components/Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import withUser from "../../withUser";

const Update = () => {
  const [updateData, setUpdateData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    oldPassword: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const handleChange = (e) => {
    //
  };

  const handleSubmit = async (e) => {
    //
  };

  const updateProfileForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted bold">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={updateData.name}
          onChange={handleChange}
        />
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

export default withUser(Update);
