import { useEffect, useMemo, useState } from "react";

import { ClearIcon, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Grid2,
    IconButton,
    LinearProgress,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import style from "../Tool/style";
import { useStateValue } from "../../context/store";
import {
    obtenerDatosFiltrosAction,
    obtenerReporteRegistroAction
} from "../../actions/ReportesAction";
import TblRegistros from "./TblRegistros";


const initialPayload = {
    proyecto: "",
    clienteId: "",
    solucionId: "",
    actividadId: "",
    fechaInicio: "",
    fechaFin: "",
    usuarioId: "",
};

const RptRegistros = () => {

    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState(initialPayload);


    const [{ sesionUsuario }, dispatch] = useStateValue();
    const [usuarioSesion, setUsuarioSesion] = useState({});


    // Variables para almacenar los datos de la API
    const [clientes, setClientes] = useState([]);
    const [soluciones, setSoluciones] = useState([]);
    const [actividades, setActividades] = useState([]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setField(name, value);
    };

    // Helpers genéricos
    const setField = (key, value) => {
        // Guarda "" cuando no haya valor
        setPayload((prev) => ({ ...prev, [key]: value ?? "" }));
    };

    // Valores seleccionados para Autocomplete (derivados del payload)
    const selectedCliente = useMemo(
        () => clientes.find((o) => o?.clienteId === payload.clienteId) ?? null,
        [clientes, payload.clienteId]
    );
    const selectedSolucion = useMemo(
        () => soluciones.find((o) => o?.solucionId === payload.solucionId) ?? null,
        [soluciones, payload.solucionId]
    );
    const selectedActividad = useMemo(
        () =>
            // Nota: si tu catálogo viene con "actividId" cámbialo abajo en onChange
            actividades.find((o) => o?.actividadId === payload.actividadId) ?? null,
        [actividades, payload.actividadId]
    );


    const validarCamposRequeridos = data => {
        if (!data.fechaInicio && !data.fechaFin) {
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Seleccione rango de fechas (Inicio y Fin).",
                    severity: "warning",
                    vertical: "bottom",
                    horizontal: "right"
                },
            });
            return false;
        }

        return true;
    };

    const handleBuscar = async () => {
        const paginaVariant = paginadorRequest.numeroPagina + 1;

        // Si quieres normalizar antes de enviar
        const requestPayload = {
            ...payload,
            usuarioId: usuarioSesion.usuarioId,
            numeroPagina: paginaVariant,
            cantidadElementos: paginadorRequest.cantidadElementos,
            descripcion: (payload.proyecto || "").trim(),
            solucionId: payload.solucionId || null,
            clienteId: payload.clienteId || null,
            actividadId: payload.actividadId || null,
            fechaInicio: payload.fechaInicio || "",
            fechaFin: payload.fechaFin || "",
        };
        //console.log("Payload listo para API:", requestPayload);
        //return;

        if (!validarCamposRequeridos(requestPayload)) {
            return false;
        }

        const msjError = "Ocurrió un error al obtener el reporte.";

        try {
            const response = await obtenerReporteRegistroAction(requestPayload);
            if (response && response.data && response.status === 200) {
                //console.log("Respuesta de la API:", response.data);
                setPaginadorResponse(response.data);

            } else {
                console.error("Ocurrió un error al obtener el reporte:", response);
            }
        }
        catch (error) {
            const errorMessage = error?.data?.errors?.msg || msjError;
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: errorMessage,
                    severity: "error",
                    vertical: "bottom",
                    horizontal: "left"
                },
            });
        }
        finally {
            console.info("Finalizado");
        }
    };

    const handleLimpiar = () => setPayload(initialPayload);


    const [paginadorRequest, setPaginadorRequest] = useState({
        titulo: "",
        numeroPagina: 0,
        cantidadElementos: 10,
    });

    const [paginadorResponse, setPaginadorResponse] = useState({
        listaRecords: [],
        totalRecords: 0,
        numeroPaginas: 0,
    });

    const handlePageChange = (event, nuevaPagina) => {
        setPaginadorRequest((anterior) => ({
            ...anterior,
            numeroPagina: parseInt(nuevaPagina),
        }));
    }

    const handleRowsPerPageChange = (event) => {
        setPaginadorRequest((anterior) => ({
            ...anterior,
            cantidadElementos: parseInt(event.target.value, 10), // Actualiza el número de filas por página
            numeroPagina: 0,
        }));
    }

    const [expanded, setExpanded] = useState(false); // Estado para controlar el accordion
    const handleAccordionToggle = () => {
        setExpanded(!expanded); // Cambia el estado al hacer clic
    };


    useEffect(() => {
        const obtenerDatosFiltros = async () => {
            setLoading(true);

            try {
                const response = await obtenerDatosFiltrosAction();

                if (response && response.data && response.status === 200) {
                    //console.log("Respuesta de la API:", response.data);
                    setClientes(response.data.clientes || []);
                    setSoluciones(response.data.soluciones || []);
                    setActividades(response.data.actividades || []);

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
        };
        obtenerDatosFiltros();

        setUsuarioSesion(sesionUsuario.usuario);

        initialPayload.usuarioId = sesionUsuario.usuario.usuarioId;

    }, [dispatch, sesionUsuario.usuario]);

    useEffect(() => {
        const fechaInicioMesActual = dayjs().startOf("month").format("YYYY-MM-DD");//Obtener el inicio del mes actual
        const fechaFinMesActual = dayjs().endOf("day").format("YYYY-MM-DD");//Obtener el fin del día actual

        // Actualiza el payload con las fechas del mes actual
        setPayload((prev) => ({
            ...prev,
            fechaInicio: fechaInicioMesActual,
            fechaFin: fechaFinMesActual,
        }));

        const obtenerRegistrosMesActual = async () => {
            setLoading(true);

            const requestPayload = {
                ...payload,
                usuarioId: sesionUsuario.usuario.usuarioId,
                fechaInicio: fechaInicioMesActual,
                fechaFin: fechaFinMesActual,
                numeroPagina: 1,
                cantidadElementos: paginadorRequest.cantidadElementos,
                descripcion: "",
                solucionId: null,
                clienteId: null,
                actividadId: null,
            };

            try {
                const response = await obtenerReporteRegistroAction(requestPayload);
                if (response && response.data && response.status === 200) {
                    setPaginadorResponse(response.data); // Actualiza los registros
                    console.info("API RESPONSE:", response);
                } else {
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: "Ocurrió un error al obtener los registros del mes actual.",
                            severity: "error",
                        },
                    });
                }
            } catch (error) {
                const errorMessage = error?.response?.data?.errors?.msg || "Error al obtener los registros del mes actual.";
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
        };

        obtenerRegistrosMesActual();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, sesionUsuario.usuario.usuarioId, paginadorRequest.cantidadElementos]);

    const [isFirstLoad, setIsFirstLoad] = useState(true); // Bandera para controlar la primera carga

    useEffect(() => {
        const obtenerRegistrosPorPagina = async () => {
            setLoading(true);

            const requestPayload = {
                ...payload,
                usuarioId: sesionUsuario.usuario.usuarioId,
                numeroPagina: paginadorRequest.numeroPagina + 1, // La API espera páginas 1-indexadas
                cantidadElementos: paginadorRequest.cantidadElementos,
                descripcion: (payload.proyecto || "").trim(),
                solucionId: payload.solucionId || null,
                clienteId: payload.clienteId || null,
                actividadId: payload.actividadId || null,
                fechaInicio: payload.fechaInicio || "",
                fechaFin: payload.fechaFin || "",
            };

            try {
                const response = await obtenerReporteRegistroAction(requestPayload);
                if (response && response.data && response.status === 200) {
                    setPaginadorResponse(response.data); // Actualiza los registros
                } else {
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: "Ocurrió un error al obtener los registros.",
                            severity: "error",
                        },
                    });
                }
            } catch (error) {
                const errorMessage = error?.response?.data?.errors?.msg || "Error al obtener los registros.";
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
        };

        // Evita la llamada inicial
        if (isFirstLoad) {
            setIsFirstLoad(false); // Cambia la bandera después de la primera carga
            return;
        }

        obtenerRegistrosPorPagina();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginadorRequest, usuarioSesion.usuarioId, dispatch]);


    return (
        <div style={style.table}>
            {/* Loading superior (fino) y Backdrop */}
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }}>
                <CircularProgress />
                <label>Espere, cargando información...</label>
            </Backdrop>

            <Typography component="h1" variant="h5">
                Reporte de Registros de Horas Por Proyecto
            </Typography>

            <Box display="flex" alignItems="center" gap={2} sx={{
                borderColor: '#e7e2e2ff',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: '1px',
                px: 3,
                py: 0.5,
                mt: 2,
                width: "32%", // Asegura que el contenedor ocupe el ancho completo
            }}>
                <Typography variant="h6" gutterBottom>
                    <span
                        style={{
                            fontSize: 14,
                            fontWeight: "500",
                            fontFamily: "Arial",
                            captionSide: "bottom",
                            marginRight: 5,
                        }}>Usuario: </span>
                    {usuarioSesion && usuarioSesion.username}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mt: 0 }}>
                    <span
                        style={{
                            fontSize: 14,
                            fontWeight: "500",
                            fontFamily: "Arial",
                            captionSide: "bottom",
                            marginRight: 5,
                        }}>Total Horas: </span>
                    {paginadorResponse.valorAdicional || 0}
                </Typography>
            </Box>

            <Grid2 container style={style.tableGridContainer} sx={{
                borderColor: '#e7e2e2ff',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: '1px',
                px: 2,
                mt: 2,
                width: "100%", // Asegura que el contenedor ocupe el ancho completo
            }}>
                {/* Accordion para los filtros */}
                <Accordion expanded={expanded} onChange={handleAccordionToggle} sx={{ width: "100%" }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="filtros-content"
                        id="filtros-header">
                        <Typography variant="caption" gutterBottom sx={{ display: 'block', mb: 3, fontSize: '14px' }}>
                            Filtros para búsqueda
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2} size={{ xs: 12, sm: 12, md: 12 }}>
                            {/* INPUT PROYECTO */}
                            <Grid2 size={{ xs: 6, sm: 6, md: 6 }}>
                                <TextField
                                    fullWidth
                                    name="proyecto"
                                    label="Proyecto"
                                    size="small"
                                    value={payload.proyecto}
                                    onChange={handleInputChange}
                                />
                            </Grid2>
                            {/* DATEPICKER FECHA INICIO */}
                            <Grid2 size={{ xs: 6, sm: 3, md: 3 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={1}
                                        sx={{ mb: 2 }}
                                        alignItems="center">
                                        <DatePicker
                                            label="Fecha Inicio"
                                            value={payload.fechaInicio ? dayjs(payload.fechaInicio) : null}
                                            minDate={dayjs("2000-01-01")}
                                            maxDate={payload.fechaFin ? dayjs(payload.fechaFin) : dayjs()}
                                            onChange={(newValue) =>
                                                setField("fechaInicio", newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")
                                            }
                                            slotProps={{ textField: { size: "small", fullWidth: true } }}
                                        />
                                        <Tooltip title="Limpiar Fecha Inicio">
                                            <IconButton
                                                aria-label="Limpiar fecha inicio"
                                                onClick={() => {
                                                    setPayload(prev => ({ ...prev, fechaInicio: "" }));
                                                }}
                                                size="small"
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                    </Stack>
                                </LocalizationProvider>
                            </Grid2>
                            {/* DATEPICKER FECHA FIN */}
                            <Grid2 size={{ xs: 6, sm: 3, md: 3 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={1}
                                        sx={{ mb: 2 }}
                                        alignItems="center">
                                        <DatePicker
                                            label="Fecha Fin"
                                            value={payload.fechaFin ? dayjs(payload.fechaFin) : null}
                                            minDate={payload.fechaInicio ? dayjs(payload.fechaInicio) : dayjs("2000-01-01")}
                                            maxDate={dayjs()}
                                            onChange={(newValue) =>
                                                setField("fechaFin", newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")
                                            }
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                },
                                            }}
                                        />
                                        <Tooltip title="Limpiar Fecha Fin">
                                            <IconButton
                                                aria-label="Limpiar fecha fin"
                                                onClick={() => {
                                                    setPayload(prev => ({ ...prev, fechaFin: "" }));
                                                }}
                                                size="small"
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </LocalizationProvider>
                            </Grid2>
                        </Grid2>
                        <Grid2 container spacing={2} size={{ xs: 12, sm: 12, md: 12 }} sx={{ mt: 2 }}>
                            {/* COMBOBOX CLIENTE */}
                            <Grid2 size={{ xs: 6, sm: 4, md: 4 }}>
                                <Autocomplete
                                    options={clientes}
                                    getOptionLabel={option => option.nombre || ""}
                                    isOptionEqualToValue={(option, value) => option.solucionId === value.clienteId}
                                    value={selectedCliente}
                                    onChange={(_, newValue) => setField("clienteId", newValue?.clienteId || "")}
                                    renderOption={(props, option, { index }) => (
                                        <li {...props} key={`${option.clienteId}-${index}`}>
                                            {option.nombre}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cliente"
                                            size="small"
                                            required
                                            variant="outlined"
                                        />
                                    )}
                                    noOptionsText="Sin resultados"
                                    fullWidth
                                />
                            </Grid2>
                            {/* COMBOBOX SOLUCIÓN */}
                            <Grid2 size={{ xs: 6, sm: 4, md: 4 }}>
                                <Autocomplete
                                    options={soluciones}
                                    getOptionLabel={option => option.nombre || ""}
                                    isOptionEqualToValue={(option, value) => option.solucionId === value.solucionId}
                                    value={selectedSolucion}
                                    onChange={(_, newValue) => setField("solucionId", newValue?.solucionId || "")}
                                    renderOption={(props, option, { index }) => (
                                        <li {...props} key={`${option.solucionId}-${index}`}>
                                            {option.nombre}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Solución"
                                            size="small"
                                            required
                                            variant="outlined"
                                        />
                                    )}
                                    noOptionsText="Sin resultados"
                                    fullWidth
                                />
                            </Grid2>
                            {/* COMBOBOX ACTIVIDAD */}
                            <Grid2 size={{ xs: 6, sm: 4, md: 4 }}>
                                <Autocomplete
                                    options={actividades}
                                    getOptionLabel={option => option.nombre || ""}
                                    isOptionEqualToValue={(option, value) => option.actividadId === value.actividadId}
                                    value={selectedActividad}
                                    onChange={(_, newValue) => setField("actividadId", newValue?.actividadId || "")}
                                    renderOption={(props, option, { index }) => (
                                        <li {...props} key={`${option.actividadId}-${index}`}>
                                            {option.nombre}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Actividad"
                                            size="small"
                                            required
                                            variant="outlined"
                                        />
                                    )}
                                    noOptionsText="Sin resultados"
                                    fullWidth
                                />
                            </Grid2>
                            {/* BOTONES DE ACCIÓN (BUSCAR | LIMPIAR) */}
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button variant="contained" onClick={handleBuscar} disabled={loading}>
                                    Buscar
                                </Button>
                                <Button variant="text" onClick={handleLimpiar} disabled={loading}>
                                    Limpiar
                                </Button>
                            </Stack>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>
            </Grid2>

            {/* Previsualización del payload */}
            {/* <pre style={{ marginTop: 16, background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
                {JSON.stringify(payload, null, 2)}
            </pre> */}

            <Grid2 container spacing={1} sx={{ mt: 4 }}>
                <TblRegistros
                    registros={paginadorResponse.listaRecords} // Pasa los registros obtenidos
                    count={paginadorResponse.totalRecords} // Pasa el total de registros para la paginación
                    rowsPerPage={paginadorRequest.cantidadElementos}
                    page={paginadorRequest.numeroPagina}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                />
            </Grid2>

        </div>
    );
}

export default RptRegistros;