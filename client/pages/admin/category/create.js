import dynamic from "next/dynamic";
import { useState } from "react";
import { API } from "../../../config";
import axios from "axios";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import Resizer from "react-image-file-resizer";
import "react-quill/dist/quill.bubble.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Create = ({ user, token }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    image: ""
  });
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Create Category");
  const [imageUploadText, setImageUploadText] = useState("Upload Image");

  const closeSucessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCategoryData({ ...categoryData, [name]: value });

    setError("");
    setSuccess("");
  };

  const handleContent = (e) => {
    setContent(e);
    setError("");
    setSuccess("");
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    let fileInput = file ? true : false;

    setImageUploadText(file.name);

    if (fileInput) {
      Resizer.imageFileResizer(
        file, // file (Blob type)
        300, // max width
        300, // max height
        "JPEG", // image format
        100, // quality
        0, // rotation
        (uri) => {
          // response uri function
          setCategoryData({ ...categoryData, image: uri });
          setSuccess("");
          setError("");
        },
        "base64" // output type (base64, i.e. Buffer)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Creating Category...");

    try {
      const res = await axios.post(
        `${API}/category`,
        {
          name: categoryData.name,
          content: content,
          image: categoryData.image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "application/json"
          }
        }
      );

      setCategoryData({
        name: "",
        image: ""
      });
      setContent("");
      setButtonText("Category Created");
      setImageUploadText("Upload Image");
      setSuccess(`"${res.data.name}" is created.`);
    } catch (err) {
      setCategoryData({
        name: "",
        image: ""
      });
      setContent("");
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
        <label className="text-muted">Category Description</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          theme="bubble"
          className="pb-5 mb-3 quill"
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
            onChange={handleImage}
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
          <h1 className="text-center">Create New Category</h1>
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
