import { useState } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import renderHTML from "react-render-html";
import Moment from "react-moment";
import { getCookie, isAuth } from "../../../utils/auth";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";

const Stock = ({ query, stock, token }) => {
  const [loadedStock, setLoadedStock] = useState(stock);
  const [rate, setRate] = useState("");
  const [buttonText, setButtonText] = useState("Submit");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const closeErrorAlert = () => setError(null);
  const closeSucessAlert = () => setSuccess(null);

  const handleRateChange = (e) => {
    setRate(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      setButtonText("Submitting...");
    }

    try {
      const res = await axios.put(
        `${API}/rate-stock`,
        {
          rate,
          stockId: loadedStock._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setButtonText("Submit");
      setSuccess("Your rating is added.");
    } catch (err) {
      setButtonText("Submit");
      setError(err.response.data.error);
    }
  };

  const stockForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-check ml-2 mb-1">
        <label className="form-check-label">
          <input
            type="radio"
            readOnly
            name="rate"
            className="form-check-input"
            value="Bullish"
            onClick={handleRateChange}
            checked={
              loadedStock.ratings.find(
                (rating) => rating.user === loadedStock.postedBy._id
              ) &&
              loadedStock.ratings.find((rating) => rating.rate === "Bullish")
            }
          />
          Bullish
        </label>
      </div>
      <div className="form-check ml-2">
        <label className="form-check-label">
          <input
            type="radio"
            name="rate"
            readOnly
            className="form-check-input"
            value="Bearish"
            checked={
              loadedStock.ratings.find(
                (rating) => rating.user === loadedStock.postedBy._id
              ) &&
              loadedStock.ratings.find((rating) => rating.rate === "Bearish")
            }
            onClick={handleRateChange}
          />
          Bearish
        </label>
      </div>

      <div className="mt-3">
        <button
          className={`btn bold btn-outline-${
            isAuth() || token ? "success" : "danger"
          }`}
          type="submit"
          disabled={!token}
        >
          {isAuth() || token ? buttonText : "Login to Submit"}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center bold">
            {loadedStock.name} ({loadedStock.ticker})
          </h1>
          <div
            className="lead alert category-content mt-4 pt-4 bold-green-border"
            style={{
              borderRadius: "5px"
            }}
          >
            {renderHTML(loadedStock.description)}
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="stock-details col-md-5 offset-md-1 flex-center">
          <h3 className="text-center mb-3">Details</h3>
          <div className="stock-info mb-2">
            <span className="ml-1">
              <span className="bold">Company Website: </span>
              <a
                href={loadedStock.url}
                target="_blank"
                className="bold"
                style={{ fontSize: "0.75em" }}
              >
                {loadedStock.url}
              </a>
            </span>
          </div>
          <div className="stock-info mb-2">
            <span className="ml-1">
              <span className="bold">Category: </span>
              {loadedStock.categories.map((c) => (
                <span
                  className="badge badge-success ml-1 mt-1 mb-1"
                  key={c._id}
                >
                  {c.name}
                </span>
              ))}
            </span>
          </div>
          <div className="stock-info mb-2">
            <span className="ml-1">
              <span className="bold mr-1">Stock Type:</span>
              {loadedStock.type}
            </span>
          </div>
          <div className="stock-info mb-2">
            <span className="ml-1 bold">Posted By: </span>{" "}
            <span className="ml-1">{loadedStock.postedBy.name}</span>
          </div>
          <div className="stock-info">
            <span className="ml-1 bold"> Date Posted: </span>
            <Moment format="DD/MM/YYYY" className="ml-1">
              {loadedStock.createdAt}
            </Moment>
          </div>
        </div>

        <div className="stock-popularity col-md-5 flex-center">
          <h3 className="text-center mb-2">Ratings</h3>
          <div className="stock-info mb-2 mt-3">
            <span className="ml-1 bold">Total Unique User Clicks: </span>
            <span className="badge badge-success ml-1 mt-1 mb-1">
              {" "}
              {loadedStock.clicks.length}
            </span>
          </div>
          <div className="stock-info mb-2">
            <span className="ml-1 bold">Bullish Ratings:</span>
            <span className="badge badge-success ml-2 mt-1 mb-1">
              {loadedStock.bullishRatings}
            </span>
          </div>
          <div className="stock-info mb-2 mt-1 mb-1">
            <span className="ml-1 bold">Bearish Ratings:</span>
            <span className="badge badge-danger ml-2 mt-1 mb-1">
              {loadedStock.bearishRatings}
            </span>
          </div>
          <div className="stock-info">
            <span className="ml-1 bold">
              {loadedStock.postedBy.name}'s Rating:
            </span>
            <span
              className={`badge ml-2 mt-1 mb-1 badge-${
                loadedStock.rating === "Buy" ? "success" : "danger"
              }`}
            >
              {loadedStock.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="row pt-4 mt-2">
        <div className="col-md-6 offset-md-3 rate-form mb-3">
          <h2 className="text-center">Rate This Stock</h2>
          <br />
          {success && showSuccessMessage(success, closeSucessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {stockForm()}
        </div>
      </div>
    </Layout>
  );
};

Stock.getInitialProps = async ({ query, req }) => {
  try {
    const token = getCookie("token", req);

    const res = await axios.get(`${API}/stock/${query.id}`);

    return {
      stock: res.data,
      query,
      token
    };
  } catch (err) {
    console.error({ individualStockPageError: err });
  }
};

export default Stock;
