import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//import { jwtDecode } from "jwt-decode";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import {
  Container,
  Paper,
  Typography,
  Grid2,
  CircularProgress
} from "@mui/material";

import BirthdayList from './BirthdayList';
import { useStateValue } from "../../context/store";

dayjs.locale('es'); // Configurar el idioma español

const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [, setUsuario] = useState({
    nombreCompleto: "",
    email: "",
    username: "",
    numeroTelefono: "",
    usuarioConfig: null,
    cumpleanios: null
  });

  useEffect(() => {
    setLoading(true);

    setUsuario(sesionUsuario.usuario);

    const usuario = sesionUsuario.usuario;

    // Solo intenta obtener usuario si hay token y usuario autenticado
    // const token = localStorage.getItem("token_seguridad");
    // if (token && sesionUsuario.autenticado) {
    //   console.log("Token de seguridad:");
    //   obtenerUsuarioActual(dispatch)
    //     .then(() => setLoading(false))
    //     .catch(() => setLoading(false));
    // } else {
    //   setLoading(false);
    // }

    if (usuario && usuario.primerAcceso && !usuario.fechaPrimerAcceso) {
      localStorage.removeItem("token_seguridad");
      dispatch({
        type: "SALIR_SESION",
        nuevoUsuario: null,
        autenticado: false
      });
      navigate('/auth/login', { replace: true });
    }

    if (usuario.cumpleanios && usuario.cumpleanios.length > 0) {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Hay cumpleañeros el día de HOY 🥳 🎂 🎉",
          severity: "info",
          autoHideDuration: 6000,
          vertical: "bottom",
          horizontal: "right"
        }
      });
    }

    //Decodificar el token JWT
    // const token = usuario.token;
    // try {
    //   const decodedPayload = jwtDecode(token);
    //   console.log("Payload decodificado:", decodedPayload);
    //   console.log("Permisos:", JSON.parse(decodedPayload.permisos));
    // } catch (error) {
    //   console.error("Error al decodificar el token:", error);
    // }

    setLoading(false);
  }, [sesionUsuario, dispatch, navigate]);

  const birthdays = sesionUsuario.usuario.cumpleanios ? sesionUsuario.usuario.cumpleanios.map(cumple => {
    let fotoPerfil = cumple.documento;
    const fotoPerfilURL = cumple.documento.data
      ? "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data
      : "";
    return {
      id: cumple.usuarioId,
      name: cumple.nombreCompleto,
      birthday: `HOY ${dayjs(cumple.fechaNacimiento).format('DD [DE] MMMM').toUpperCase()}`,
      profilePhoto: fotoPerfilURL,
    };
  }) : [];

  // Duplicar los datos en birthdays para probar el scroll y diseño de la lista.
  //const duplicatedBirthdays = [...birthdays, ...birthdays, ...birthdays, ...birthdays];

  return (
    <Container>
      <Paper elevation={0} style={{ padding: '20px', marginTop: '60px' }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Bienvenido <span style={{ fontSize: '24px' }}> TaskLog - Registro de actividades</span>
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom>
          HORAS POR PROYECTO
        </Typography>
        <Typography variant="body1" gutterBottom>
          Te invitamos a estar al día con tu captura de horas.
        </Typography>
      </Paper>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid2 container spacing={1} justifyContent="flex-end">
          {birthdays.length > 0 && (
            <Grid2 item size={{ xs: 12, md: 5 }} style={{ paddingRight: '0', margin: 0 }}>
              <BirthdayList birthdays={birthdays} />
            </Grid2>
          )}
        </Grid2>
      )}
    </Container>
  )
}

export default Home;