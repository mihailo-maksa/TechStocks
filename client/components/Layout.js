import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { isAuth, logout } from "../utils/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const head = () => (
    <Head>
      <title> Discover & Share Your Favorite Tech Stocks | TechStocks </title>
      <meta charSet="utf-8" />
      <link rel="icon" href="/static/images/favicon.ico" />
      <link rel="manifest" href="/static/other/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="A place for everyone to share their favorite tech stock picks. Let's beat the market together!"
      />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="http://example.com/" />{" "}
      {/* CHANGE href ATTRIBUTE HERE (i.e. Domain Name) BEFORE DEPLOYING*/}
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

  const nav = () => (
    <ul className="nav nav-tabs bg-dark">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-light">
            <i className="fas fa-home" /> {"  "}
            Home
          </a>
        </Link>
      </li>

      {!isAuth() && (
        <React.Fragment>
          <li className="nav-item ml-auto">
            <Link href="/register">
              <a className="nav-link text-light">Register</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/login">
              <a className="nav-link text-light">Login</a>
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/admin">
            <a className="nav-link text-light">
              <i className="fas fa-user"></i> {"  "}
              {isAuth().name}
            </a>
          </Link>
        </li>
      )}

      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ml-auto">
          <Link href="/user">
            <a className="nav-link text-light">
              <i className="fas fa-user"></i> {"  "}
              {isAuth().name}
            </a>
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item">
          <a onClick={logout} className="nav-link text-light pointer">
            Logout
          </a>
        </li>
      )}
    </ul>
  );

  return (
    <React.Fragment>
      {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;
