import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API } from "../../config";
import renderHTML from "react-render-html";
import { useState } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { getCookie } from "../../utils/auth";

const Stocks = ({
  query,
  category,
  stocks,
  totalStocks,
  stocksLimit,
  stockSkip,
  token
}) => {
  const [allStocks, setAllStocks] = useState(stocks);
  const [limit, setLimit] = useState(stocksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalStocks);

  const loadUpdatedLinks = async () => {
    const res = await axios.post(`${API}/category/${query.slug}`);
    setAllStocks([...res.data.stocks]);
  };

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
    loadUpdatedLinks();
  };

  const listOfStocks = () =>
    allStocks &&
    allStocks.map((s) => (
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
          style={{ position: "relative", left: "7%" }}
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
              <Link href={`/stocks/${query.slug}`} key={c._id}>
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
        </div>
      </div>
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;

    try {
      const res = await axios.post(`${API}/category/${query.slug}`, {
        skip: toSkip,
        limit
      });

      setAllStocks([...allStocks, ...res.data.stocks]);
      setSize(res.data.stocks.length);
      setSkip(toSkip);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">{category.name} Stocks</h1>
          <div className="lead alert category-content mt-3 pt-4 bold-green-border">
            {renderHTML(category.content)}
          </div>
        </div>

        <div className="col-md-4">
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "auto", maxHeight: "200px" }}
          />
        </div>
      </div>

      <br />

      <div className="row">
        <div className="col-md-8">{listOfStocks()}</div>
        <div className="col-md-4">
          <h2 className="lead text-center">Most Popular In {category.name}</h2>
          <p>Show popular stocks...</p>
        </div>
      </div>

      <div className="row flex-center">
        <div className="col-md-5 md-offset-4">
          <InfiniteScroll
            pageStart={0} // starting page, 0 most of the time
            loadMore={loadMore} // loadMore custom function
            hasMore={size > 0 && size >= limit} // if true, page can be scrolled further
            loader={
              // loader element/image
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

Stocks.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;

  const token = getCookie("token", req);

  try {
    const res = await axios.post(
      `${API}/category/${query.slug}`,
      { skip, limit },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      query: query,
      category: res.data.category,
      stocks: res.data.stocks,
      totalStocks: res.data.stocks.length,
      stocksLimit: limit,
      stockSkip: skip,
      token
    };
  } catch (err) {
    console.error({ fullError: err, errorMessage: err.response.data.error });
  }
};

export default Stocks;
