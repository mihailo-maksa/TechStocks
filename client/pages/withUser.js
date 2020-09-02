import axios from "axios";
import { getCookie } from "../utils/auth";
import { API } from "../config";

const withUser = (Page) => {
  const WithAuthUser = (props) => <Page {...props} />;

  WithAuthUser.getInitialProps = async (ctx) => {
    const token = getCookie("token", ctx.req);
    let user = null;
    let userStocks = [];

    if (token) {
      try {
        const res = await axios.get(`${API}/user`, {
          headers: {
            contentType: "application/json",
            authorization: `Bearer ${token}`
          }
        });

        user = res.data.user;
        userStocks = res.data.stocks;
      } catch (err) {
        if (err.response.status === 401) {
          user = null;
          userStocks = [];
        }
        console.error(err);
      }
    }

    if (user === null) {
      // HTTP Status Code 302: Found, i.e. temporary redirection
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(ctx) : {}),
        user,
        userStocks,
        token
      };
    }
  };

  return WithAuthUser;
};

export default withUser;
