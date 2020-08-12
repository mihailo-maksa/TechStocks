import Layout from "../../components/Layout";
import withUser from "../withUser";

const User = ({ user }) => {
  return <Layout>{JSON.stringify(user)}</Layout>;
};

export default withUser(User);
