import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Alert,
  //AppBar, 
  //Box,
  Grid2,
  Snackbar,
  ThemeProvider,
  //Toolbar, 
} from "@mui/material";

import { useStateValue } from './context/store';
import { obtenerUsuarioActual } from "./actions/UsuarioAction";
import getTheme from "./theme/theme";
import AppNavbar from "./components/navegacion/AppNavbar";
//componentes
import Login from "./components/seguridad/Login";
//Rouetes
import RouterApp from "./routes/RouterApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { AuthProvider } from "./context/AuthProvider"; // Importa el AuthProvider
import { CambiarPwd } from "./components/seguridad";

function App() {
  const [theme, setTheme] = useState(getTheme());
  const [{ openSnackbar, sesionUsuario }, dispatch] = useStateValue();
  const [iniciaApp, setIniciaApp] = useState(false);

  // const toggleTheme = useCallback(() => {
  //   const newThemeMode = theme.palette.mode === "light" ? "dark" : "light";
  //   localStorage.setItem("theme", newThemeMode);
  //   setTheme(getTheme());
  // }, [theme]);
  const toggleTheme = useCallback(() => {
    const newThemeMode = theme.palette.mode === "light" ? "dark" : "light";
    localStorage.setItem("theme", newThemeMode);
    const updatedTheme = getTheme(); // Aseguramos que se obtenga el nuevo tema
    setTheme(updatedTheme);
  }, [theme]);


  // Condición para mostrar u ocultar AppNavbar
  const shouldShowNavbar = !(
    sesionUsuario?.usuario &&
    sesionUsuario.usuario.primerAcceso &&
    !sesionUsuario.usuario.fechaPrimerAcceso
  );


  useEffect(() => {
    if (!iniciaApp) {
      obtenerUsuarioActual(dispatch)
        .then((/*response*/) => {
          setIniciaApp(true);
        })
        .catch((/*error*/) => {
          ///console.error(error)
          setIniciaApp(true);
        });
    }
    //setTheme(getTheme());
  }, [dispatch, iniciaApp]);


  return !iniciaApp ? null : (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: openSnackbar ? openSnackbar.vertical : "bottom",
          horizontal: openSnackbar ? openSnackbar.horizontal : "center"
        }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={4000}
        ContentProps={{ "aria-describedby": "message-id" }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: "",
              severity: openSnackbar ? openSnackbar.severity : "success",
              vertical: openSnackbar ? openSnackbar.vertical : "bottom",
              horizontal: openSnackbar ? openSnackbar.horizontal : "center"
            },
          })
        }
      >
        <Alert
          onClose={() =>
            dispatch({
              type: "OPEN_SNACKBAR",
              openMensaje: {
                open: false,
                mensaje: "",
                severity: openSnackbar ? openSnackbar.severity : "success",
                vertical: openSnackbar ? openSnackbar.vertical : "bottom",
                horizontal: openSnackbar ? openSnackbar.horizontal : "center"
              },
            })
          }
          severity={openSnackbar ? openSnackbar.severity : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {openSnackbar ? openSnackbar.mensaje : ""}
        </Alert>
      </Snackbar>
      <BrowserRouter>
        <AuthProvider>
          {/* <Box>
              <AppBar position="static">
                <Toolbar variant="dense"></Toolbar>
              </AppBar>
            </Box> */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {shouldShowNavbar && <AppNavbar toggleTheme={toggleTheme} />}
            {/* <AppNavbar toggleTheme={(...args) => {
                console.log("toggleTheme called in App.jsx with args:", args);
                toggleTheme(...args);
              }} /> */}
            <Grid2 container>
              <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/seguridadpwd" element={<CambiarPwd />} />
                <Route
                  path="/*"
                  element={<ProtectedRoutes>{<RouterApp />}</ProtectedRoutes>}
                />
              </Routes>
            </Grid2>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
