import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ user }) => {
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
      <div className="row">
        <div className="col-md-12">
          <ul className="na flex-colum admin-links mt-3">
            <li className="nav-item bold mr-3">
              <a
                className="nav-link btn bold btn-outline-primary p-2"
                href="/admin/category/create"
              >
                Create Category
              </a>
            </li>
            <li className="nav-item bold mr-3">
              <Link href="/admin/category/all">
                <a
                  className="nav-link btn bold btn-outline-primary p-2"
                  href="/admin/category/all"
                >
                  Show All Categories
                </a>
              </Link>
            </li>
            <li className="nav-item bold mr-3">
              <a
                href="/user/stock/create"
                className="nav-link btn bold btn-outline-primary p-2"
              >
                Create Stock
              </a>
            </li>
            <li className="nav-item bold mr-3">
              <Link href="/admin/stock/all">
                <a className="nav-link btn bold btn-outline-primary p-2">
                  Show All Stocks
                </a>
              </Link>
            </li>
            <li className="nav-item bold">
              <Link href="/user/profile/update">
                <a className="nav-link btn bold btn-outline-primary p-2">
                  Update Profile
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
