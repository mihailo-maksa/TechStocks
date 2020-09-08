import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";
import { getCookie, isAuth } from "../../../utils/auth";
import "react-quill/dist/quill.bubble.css";
const Quill = dynamic(() => import("react-quill"), { ssr: false });

const Create = ({ token }) => {
  const [stockData, setStockData] = useState({
    name: "", // text input
    url: "", // text input
    type: "", // radio inputs
    categories: [], // checkboxes (array)
    rating: "", // radio inputs
    ticker: "", // text input
    description: "" // textarea (with rich text editor)
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [buttonText, setButtonText] = useState("Submit");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
  const closeSucessAlert = () => setSuccess(null);

  const handleNameChange = (e) => {
    setStockData({ ...stockData, name: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleTickerChange = (e) => {
    setStockData({ ...stockData, ticker: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleDescriptionChange = (e) => {
    setStockData({ ...stockData, description: e });
    setError("");
    setSuccess("");
  };

  const handleURLChange = (e) => {
    setStockData({ ...stockData, url: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleToggle = (id) => {
    // array.indexOf(item) - returns the index of the item that you're
    // searching for in an array; if item is not found, returns -1
    const clickedCategoryId = stockData.categories.indexOf(id);
    const all = [...stockData.categories];

    if (clickedCategoryId === -1) {
      all.push(id);
    } else {
      // array.splice(elementToDelete, numberOfElementsToBeDeleted)
      // returns the deleted elements
      all.splice(clickedCategoryId, 1);
    }

    setStockData({ ...stockData, categories: all });
    setError("");
    setSuccess("");
  };

  const handleTypeClick = (e) => {
    setStockData({ ...stockData, type: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleRatingClick = (e) => {
    setStockData({ ...stockData, rating: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      setButtonText("Creating stock...");
    }

    const {
      name,
      ticker,
      description,
      url,
      categories,
      type,
      rating
    } = stockData;

    try {
      const body = { name, ticker, description, url, categories, type, rating };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.post(`${API}/stock`, body, config);

      setButtonText("Submit");

      setStockData({
        name: "",
        url: "",
        type: "",
        categories: [],
        rating: "",
        ticker: "",
        description: ""
      });

      setSuccess(`${name} is created`);
    } catch (err) {
      setButtonText("Submit");
      setError(err.response.data.error);
    }
  };

  const createStockForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted bold">Company Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          onChange={handleNameChange}
          value={stockData.name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">Ticker Symbol</label>
        <input
          type="text"
          name="ticker"
          className="form-control"
          onChange={handleTickerChange}
          value={stockData.ticker}
        />
      </div>
      <div className="form-group">
        <label className="text-muted bold">Company Description</label>
        <Quill
          onChange={handleDescriptionChange}
          value={stockData.description}
          theme="bubble"
          className="pb-5 mb-3 quill"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">
          <strong>Company Website</strong>
        </label>
        <input
          type="url"
          name="url"
          className="form-control"
          onChange={handleURLChange}
          value={stockData.url}
        />
      </div>
      {isMobile && (
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
      )}
      <div className="form-group">
        <button
          disabled={!token}
          type="submit"
          className={`btn btn-outline-${
            isAuth() || token ? "success" : "danger"
          } bold ${isMobile && "ml-3"}`}
        >
          {isAuth() || token ? buttonText : "Login to Submit"}
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
            checked={stockData.type === "Growth"}
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
            checked={stockData.type === "Value"}
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
            checked={stockData.rating === "Buy"}
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
            checked={stockData.rating === "Sell"}
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
          <h1 className="text-center">Add New Stock</h1>
          <br />
          {success && showSuccessMessage(success, closeSucessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
        </div>
      </div>

      <div className="row">
        {!isMobile && (
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
        )}
        <div className="col-md-8">{createStockForm()}</div>
      </div>
    </Layout>
  );
};

Create.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  return { token };
};

export default Create;
