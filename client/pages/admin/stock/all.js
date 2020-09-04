import Layout from "../../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API } from "../../../config";
import { useState } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { getCookie } from "../../../utils/auth";
import withAdmin from "../../withAdmin";
import { showErrorMessage, showSuccessMessage } from "../../../utils/alerts";

const AllStocks = ({ stocks, totalStocks, stocksLimit, stockSkip, token }) => {
  const [allStocks, setAllStocks] = useState(stocks);
  const [limit, setLimit] = useState(stocksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalStocks);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const closeSuccessAlert = () => setSuccess(null);
  const closeErrorAlert = () => setError(null);

  const deleteStock = async (id) => {
    try {
      const res = await axios.delete(`${API}/stock/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(res.data.message);

      process.browser && window.location.reload();
    } catch (err) {
      console.error(err.response.data.error);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      deleteStock(id);
    }
  };

  const listOfStocks = () =>
    allStocks.map((s) => (
      <div
        className="row alert alert-light green-border pt-3 mt-2 ml-3"
        key={s._id}
      >
        <div className="col-md-8">
          <Link href={`/stocks/s/${s._id}`}>
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

          <div className="mt-3"></div>
        </div>

        <div
          className="col-md-4 pt-2"
          style={{ position: "relative", left: "16%" }}
        >
          <span
            className="pull-right"
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
            {s.clicks.length === 1 ? "unique user click" : "unique user clicks"}
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
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;

    try {
      const res = await axios.post(
        `${API}/stocks`,
        {
          skip: toSkip,
          limit
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAllStocks([...allStocks, ...res.data]);
      setSize(res.data.length);
      setSkip(toSkip);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="display-4 font-weight-bold text-center">All Stocks</h1>
        </div>
      </div>

      {success && showSuccessMessage(success, closeSuccessAlert)}
      {error && showErrorMessage(error, closeErrorAlert)}

      <br />

      <div className="row">
        <div className="col-md-12">{listOfStocks()}</div>
      </div>

      <div className="row flex-center">
        <div className="col-md- md-offset-4">
          <InfiniteScroll
            pageStart={0} // starting page, 0 most of the time
            loadMore={loadMore} // loadMore custom function
            hasMore={size > 0 && size >= limit} // if true, page can be scrolled further
            loader={
              // loader element or image
              <img
                key={0}
                src="/static/images/spinner.gif"
                alt="Loading..."
                style={{
                  maxWidth: "50px",
                  maxHeight: "50px"
                }}
              />
            }
          >
            <React.Fragment></React.Fragment>
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

AllStocks.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;

  const token = getCookie("token", req);

  try {
    const res = await axios.post(
      `${API}/stocks`,
      { skip, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      stocks: res.data,
      totalStocks: res.data.length,
      stocksLimit: limit,
      stockSkip: skip,
      token
    };
  } catch (err) {
    console.error({ fullError: err, errorMessage: err.response.data.error });
  }
};

export default withAdmin(AllStocks);
