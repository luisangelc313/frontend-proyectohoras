import { Navigate } from "react-router-dom";
import { useStateValue } from "../../context/store";

//const RutaSegura = ({ component: Component, ...rest }) => {
    const RutaSegura = ({ component: Component}) => {
    const [{ sesionUsuario }] = useStateValue();

    // return (
    //     <Route
    //         {...rest}
    //         element={
    //             sesionUsuario ? (
    //                 sesionUsuario.autenticado ? (
    //                     <Component {...rest} />
    //                 ) : (
    //                     <Navigate to="/auth/login" replace />
    //                 )
    //             ) : (
    //                 <Navigate to="/auth/login" replace />
    //             )
    //         }
    //     />
    // );
    // Check if the user is authenticated
  if (!sesionUsuario || !sesionUsuario.autenticado) {
    return <Navigate to="/auth/login" replace />; // Redirect to login if not authenticated
  }

  // Render the component if the user is authenticated
  return Component;
};

export default RutaSegura;
