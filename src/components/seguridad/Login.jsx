import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

import style from "../Tool/style";
//import { PathsUrl } from '../../utils/Paths';
import { HttpStatus } from "../../utils/HttpStatus";
import { loginUsuario } from "../../actions/UsuarioAction";
import { useStateValue } from "../../context/store";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [, dispatch] = useStateValue();
  const [errorUser, setErrorUser] = useState({ Username: false });
  const [errorPwd, setErrorPwd] = useState({ Password: false });
  const [usuario, setUsuario] = useState({
    Username: "",
    Password: "",
  });

  // State for loading
  const [loading, setLoading] = useState(false);

  const ingresarValoresMemoria = e => {
    const { name, value } = e.target;
    setUsuario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    // Remove error state when input is not empty
    if (name === 'Username' && value) {
      setErrorUser({ Username: false });
    }
    if (name === 'Password' && value) {
      setErrorPwd({ Password: false });
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (!usuario.Username || !usuario.Password) {
      !usuario.Username && setErrorUser({ Username: true });
      !usuario.Password && setErrorPwd({ Password: true });

      if (!usuario.Username) {
        usernameRef.current.focus();
      }
      else if (!usuario.Password) {
        passwordRef.current.focus();
      }

      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Ingrese las credenciales de usuario",
          severity: "warning",
        },
      });
      return;
    }
    // Start loading
    setLoading(true);

    loginUsuario(usuario, dispatch)
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          window.localStorage.setItem("token_seguridad", response.data.token);

          if (response.data.primerAcceso && !response.data.fechaPrimerAcceso) {
            dispatch({
              type: "SET_MENU_VISIBILITY",
              payload: false, // Oculta el menú
            });
            //Si es el primer acceso, redirigir a la página de cambio de contraseña
            //navigate("/auth/seguridadpwd", { replace: true });
            navigate("/auth/seguridadpwd", { replace: true });

          } else {
            dispatch({
              type: "SET_MENU_VISIBILITY",
              payload: true, // Muestra el menú
            });
            navigate('/', { raplace: true });
          }

          // dispatch({
          //   type: "OPEN_SNACKBAR",
          //   openMensaje: {
          //     open: true,
          //     mensaje: "Inicio de sesión correcto"
          //   },
          // });
        }
        else {
          let errorMsg = "Las credenciales del usuario son incorrectas";
          if (response.data && response.data.errors && response.data.errors) {
            errorMsg = response.data.errors.msg;
          }

          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje: errorMsg,
              severity: "error",
            },
          });
        }
      }).finally(() => {
        setLoading(false); // Stop loading
      });
  }

  useEffect(() => {
    localStorage.removeItem("token_seguridad");
  }, []);

  return (
    <Container maxWidth="xs" style={style.container}>
      <div style={style.paper}>
        <Avatar style={style.avatar}>
          <LockIcon style={style.icon} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <form>
          <TextField
            variant="outlined"
            margin="normal"
            id="username"
            label="Usuario"
            name="Username"
            autoFocus
            required
            fullWidth
            disabled={loading} // Disable button while loading
            value={usuario.Email}
            onChange={ingresarValoresMemoria}
            error={errorUser.Username}
            inputRef={usernameRef}
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="Password"
            label="Contraseña"
            type="password"
            id="password"
            required
            fullWidth
            disabled={loading} // Disable button while loading
            value={usuario.Password}
            onChange={ingresarValoresMemoria}
            error={errorPwd.Password}
            inputRef={passwordRef}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            style={style.submit}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "left",
                typography: "body1",
                "& > :not(style) ~ :not(style)": {
                  ml: 2,
                },
              }}
            >
              <FormControlLabel
                control={<Checkbox name="mantenerConectado" color="primary" />}
                label="Mantener Conectado"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "right",
                typography: "body1",
                "& > :not(style) ~ :not(style)": {
                  ml: 2,
                },
              }}
            >
              <Link href="#" underline="hover">
                {"¿Olvidaste tu contraseña?"}
              </Link>
            </Box>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default Login;
