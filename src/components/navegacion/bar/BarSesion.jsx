import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useStateValue } from "../../../context/store";
//import FotoUsuarioTemp from "../../../assets/react.svg";
import FotoUsuarioTemp from "../../../assets/usericon.svg";
import IconB2B from "../../../assets/favicon.svg";
import { MenuIzquierda } from "./MenuIziquierda";
import { MenuDerecha } from "./MenuDerecha";

import IconMoon from "./../../icons/IconMoon";
import IconSun from "./../../icons/IconSun";
//import getTheme from "./../../../theme/theme";

const useStyles = makeStyles((theme) => ({
  seccionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  seccionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
  avatarSize: {
    width: 40,
    height: 40,
  },
  list: {
    width: 250,
  },
  listItemText: {
    fontSize: "14px",
    fontWeight: 600,
    paddingLeft: "5px",
    color: "#212121 !important",
    cursor: "pointer",
  },
  fixedContainer: {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  }
}));


const BarSesion = ({ toggleTheme }) => {
  //const initialStateDarkMode = localStorage.getItem('theme') === 'dark';
  //console.log("toggleTheme received in BarSesion:", toggleTheme);

  const navigate = useNavigate();
  const clases = useStyles();
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [abrirMenuIzquierda, setAbrirMenuIzquierda] = useState(false);
  const [abrirMenuDerecha, setAbrirMenuDerecha] = useState(false);

  //const [darkMode, setDarkMode] = useState(initialStateDarkMode);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const cerrarMenuIzquierda = () => {
    setAbrirMenuIzquierda(false);
  };

  const abrirMenuIzquierdaAction = () => {
    setAbrirMenuIzquierda(true);
  };

  const cerrarMenuDerecha = () => {
    setAbrirMenuDerecha(false);
  };

  const abrirMenuDerechaAction = () => {
    setAbrirMenuDerecha(true);
  }

  const salirSesionApp = () => {
    console.log('se ejecuto cerrar sesion');
    localStorage.removeItem("token_seguridad");

    dispatch({
      type: "SALIR_SESION",
      nuevoUsuario: null,
      usuario: null,
      autenticado: false
    })

    navigate('/auth/login', { raplace: true });
  };


  const handleToggleTheme = () => {
    console.log("handleToggleTheme called");

    if (typeof toggleTheme === "function") {
      toggleTheme();
      setDarkMode((prevMode) => !prevMode);
    } else {
      console.warn("toggleTheme is not a function:", toggleTheme);
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, []);

  return (
    <React.Fragment>
      <Drawer
        open={abrirMenuIzquierda}
        onClose={cerrarMenuIzquierda}
        anchor="left"
      >
        <div
          className={clases.list}
          onKeyDown={cerrarMenuIzquierda}
          onClick={cerrarMenuIzquierda}
        >
          <MenuIzquierda clases={clases} />
        </div>
      </Drawer>

      <Drawer
        open={abrirMenuDerecha}
        onClose={cerrarMenuDerecha}
        anchor="right"
      >
        <div
          className={clases.list}
          onClick={cerrarMenuDerecha}
          onKeyDown={cerrarMenuDerecha}
        >
          <MenuDerecha
            clases={clases}
            salirSesion={salirSesionApp}
            usuario={sesionUsuario ? sesionUsuario.usuario : null}
          />
        </div>
      </Drawer>

      <Toolbar sx={{ marginTop: 0 }}>
        <IconButton color="inherit" onClick={abrirMenuIzquierdaAction}>
          <i className="material-icons">menu</i>
        </IconButton>

        <Typography variant="h6" noWrap>
          B2B Servicios
        </Typography>
        <Avatar src={IconB2B} className={clases.avatarSize} style={{ marginLeft: '10px' }}></Avatar>
        <div className={clases.grow}></div>

        <div className={clases.seccionDesktop}>
          {/* Theme Toggle Button */}
          <button
            style={{
              background: "#1976d2",
              border: "0px",
              cursor: "pointer"
            }}
            onClick={handleToggleTheme}>
            {
              darkMode ? <IconSun /> : <IconMoon />
            }
          </button>
          <Button color="inherit" onClick={salirSesionApp}>
            Salir
          </Button>
          <Button color="inherit">
            {sesionUsuario ? sesionUsuario?.usuario?.nombreCompleto || "" : ""}
          </Button>
          <Avatar
            src={sesionUsuario?.usuario?.imagenPerfil || FotoUsuarioTemp}
          ></Avatar>
        </div>

        <div className={clases.seccionMobile}>
          <IconButton color="inherit" onClick={abrirMenuDerechaAction}>
            <i className="material-icons">more_vert</i>
          </IconButton>
        </div>
      </Toolbar>
    </React.Fragment>
  );
};

//const BarSesion = withRouter(barSesion);
export default BarSesion;

