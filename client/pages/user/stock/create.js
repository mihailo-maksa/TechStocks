import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";

const Create = () => {
  const [stockData, setStockData] = useState({
    name: "",
    url: "",
    type: "",
    categories: [],
    rating: "",
    ticker: "",
    description: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadedCategories, setLoadedCategories] = useState([]);

  const closeErrorAlert = () => setError(null);
  const closeSucessAlert = () => setSuccess(null);

  const createStockForm = () => (
    <form>
      <div className="form-group">
        <input type="text" name="" id="" className="form-control" />
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center">Create New Stock</h1>
          <br />
          {success && showSuccessMessage(success, closeSucessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
          {createStockForm()}
        </div>
      </div>
    </Layout>
  );
};

export default Create;
