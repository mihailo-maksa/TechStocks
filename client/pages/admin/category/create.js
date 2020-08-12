import { useState } from "react";
import { API } from "../../../config";
import axios from "axios";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";

const Create = ({ user, token }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    content: "",
    formData: process.browser && new FormData()
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Create Category");
  const [imageUploadText, setImageUploadText] = useState("Upload Image");

  const closeSucessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = name === "image" ? e.target.files[0] : e.target.value;
    const imageName =
      name === "image" ? e.target.files[0].name : "Upload Image";

    categoryData.formData.set(name, value);

    setCategoryData({ ...categoryData, [name]: value });
    setImageUploadText(imageName);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Creating Category...");

    try {
      const res = await axios.post(`${API}/category`, categoryData.formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "multipart/form-data"
        }
      });

      setCategoryData({
        name: "",
        content: "",
        formData: process.browser && new FormData()
      });
      setButtonText("Category Created");
      setImageUploadText("Upload Image");
      setSuccess(`"${res.data.name}" is created.`);
    } catch (err) {
      setCategoryData({
        name: "",
        content: "",
        formData: process.browser && new FormData()
      });
      setButtonText("Create Category");
      setImageUploadText("Upload Image");
      setError(err.response.data.error);
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Category Name</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={handleChange}
          name="name"
          value={categoryData.name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          type="text"
          cols="30"
          rows="8"
          className="form-control"
          onChange={handleChange}
          name="content"
          value={categoryData.content}
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary bold-btn pointer upload-image-btn">
          {imageUploadText}
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            required
            onChange={handleChange}
            hidden
          />
        </label>
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
          <h1 className="text-center">Create Category</h1>
          <br />
          {success && showSuccessMessage(success, closeSucessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
