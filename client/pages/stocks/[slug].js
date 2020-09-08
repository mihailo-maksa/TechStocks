import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API, APP_NAME } from "../../config";
import renderHTML from "react-render-html";
import { useState, useEffect } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { getCookie } from "../../utils/auth";
import Head from "next/head";

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
  const [popularStocks, setPopularStocks] = useState([]);

  const loadPopularStocks = async () => {
    try {
      const res = await axios.get(`${API}/stock/popular/${query.slug}`);

      setPopularStocks(res.data);
    } catch (err) {
      console.error("Load popular stocks in a given category error: ", err);
    }
  };

  useEffect(() => {
    loadPopularStocks();
  }, []);

  const loadUpdatedStocks = async () => {
    const res = await axios.post(`${API}/category/${query.slug}`);
    setAllStocks([...res.data.stocks]); // all stocks in a given category
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
    loadUpdatedStocks();
    loadPopularStocks();
  };

  // removes HTML tags from a given string
  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

  const head = () => (
    <Head>
      <title>
        {category.name} Stocks | {APP_NAME}
      </title>
      <meta
        name="description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      {/* OG (open graph) standards - for making your data more shareable on social networks like Facebook */}
      <meta property="og:title" content={category.name} />
      <meta
        property="og:description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta property="og:image" content={category.image.url} />
      <meta property="og:image:secure_url" content={category.image.url} />
      <></>
      <meta charSet="utf-8" />
      <link rel="icon" href="/static/images/favicon.ico" />
      <link rel="manifest" href="/static/other/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="canonical"
        href="http://ec2-3-21-164-109.us-east-2.compute.amazonaws.com"
      />{" "}
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/static/css/styles.css" />
    </Head>
  );

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

  const listOfPopularStocks = () =>
    popularStocks &&
    popularStocks.map((s) => {
      return (
        <div
          className="p-2 row alert alert-light green-border pt- mt- ml-2"
          key={s._id}
        >
          <div className="col-md-8" style={{ marginRight: 0 }}>
            <Link href={`/stocks/s/${s._id}`}>
              <a onClick={() => handleClick(s._id)} target="_blank">
                <h5
                  className="pt- text-dark bold underline"
                  style={{ display: "inline", fontSize: "15px" }}
                >
                  {s.name}
                </h5>{" "}
                <span className="pt- text-dark not-underline stock-url">
                  ({s.ticker})
                </span>
              </a>
            </Link>

            <span
              className="pull-right postedBy-category"
              style={{ fontSize: "12px", width: "", display: "inline-block" }}
            >
              {moment(s.createdAt).fromNow()}{" "}
              {s.postedBy && `by ${s.postedBy.name}`}
            </span>

            <div className="mt-1"></div>
          </div>

          <div
            className="col-md-4 pt-2"
            style={{ position: "relative", left: "11%" }}
          ></div>

          <div className="col-md-12 stock-bottom">
            <span>
              <span className="badge text-dark font-12">
                {s.type} | {s.rating} |
              </span>
              {s.categories.map((c) => (
                <Link href={`/stocks/${c.slug}`} key={c._id}>
                  <a style={{ margin: 0, padding: 0 }}>
                    <span className="badge text-success font-12">{c.name}</span>
                  </a>
                </Link>
              ))}
            </span>

            <span className="font-12 badge text-right text-secondary pull-right bold">
              {s.clicks.length} {s.clicks.length === 1 ? "click" : "clicks"}
            </span>
          </div>
        </div>
      );
    });

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
    <Layout customHead={head}>
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-center display-4 font-weight-bold">
            {category.name} Stocks
          </h1>
          <div className="lead alert category-content mt-3 pt-4 bold-green-border">
            {renderHTML(category.content)}
          </div>
        </div>

        <div className="col-md-4">
          <img
            className="category-view-image"
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
          <h2 className="mb-4 bold lead text-center popular-in-category">
            Most Popular In {category.name}
          </h2>
          {listOfPopularStocks()}
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
