import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';

import { useStateValue } from "../../context/store";
import DetalleRegistro from "./DetalleRegistro";
import {
  obtenerCapturaInicialAction
} from "../../actions/RegistroTiemposAction";


// Genera un arreglo de fechas entre dos dayjs (inclusive)
const generarFechasRango = (inicio, fin) => {
  const fechas = [];
  let fecha = inicio.startOf('day');
  const fechaFin = fin.startOf('day');
  while (fecha.isSameOrBefore(fechaFin, 'day')) {
    fechas.push(fecha);
    fecha = fecha.add(1, 'day');
  }
  return fechas;
};

// Para obtener las fechas del mes actual:
const getFechasMesActual = () => {
  const hoy = dayjs();
  const primerDia = hoy.startOf('month');
  return generarFechasRango(primerDia, hoy);
};

const arrFachas = getFechasMesActual();

const TaskLog = () => {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [usuarioSesion, setUsuarioSesion] = useState({});

  // Por defecto, el rango es desde la fecha más antigua a la más reciente
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  // Variables para almacenar los datos de la API
  const [clientes, setClientes] = useState([]);
  const [soluciones, setSoluciones] = useState([]);
  const [actividades, setActividades] = useState([]);


  // Validación de rango
  const rangoInvalido = fechaInicio && fechaFin && fechaInicio.isAfter(fechaFin, "day");

  const fechasParaListar =
    fechaInicio && fechaFin && !rangoInvalido
      ? generarFechasRango(
        dayjs.min(fechaInicio, fechaFin),
        dayjs.max(fechaInicio, fechaFin)
      )
      : arrFachas;

  // Mostrar toast si el rango es inválido y ambos valores existen
  useEffect(() => {
    if (fechaInicio && fechaFin && rangoInvalido) {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Selecciona un rango de fechas válido para mostrar la lista.",
          severity: "warning",
          vertical: "bottom",
          horizontal: "center"
        },
      });
    }

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

  }, [fechaInicio, fechaFin, rangoInvalido, dispatch, sesionUsuario]);


  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        marginTop: "70px",
        height: "calc(100vh - 70px)", // ocupa todo el alto menos el navbar
        py: 1,
        px: 5,
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
          {/* Sidebar de Fechas */}
          <Grid2
            item
            size={{ xs: 4, md: 3, lg: 3 }}
            sx={{
              borderRight: '1px solid #ccc',
              bgcolor: '#f5f5f5',
              height: "100%",
              display: "flex",
              flexDirection: "column",
              py: 1,
              px: 0,
            }}>

            {/* Selectores de rango */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Seleccione rango de fechas si desea cargar más.
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ mb: 2 }}
                alignItems="center"
              >
                <DatePicker
                  label="De"
                  value={fechaInicio}
                  minDate={dayjs("2000-01-01")}
                  maxDate={fechaFin || dayjs()}
                  onChange={value => setFechaInicio(value ? value.startOf('day') : null)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      InputProps: {
                        sx: { fontSize: 14 } // Cambia el tamaño aquí
                      },
                      InputLabelProps: {
                        sx: {
                          fontSize: 17,
                          fontWeight: '500',
                          fontFamily: 'Arial'
                        } // Cambia el tamaño del label
                      }
                    }
                  }}
                />
                <Tooltip title="Limpiar Fecha Inicio">
                  <IconButton
                    aria-label="Limpiar fecha de inicio"
                    onClick={() => {
                      setFechaInicio(null);
                      setFechaSeleccionada(null);
                    }}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <DatePicker
                  label="A"
                  value={fechaFin}
                  minDate={fechaInicio || dayjs("2000-01-01")}
                  maxDate={dayjs()}
                  onChange={value => setFechaFin(value ? value.startOf('day') : null)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      InputProps: {
                        sx: { fontSize: 14 } // Cambia el tamaño aquí
                      },
                      InputLabelProps: {
                        sx: {
                          fontSize: 17,
                          fontWeight: '500',
                          fontFamily: 'Arial'
                        } // Cambia el tamaño del label
                      }
                    }
                  }}
                />
                <Tooltip title="Limpiar Fecha Fin">
                  <IconButton
                    aria-label="Limpiar fecha fin"
                    onClick={() => {
                      setFechaFin(null);
                      setFechaSeleccionada(null);
                    }
                    }
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </LocalizationProvider>

            {/* Componente ListaFechas */}
            <List sx={{ flex: 1, px: 3, overflowY: 'auto', height: '100%' }}>
              {fechasParaListar.map((fecha) => (
                <ListItemButton
                  key={fecha.format("DD-MMM-YY")}
                  selected={fechaSeleccionada && fecha.isSame(fechaSeleccionada, "day")}
                  onClick={() => setFechaSeleccionada(fecha)}
                >
                  <ListItemText primary={fecha.format("DD-MMM-YY").toUpperCase()} />
                </ListItemButton>
              ))}
            </List>
          </Grid2>

          {/* Panel de Actividades */}
          <Grid2 item size={{ xs: 8, md: 9, lg: 9 }} sx={{
            p: 2, height: '95%',
            overflowY: 'auto'
          }}>
            {/* Componente ActividadesDelDia */}
            <DetalleRegistro
              fecha={fechaSeleccionada}
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