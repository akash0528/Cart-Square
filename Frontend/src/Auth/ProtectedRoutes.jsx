import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={"/signin"} />;
  }
  return children;
};

export default ProtectedRoutes;
