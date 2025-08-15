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
    Autocomplete,
    Backdrop,
    Button,
    CircularProgress,
    Grid2, IconButton, LinearProgress, Stack, TextField, Tooltip, Typography
} from "@mui/material";

import style from "../Tool/style";
import { useStateValue } from "../../context/store";
import { obtenerDatosFiltrosAction } from "../../actions/ReportesAction";


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

    const handleBuscar = async () => {
        // Si quieres normalizar antes de enviar
        const requestPayload = {
            ...payload,
            proyecto: (payload.proyecto || "").trim(),
            usuarioId: usuarioSesion.usuarioId,
        };
        console.log("Payload listo para API:", requestPayload);
        // await buscarRegistros(requestPayload)
    };

    const handleLimpiar = () => setPayload(initialPayload);


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

            <Grid2 container style={style.tableGridContainer} sx={{
                borderColor: '#e7e2e2ff',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: '1px',
                px: 2,
                mt: 2,
            }}>
                <Typography variant="caption" gutterBottom sx={{ display: 'block', mb: 3, fontSize: '14px' }}>
                    Filtros para búsqueda
                </Typography>
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
                                    onChange={(newValue) => setField("fechaFin", newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")}
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
            </Grid2>

            {/* Previsualización del payload */}
            {/* <pre style={{ marginTop: 16, background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
                {JSON.stringify(payload, null, 2)}
            </pre> */}

        </div>
    );
}

export default RptRegistros;