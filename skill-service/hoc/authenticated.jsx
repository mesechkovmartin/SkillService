import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../src/store/app.context";
import PropTypes from "prop-types";

export default function Authenticated({ children }) {
  const { user, loading } = useContext(AppContext);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
};