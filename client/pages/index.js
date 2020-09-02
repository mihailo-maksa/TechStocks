import Layout from "../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API } from "../config";

const Home = ({ categories }) => {
  const listCategories = () =>
    categories &&
    categories.map((c, i) => (
      <Link href={`/stocks/${c.slug}`} key={i}>
        <a className="bg-light p-3 col-md-4 category-link">
          <div>
            <div className="row">
              <div className="col-md-4">
                <img
                  className="category-img pr-3"
                  src={c.image && c.image.url}
                  alt={c.name}
                />
              </div>
              <div className="col-md-8">
                <h3>{c.name}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center font-weight-bold">
            Browse Tech Stock Categories
          </h1>
          <br />
        </div>
      </div>

      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

// React.useEffect() - fetches data after component is rendered, on the client side
// React.getInitialProps() - fetches data before component is even rendered, on the server side
Home.getInitialProps = async () => {
  try {
    const res = await axios.get(`${API}/categories`);
    return { categories: res.data };
  } catch (err) {
    console.error(err);
  }
};

export default Home;
