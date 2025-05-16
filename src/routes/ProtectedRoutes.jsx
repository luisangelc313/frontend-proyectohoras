import { Navigate } from "react-router-dom";

import { useStateValue } from "../context/store";

const ProtectedRoutes = ({ children }) => {
  const [{ sesionUsuario }] = useStateValue();

  if (!sesionUsuario) {
    return <Navigate to="/auth/login" replace />
  }

  return children;
};

export default ProtectedRoutes;
