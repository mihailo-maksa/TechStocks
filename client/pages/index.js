import Layout from "../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API } from "../config";
import { useState, useEffect } from "react";
import moment from "moment";
import { getCookie } from "../utils/auth";

const Home = ({ categories, token }) => {
  const [trendingStocks, setTrendingStocks] = useState([]);

  const loadTrendingStocks = async () => {
    try {
      const res = await axios.get(`${API}/stock/popular`);
      setTrendingStocks(res.data);
    } catch (err) {
      console.error("Home Page Popular Links Fetching Error: ", err);
    }
  };

  useEffect(() => {
    loadTrendingStocks();
  }, []);

  const handleClick = async (stockId) => {
    const res = await axios.put(
      `${API}/click-count`,
      { stockId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadTrendingStocks();
  };

  const listCategories = () =>
    categories &&
    categories.map((c, i) => (
      <Link href={`/stocks/${c.slug}`} key={i}>
        <a
          className=" bg-light p-3 col-md-4 category-link"
          /* style={{ margin: "1px" }} */
        >
          <div className="homepage-category">
            <div className="row categ">
              <div className="col-md-4">
                <img
                  className="category-img pr-3 home-img"
                  src={c.image && c.image.url}
                  alt={c.name}
                />
              </div>
              <div className="col-md-8">
                <h3 className="homepage-category-title home-title">{c.name}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  const listOfStocks = () =>
    trendingStocks &&
    trendingStocks.map((s) => {
      return (
        <div
          className="row alert alert-light green-border pt-3 mt-2 ml-3"
          key={s._id}
        >
          <div className="col-md-8">
            <Link href={`/stocks/s/${s._id}`}>
              <a onClick={() => handleClick(s._id)} target="_blank">
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

            <div className="mt-3"></div>
          </div>

          <div
            className="col-md-4 pt-2"
            style={{ position: "relative", left: "11%" }}
          >
            <span
              className="pull-right postedBy-homepage"
              style={{ fontSize: "15px", maxWidth: "20%" }}
            >
              {moment(s.createdAt).fromNow()}{" "}
              {s.postedBy && `by ${s.postedBy.name}`}
            </span>
          </div>

          <div className="col-md-12 stock-bottom">
            <span>
              <span className="badge text-dark">
                {s.type} | {s.rating} |
              </span>
              {s.categories.map((c) => (
                <Link href={`/stocks/${c.slug}`} key={c._id}>
                  <a style={{ margin: 0, padding: 0 }}>
                    <span className="badge text-success">{c.name}</span>
                  </a>
                </Link>
              ))}
            </span>

            <span className="badge text-right text-secondary pull-right bold">
              {s.clicks.length}{" "}
              {s.clicks.length === 1
                ? "unique user click"
                : "unique user clicks"}
            </span>
          </div>
        </div>
      );
    });

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center font-weight-bold">
            Tech Stocks Categories
          </h1>
          <br />
        </div>
      </div>

      <div className="row list-of-categories">{listCategories()}</div>

      <h2 className="bold pb-3 text-center mt-5">Trending Stocks (Top 3)</h2>
      <div className="row pt-2">
        <div className="col-md-12 overflow-hidden list-of-trending-stocks">
          {listOfStocks()}
        </div>
      </div>
    </Layout>
  );
};

// React.useEffect() - fetches data after component is rendered, on the client side
// React.getInitialProps() - fetches data before component is even rendered, on the server side
Home.getInitialProps = async ({ req }) => {
  try {
    const res = await axios.get(`${API}/categories`);
    const token = getCookie("token", req);

    return { categories: res.data, token };
  } catch (err) {
    console.error(err);
  }
};

export default Home;
