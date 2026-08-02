import { Navigate } from "react-router-dom";

import useAuthStore from "../store/auth.store";
import Loader from "../components/common/Loader";

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;