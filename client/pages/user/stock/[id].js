import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { API } from "../../../config";
import axios from "axios";
import Layout from "../../../components/Layout";
import withUser from "../../withUser";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import "react-quill/dist/quill.bubble.css";
import { isAuth } from "../../../utils/auth";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Update = ({ oldStock, token }) => {
  const [updateData, setUpdateData] = useState({
    name: oldStock.name,
    ticker: oldStock.ticker,
    description: oldStock.description,
    url: oldStock.url,
    categories: oldStock.categories,
    type: oldStock.type,
    rating: oldStock.rating
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Update Stock");
  const [loadedCategories, setLoadedCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        setLoadedCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, [success]);

  const closeErrorAlert = () => setError(null);
  const closeSuccessAlert = () => setSuccess(null);

  const handleNameChange = (e) => {
    setUpdateData({ ...updateData, name: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleTickerChange = (e) => {
    setUpdateData({ ...updateData, ticker: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleDescriptionChange = (e) => {
    setUpdateData({ ...updateData, description: e });
    setError("");
    setSuccess("");
  };

  const handleURLChange = (e) => {
    setUpdateData({ ...updateData, url: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleToggle = (id) => {
    const clickedCategoryId = updateData.categories.indexOf(id);
    const all = [...updateData.categories];

    if (clickedCategoryId === -1) {
      all.push(id);
    } else {
      all.splice(clickedCategoryId, 1);
    }

    setUpdateData({ ...updateData, categories: all });
    setError("");
    setSuccess("");
  };

  const handleTypeClick = (e) => {
    setUpdateData({ ...updateData, type: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleRatingClick = (e) => {
    setUpdateData({ ...updateData, rating: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Updating Stock...");

    try {
      const {
        name,
        ticker,
        description,
        url,
        categories,
        type,
        rating
      } = updateData;

      let dynamicEndpoint =
        isAuth() && isAuth().role === "admin"
          ? `${API}/stock/admin/${oldStock._id}`
          : `${API}/stock/${oldStock._id}`;

      const res = await axios.put(
        dynamicEndpoint,
        {
          name,
          ticker,
          description,
          url,
          categories,
          type,
          rating
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setButtonText("Stock Updated");
      setTimeout(() => setButtonText("Update Stock"), 1000);
      setUpdateData({
        name: res.data.name,
        ticker: res.data.ticker,
        description: res.data.description,
        url: res.data.url,
        categories: res.data.categories,
        type: res.data.type,
        rating: res.data.rating
      });
      setSuccess(`${res.data.name} is updated.`);
    } catch (err) {
      setUpdateData({
        name: oldStock.name,
        ticker: oldStock.ticker,
        description: oldStock.description,
        url: oldStock.url,
        categories: oldStock.categories,
        type: oldStock.type,
        rating: oldStock.rating
      });
      setButtonText("Update Stock");
      setError(err.response.data.error);
    }
  };

  const updateStockForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-goup">
        <label className="text-muted bold">Company Name</label>
        <input
          type="text"
          className="form-control"
          value={updateData.name}
          onChange={handleNameChange}
          name="name"
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">Ticker Symbol</label>
        <input
          type="text"
          name="ticker"
          className="form-control"
          value={updateData.ticker}
          onChange={handleTickerChange}
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">Company Description</label>
        <ReactQuill
          theme="bubble"
          value={updateData.description}
          onChange={handleDescriptionChange}
          className="quill pb-5 mb-3"
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">Company Website</label>
        <input
          type="url"
          name="url"
          className="form-control"
          value={updateData.url}
          onChange={handleURLChange}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-outline-success bold" type="submit">
          {buttonText}
        </button>
      </div>
    </form>
  );

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c) => (
        <li className="list-unstyled ml-4" key={c._id}>
          <input
            type="checkbox"
            onChange={() => handleToggle(c._id)}
            className="mr-2"
            checked={updateData.categories.find(
              (oldCategory) => oldCategory.name === c.name
            )}
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTypes = () => (
    <React.Fragment>
      <div className="form-check ml-4">
        <label className="form-check-label">
          <input
            type="radio"
            readOnly
            onClick={handleTypeClick}
            checked={updateData.type === "Growth"}
            value="Growth"
            className="form-check-input"
            name="type"
          />
          Growth
        </label>
      </div>

      <div className="form-check ml-4">
        <label className="form-check-label">
          <input
            type="radio"
            readOnly
            onClick={handleTypeClick}
            checked={updateData.type === "Value"}
            value="Value"
            className="form-check-input"
            name="type"
          />
          Value
        </label>
      </div>
    </React.Fragment>
  );

  const showRatings = () => (
    <React.Fragment>
      <div className="form-check ml-4">
        <label className="form-check-label">
          <input
            type="radio"
            readOnly
            name="rating"
            value="Buy"
            checked={updateData.rating === "Buy"}
            onClick={handleRatingClick}
            className="form-check-input"
          />
          Buy
        </label>
      </div>

      <div className="form-check ml-4">
        <label className="form-check-label">
          <input
            type="radio"
            readOnly
            name="rating"
            value="Sell"
            onClick={handleRatingClick}
            checked={updateData.rating === "Sell"}
            className="form-check-input"
          />
          Sell
        </label>
      </div>
    </React.Fragment>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center">Edit Stock</h1>
          <br />
          {success && showSuccessMessage(success, closeSuccessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted ml-4 bold">Category</label>
            <ul className="list-group category-list">{showCategories()}</ul>
          </div>

          <div className="form-group">
            <label className="text-muted ml-4 bold">Stock Type</label>
            {showTypes()}
          </div>

          <div className="form-group">
            <label className="text-muted ml-4 bold">Personal Rating</label>
            {showRatings()}
          </div>
        </div>

        <div className="col-md-8">{updateStockForm()}</div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  try {
    const res = await axios.get(`${API}/stock/${query.id}`);

    return {
      oldStock: res.data,
      token
    };
  } catch (err) {
    console.error(err);
  }
};

export default withUser(Update);
