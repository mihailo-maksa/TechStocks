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

const Update = ({ token, oldCategory }) => {
  const [updateData, setUpdateData] = useState({
    name: oldCategory.name,
    image: ""
  });
  const [imagePreview, setImagePreview] = useState(oldCategory.image.url);
  const [content, setContent] = useState(oldCategory.content);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Update Category");
  const [imageUploadText, setImageUploadText] = useState("Update Image");

  const closeErrorAlert = () => setError(null);
  const closeSuccessAlert = () => setSuccess(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
    setSuccess("");
    setError("");
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
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setUpdateData({ ...updateData, image: uri });
          setError("");
          setSuccess("");
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Updating Category...");

    const { name, image } = updateData;

    try {
      const res = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, image, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUpdateData({
        name: res.data.name,
        image: ""
      });
      setImagePreview(res.data.image.url);
      setContent(res.data.content);
      setButtonText("Category Updated");
      setTimeout(() => setButtonText("Update Category"), 1000);
      setImageUploadText("Update Image");
      setSuccess(`'${res.data.name}' is updated.`);
    } catch (err) {
      setUpdateData({
        name: oldCategory.name,
        image: ""
      });
      setContent(oldCategory.content);
      setButtonText("Update Category");
      setImageUploadText("Update Image");
      setError(err.response.data.error);
    }
  };

  const updateCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Category Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={updateData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category Description</label>
        <ReactQuill
          theme="bubble"
          value={content}
          onChange={handleContent}
          className="pb-5 mb-3 quill"
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary btn-bold bold image-upload-btn pointer">
          {imageUploadText}
          <span>
            <img
              src={imagePreview}
              alt={updateData.name}
              height="20"
              className="ml-1"
            />
          </span>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={handleImage}
            hidden
          />
        </label>
      </div>
      <div className="form-group">
        <button className="btn btn-outline-success bold-btn bold" type="submit">
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center">Edit Category</h1>
          <br />
          {success && showSuccessMessage(success, closeSuccessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  try {
    const res = await axios.post(`${API}/category/${query.slug}`);
    return {
      oldCategory: res.data.category,
      token
    };
  } catch (err) {
    console.error(err);
  }
};

export default withAdmin(Update);
