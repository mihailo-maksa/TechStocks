import { useState, useEffect } from "react";
import { API } from "../../../config";
import axios from "axios";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";
import Link from "next/link";

const All = ({ user, token }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const closeSucessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const handleDelete = async (slug) => {
    try {
      const res = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(res.data.message);

      // LOAD CATEGORIES ONCE AGAIN AFTER DELETING
      loadCategories();
    } catch (err) {
      setError(err.response.data.error);
      console.log("Category delete error", err);
    }
  };

  const confirmDelete = (slug) => {
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (answer) {
      handleDelete(slug);
    }
  };

  const listCategories = () =>
    categories &&
    categories.map((c, i) => (
      <div key={i} className="bg-light p-3 col-md-6 category-link">
        <div>
          <div className="row">
            <div className="col-md-3">
              <img
                className="category-img pr-3"
                src={c.image && c.image.url}
                alt={c.name}
              />
            </div>
            <div className="col-md-6">
              <Link href={`/stocks/${c.slug}`} key={i}>
                <a>
                  <h3>{c.name}</h3>
                </a>
              </Link>
            </div>
            <div className="col-md-3">
              <Link href={`/admin/category/${c.slug}`}>
                <a className="btn btn-sm btn-outline-success bold btn-block mb-1">
                  Update
                </a>
              </Link>
              <button
                onClick={() => confirmDelete(c.slug)}
                className="btn btn-sm btn-outline-danger btn-block bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center">All Categories</h1>
          <br />
          {success && showSuccessMessage(success, closeSucessAlert)}
          {error && showErrorMessage(error, closeErrorAlert)}
        </div>
      </div>

      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default withAdmin(All);
