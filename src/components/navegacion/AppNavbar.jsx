import { AppBar } from "@mui/material";
import BarSesion from "./bar/BarSesion";

import { useStateValue } from "../../context/store";

const AppNavbar = ({ toggleTheme }) => {
  const [{ sesionUsuario }] = useStateValue();

  // return sesionUsuario ? (
  //   sesionUsuario.autenticado ? (
  //     <AppBar position="fixed" style={{ top: 0 }}>
  //       <BarSesion toggleTheme={toggleTheme} />
  //       {/* <BarSesion toggleTheme={(...args) => {
  //         console.log("toggleTheme called in AppNavbar.jsx with args:", args);
  //         toggleTheme(...args);
  //       }} /> */}
  //     </AppBar>
  //   ) : null
  // ) : null;
  return sesionUsuario && sesionUsuario.autenticado ? (
    <AppBar position="fixed" style={{ top: 0 }}>
      <BarSesion toggleTheme={toggleTheme} />
    </AppBar>
  ) : null;
}

export default AppNavbar;