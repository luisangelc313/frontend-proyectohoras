import { Navigate } from "react-router-dom";
import { useEffect/*, useState*/ } from "react";

import { useStateValue } from "../context/store";
//import { PathsUrl } from '../utils/Paths';

const ProtectedRoutes = ({ children }) => {
  const [{ sesionUsuario }] = useStateValue();
  //const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula la carga inicial de la sesión
    if (sesionUsuario !== undefined) {
      //setIsLoading(false);
    }
  }, [sesionUsuario]);

  // if (isLoading) {
  //   // Muestra un indicador de carga mientras se verifica la sesión
  //   return <div>Cargando...</div>
  // }

  if (!sesionUsuario) {
    return <Navigate to="/auth/login" replace />
  }

  // if (
  //   sesionUsuario.usuario &&
  //   sesionUsuario.usuario.primerAcceso &&
  //   !sesionUsuario.usuario.fechaPrimerAcceso
  // ) {
  //return <Navigate to={PathsUrl.UsuarioCambiarPwd} replace />;
  //return <Navigate to="/auth/cambiarpwd" replace />;
  //console.info("hola");
  //return;
  //}

  return children;
};

export default ProtectedRoutes;
