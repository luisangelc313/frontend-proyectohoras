import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);
import "dayjs/locale/es";
import {
  Box,
  Container,
  Grid2,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

import { useStateValue } from "../../context/store";
import DetalleRegistro from "./DetalleRegistro";
import {
  obtenerCapturaInicialAction
} from "../../actions/RegistroTiemposAction";


const TaskLog = () => {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [usuarioSesion, setUsuarioSesion] = useState({});

  // Variables para almacenar los datos de la API
  const [clientes, setClientes] = useState([]);
  const [soluciones, setSoluciones] = useState([]);
  const [actividades, setActividades] = useState([]);


  // Mostrar toast si el rango es inválido y ambos valores existen
  useEffect(() => {

    const obtenerCargaInicialDatos = async () => {
      setLoading(true);
      try {
        const response = await obtenerCapturaInicialAction();

        if (response && response.data && response.status === 200) {
          setClientes(response.data.clientes || []);
          setSoluciones(response.data.soluciones || []);
          setActividades(response.data.actividades || []);
          //console.log("Respuesta de la API:", response.data);

        } else {
          console.error("Ocurrió un error al obtener la información inicial:", response);

          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje: "Ocurrió un error al obtener la información inicial",
              severity: "error",
            },
          });
        }

      } catch (error) {
        let errorMessage = error.response?.data?.errors?.msg || "Ocurrió un error al obtener la información inicial.";

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: errorMessage,
            severity: "error",
          },
        });

      } finally {
        setLoading(false);
      }
    }

    obtenerCargaInicialDatos();

    setUsuarioSesion(sesionUsuario.usuario);

  }, [sesionUsuario.usuario, dispatch]);


  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        marginTop: "70px",
        height: "calc(100vh - 70px)", // ocupa todo el alto menos el navbar
        py: 1,
        px: 2,
        width: "100vw",
      }}
      disableGutters
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          width="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container sx={{ height: "100%" }}>
          {/* Panel de Actividades */}
          <Grid2 item size={{ xs: 12, md: 12, lg: 12 }} sx={{
            p: 2, height: '95%',
            overflowY: 'auto'
          }}>
            {/* Componente ActividadesDelDia */}
            <DetalleRegistro
              //fecha={fechaSeleccionada}
              listadoClientes={clientes}
              listadoSoluciones={soluciones}
              listadoActividades={actividades}
              usuarioSesion={usuarioSesion}
            />
          </Grid2>
        </Grid2>
      )}
    </Container>
  );
}

export default TaskLog;