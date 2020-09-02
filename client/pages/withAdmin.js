import axios from "axios";
import { getCookie } from "../utils/auth";
import { API } from "../config";

const withAdmin = (Page) => {
  const WithAdminUser = (props) => <Page {...props} />;

  WithAdminUser.getInitialProps = async (ctx) => {
    const token = getCookie("token", ctx.req);
    let user = null;
    let userStocks = [];

    if (token) {
      try {
        const res = await axios.get(`${API}/admin`, {
          headers: {
            contentType: "application/json",
            authorization: `Bearer ${token}`
          }
        });

        user = res.data.user;
        userStocks = res.data.userStocks;
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

  return WithAdminUser;
};

export default withAdmin;
