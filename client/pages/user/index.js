import Layout from "../../components/Layout";
import withUser from "../withUser";
import Link from "next/link";
import moment from "moment";
import { useState } from "react";
import axios from "axios";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../utils/alerts";
import Router from "next/router";

const User = ({ user, userStocks, token }) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API}/stock/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(res.data.message);

      Router.replace("/user");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const confirmDelete = (id) => {
    let answer = window.confirm("Are you sure you want to delete this stock?");
    if (answer) {
      handleDelete(id);
    }
  };

  const listOfStocks = () =>
    userStocks.map((s) => (
      <div className="row alert alert-light p-2 green-border" key={s._id}>
        <div className="col-md-8">
          <Link href={`/stocks/s/${s.slug}`}>
            <a target="_blank">
              <h5
                className="pt-2 text-dark bold underline"
                style={{ display: "inline" }}
              >
                {s.name}
              </h5>{" "}
              <span
                className="pt-2 text-dark not-underline stock-url"
                style={{ fontSize: "16px" }}
              >
                ({s.ticker})
              </span>
            </a>
          </Link>
        </div>
        <div
          className="col-md-4 pt-2"
          style={{ position: "relative", left: "7%" }}
        >
          <span
            className="pull-right"
            style={{ fontSize: "15px", maxWidth: "20%" }}
          >
            {moment(s.createdAt).fromNow()} by {s.postedBy.name}
          </span>
        </div>
        <div className="col-md-12 mt-3">
          <div className="stock-bottom">
            <div>
              <span className="badge text-dark">
                {s.type} | {s.rating} |
              </span>
              {s.categories.map((c, i) => (
                <span className="badge text-success" key={i}>
                  {c.name}
                </span>
              ))}
            </div>
            <span className="badge text-secondary pull-right">
              {s.clicks.length}{" "}
              {s.clicks.length === 1
                ? "unique user click"
                : "unique user clicks"}
            </span>
            <span
              className="badge btn bold text-danger pull-right"
              onClick={() => confirmDelete(s._id)}
            >
              Delete
            </span>
            <a href={`/user/stock/${s._id}`}>
              <span className="badge btn bold text-success pull-right">
                Update
              </span>
            </a>
          </div>
        </div>
      </div>
    ));

  return (
    <Layout>
      <p className="text-center">
        <span
          style={{
            display: "inline-block",
            fontSize: "2.5em",
            fontWeight: "500"
          }}
        >
          {user.name}'s Dashboard <span className="text-danger">/</span>
        </span>
        <span
          className="text-danger"
          style={{ display: "inline-block", fontSize: "1.5em" }}
        >
          <span className="badge badge-danger ml-2 p-2"> {user.role}</span>
        </span>
      </p>
      <hr />
      {success && showSuccessMessage(success, closeSuccessAlert)}
      {error && showErrorMessage(error, closeErrorAlert)}
      <div className="row mt-4">
        <div className="col-md-4">
          <ul className="na flex-colum link-list">
            <li className="nav-item bold mb-3 ml-5 mt-3">
              <a
                href="/user/stock/create"
                className="nav-link btn bold btn-outline-primary p-2"
              >
                Create Stock
              </a>
            </li>
            <li className="nav-item bold ml-5">
              <Link href="/user/profile/update">
                <a className="nav-link btn bold btn-outline-primary p-2">
                  Update Profile
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2 className="text-center mb-3">Your Stocks</h2>
          <br />
          {listOfStocks()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
