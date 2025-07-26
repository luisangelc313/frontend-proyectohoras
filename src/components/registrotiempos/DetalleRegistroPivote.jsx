import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid2,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Cancel from '@mui/icons-material/Cancel';
import ClearAll from '@mui/icons-material/ClearAll';
import SaveIcon from '@mui/icons-material/Save';


import style from "../Tool/style";
import RenderRowPivote from './RenderRowPivote';
import { HttpStatus } from "../../utils/HttpStatus";
import {
    guardarPivoteAction,
    obtenerRegPivFechaSeleccionadaAction
} from "../../actions/PivoteAction";
import {
    ConfirmDialog,
} from "./Confirm";
import { useStateValue } from "../../context/store";
import PivoteItemGuardados from "./PivoteItemsGuardados";
import DialogEditarRegistroPivote from "./hooks/DialogEditarRegistroPivote";


const DetalleRegistroPivote = ({
    fecha,
    listadoClientes,
    listadoSoluciones,
    listadoActividades,
    usuarioSesion
}) => {
    const navigate = useNavigate();

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [loading, setLoading] = useState(false); // Estado para el loading

    // Context para manejar el estado global
    const [, dispatch] = useStateValue();

    // Estado para los registros obtenidos de la API
    const [registosFromAPI, setRegistosFromAPI] = useState([]);
    const [horasCapturadas, setHorasCapturadas] = useState(0);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    // Estado para los renglones dinámicos
    const [rows, setRows] = useState([]); // Empieza con un renglón vacío


    // Cuando cambia la fecha seleccionada, hacer una petición a la API para obtener los registros del día seleccionado.
    const obtenerRegistrosPivotePorFechaSeleccionada = async (usuarioId, fecha, dispatch) => {
        const msjError = "Ocurrió un error al obtener la información.";

        try {
            const response = await obtenerRegPivFechaSeleccionadaAction(usuarioId, fecha);
            let { status, statusText, data } = response;

            if (status === HttpStatus.OK && statusText === "OK") {
                if (data && data.length > 0) {
                    setRegistosFromAPI(data);
                    setHorasCapturadas(data.reduce((total, item) => total + (item.horas || 0), 0));
                    //console.log("registosFromAPI:", registosFromAPI);

                } else {
                    setRegistosFromAPI([]);
                    setHorasCapturadas(0);
                }

            } else {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: msjError,
                        severity: "error",
                        vertical: "bottom",
                        horizontal: "left"
                    },
                });
            }

        } catch (error) {
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
    };

    useEffect(() => {
        if (fechaSeleccionada) {
            const usuarioId = usuarioSesion.usuarioId || "";
            const fechaFormateada = fechaSeleccionada.format("YYYY-MM-DD");
            obtenerRegistrosPivotePorFechaSeleccionada(usuarioId, fechaFormateada, dispatch);

        }
    }, [fechaSeleccionada, usuarioSesion, dispatch]);

    useEffect(() => {
        //console.log("registosFromAPI ha cambiado:", registosFromAPI);
    }, [registosFromAPI]);


    useEffect(() => {
        if (!fecha) {
            setBtnDisabled(true);
            //console.info("Fecha no seleccionada.");
        }
        else if (fecha && rows.length > 0) {
            setBtnDisabled(false);
        }

        if (fecha) {
            setFechaSeleccionada(fecha);
        }
    }, [fecha, rows.length]);


    const handleClickAggNuevoRenglon = e => {
        e.preventDefault();

        setRows([
            ...rows,
            {
                id: Date.now(),
                clienteId: "",
                solucionId: "",
                proyecto: "",
                notas: "",
                actividadId: "",
                horas: "",
            }
        ]);
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);

        if (fieldErrors[index]?.[field]) {
            setFieldErrors(prev => {
                const updated = { ...prev };
                if (updated[index]) {
                    updated[index] = { ...updated[index], [field]: false };
                }
                return updated;
            });
        }
    };

    const handleRemoveRow = (index) => {
        setRows(rows => rows.filter((_, idx) => idx !== index));
    };


    // Estado para el diálogo de confirmación (Cancelar, Limpiar)
    const [openConfirm, setOpenConfirm] = useState(false);
    const [accionConfirm, setAccionConfirm] = useState(""); // "cancelar" o "limpiar"

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleConfirmCancel = () => {
        if (accionConfirm === "limpiar") {
            setRows([{
                id: Date.now(),
                usuarioId: usuarioSesion?.usuarioId || "",
                clienteId: "",
                solucionId: "",
                proyecto: "",
                actividadId: "",
                horas: ""
            }]);
            setFieldErrors({});

        } else if (accionConfirm === "abandonar") {
            navigate("/"); // Redirige al home

        } else {
            setRows([]);
            setFieldErrors({});
        }

        setOpenConfirm(false);
    }


    // Campos obligatorios
    const camposObligatorios = ["cliente", "solucion", "proyecto", "actividad", "horas"];
    const [fieldErrors, setFieldErrors] = useState({});
    // GUARDAR - Este evento se ejecuta cuando se Guarda la Información.
    const handleGuardarRegistros = async e => {
        e.preventDefault();

        // Aquí se puede implementar la lógica para guardar los registros
        //console.log("Rows:", rows);

        if (!rows || rows.length === 0) return;

        let newFieldErrors = {};
        let hasError = false;

        rows.forEach((row, rowIdx) => {
            camposObligatorios.forEach(campo => {
                if (!row[campo] || row[campo] === "") {
                    hasError = true;
                    if (!newFieldErrors[rowIdx]) newFieldErrors[rowIdx] = {};
                    newFieldErrors[rowIdx][campo] = true;
                }
            });
        });

        setFieldErrors(newFieldErrors);
        setLoading(true); // <-- Activa el loading

        if (hasError) {
            //setShowErrors(true); // <-- Mostrar errores
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Faltan campos requeridos por completar.",
                    severity: "warning",
                    vertical: "top",
                    horizontal: "right",
                },
            });

            setLoading(false); // <-- Desactiva el loading
            return;
        }

        const msjError = "Ocurrió un error al guardar la información.";
        setFieldErrors({});

        const myRequest = rows.map(row => ({
            usuarioId: usuarioSesion.usuarioId || "",
            clienteId: row.cliente,
            solucionId: row.solucion,
            proyecto: row.proyecto,
            notas: row.notas,
            actividadId: row.actividad,
            horas: row.horas,
            fechaRegistro: fecha.format("YYYY-MM-DD") // Formato de fecha YYYY-MM-DD
        }));

        //console.log("myRequest:", myRequest);
        //console.log("Fecha Seleccionada:", fecha.format("YYYY-MM-DD"));
        //return;

        try {
            const payload = {
                registros: myRequest,
            };

            const response = await guardarPivoteAction(payload);
            let { status, statusText, data } = response;
            //console.log("Response:", response);

            if (status === HttpStatus.OK && statusText === "OK") {
                //console.log("data:", data);
                if (data && data.length > 0) {
                    //recorre los registros guardados y actualiza el estado de Total de Horas Capturadas
                    const totalHoras = data.reduce((total, item) => total + (item.horas || 0), 0);
                    setHorasCapturadas(totalHoras);

                    // ACTUALIZA registosFromAPI directamente con data si tu API regresa los registros completos
                    setRegistosFromAPI(data);
                }

                //Limpiar los renglones después de guardar
                setRows([
                    {
                        id: Date.now(),
                        usuarioId: usuarioSesion?.usuarioId || "",
                        clienteId: "",
                        solucionId: "",
                        proyecto: "",
                        notas: "",
                        actividadId: "",
                        horas: "",
                        fechaRegistro: "",
                    }
                ]);

                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Información registrada correctamente.",
                        severity: "success",
                    },
                });

            } else {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: msjError,
                        severity: "error",
                        vertical: "bottom",
                        horizontal: "left"
                    },
                });

            }

        } catch (error) {
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

        } finally {
            setLoading(false); // <-- Desactiva el loading
        }
    };

    // LIMPIAR - Este evento se ejecuta cuando se limpia el formulario.
    const handleLimpiar = () => {
        const camposEditables = [...camposObligatorios];
        const tieneAlgunValor = rows.some(row =>
            camposEditables.some(
                campo => row[campo] !== "" && row[campo] !== null && row[campo] !== undefined && row[campo] !== 0
            )
        );

        if (rows.length > 0 && tieneAlgunValor) {
            setAccionConfirm("limpiar");
            setOpenConfirm(true);

        } else {
            setRows([{
                id: Date.now(),
                usuarioId: usuarioSesion?.usuarioId || "",
                mes: "",
                clienteId: "",
                solucionId: "",
                proyecto: "",
                actividadId: "",
                horas: ""
            }]);
            setFieldErrors({});
        }
    };

    // CANCELAR - Este evento se ejecuta cuando se cancela la acción.
    const handleCancelar = e => {
        e.preventDefault();

        // Verifica si hay al menos un renglón con algún valor en los campos editables
        const camposEditables = [...camposObligatorios];
        const tieneAlgunValor = rows.some(row =>
            camposEditables.some(
                campo => row[campo] !== "" && row[campo] !== null && row[campo] !== undefined && row[campo] !== 0
            )
        );

        if (rows.length > 0 && tieneAlgunValor) {
            setAccionConfirm("cancelar");
            setOpenConfirm(true);
        } else {
            setRows([]);
            setFieldErrors({});
        }
    }


    const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
    const [openDialogEditar, setOpenDialogEditar] = useState(false);

    // Abre el diálogo de edición con el registro seleccionado
    const handleClickEditarRegistro = (data) => {
        setRegistroSeleccionado(data);
        setOpenDialogEditar(true);
    };

    const handleCloseDialogEditar = () => {
        setOpenDialogEditar(false);
        setRegistroSeleccionado(null);
    };

    const handleGuardarCambiosRegistro = (registroEditado) => {
        const payload = {
            registroPivoteId: registroEditado.registroPivoteId,
            usuarioId: usuarioSesion.usuarioId || "",
            clienteId: registroEditado.clienteId,
            solucionId: registroEditado.solucionId,
            proyecto: registroEditado.proyecto,
            actividadId: registroEditado.actividadId,
            horas: registroEditado.horas,
            notas: registroEditado.notas || null,
        };
        console.log("Payload editar:", payload);
        //return;

        // Cierra el diálogo
        handleCloseDialogEditar();
    };



    return (
        <>
            <Box>
                <Typography variant="h6">
                    Registro diario de Horas por Proyecto{" "}
                </Typography>
                {fecha && (
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: "500",
                            fontFamily: "Arial",
                            captionSide: "bottom",
                        }}
                    >
                        {
                            // Capitaliza Día y Mes
                            fecha.locale("es").format("dddd, DD [de] MMMM [de] YYYY")
                                .replace(
                                    /^([a-záéíóúñ]+), (\d{2} [a-z ]+ )([a-záéíóúñ]+)( de \d{4})$/i,
                                    (match, dia, diaNum, mes, resto) =>
                                        `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${diaNum}${mes.charAt(0).toUpperCase() + mes.slice(1)}${resto}`
                                )
                        }
                    </span>
                )}

                {fecha && (
                    <Typography variant="h6" gutterBottom>
                        <span
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                fontFamily: "Arial",
                                captionSide: "bottom",
                                marginRight: 5,
                            }}>Horas Capturas: </span>
                        {horasCapturadas}
                    </Typography>
                )}

                {/* {fecha && console.log("Fecha Seleccionada:", fecha)} */}

            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Renglón de captura */}
            {fecha && (
                <form style={style.form}>
                    {rows.map((row, idx) => (
                        <RenderRowPivote
                            key={row.id || idx}
                            index={idx}
                            row={row}
                            clientes={listadoClientes}
                            soluciones={listadoSoluciones}
                            actividades={listadoActividades}
                            handleRowChange={handleRowChange}
                            handleRemoveRow={handleRemoveRow}
                            errors={fieldErrors[idx] || {}} // <-- errores solo para ese renglón
                            usuarioSesion={usuarioSesion}
                        />
                    ))}

                    {/* Botón "Nuevo renglón" */}
                    <Grid2 container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Grid2>
                            <Tooltip title="Agregar Nuevo Renglón">
                                <IconButton color="primary" onClick={handleClickAggNuevoRenglon}>
                                    <AddCircleIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid2>
                    </Grid2>

                    {/* ...botones de acción...
                        sección de botones (Cancelar, Limpiar, Guardar) 
                    */}
                    {rows.length > 0 && (
                        <Grid2
                            container
                            spacing={0}
                            sx={{ marginTop: 2 }}
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Grid2>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="error"
                                    size="medium"
                                    disabled={btnDisabled}
                                    sx={{ mx: 2 }}
                                    onClick={handleCancelar}
                                    style={style.submit}
                                    startIcon={<Cancel />}
                                >
                                    Cancelar
                                </Button>
                            </Grid2>
                            <Grid2>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    size="medium"
                                    disabled={btnDisabled}
                                    sx={{ mx: 2 }}
                                    onClick={handleLimpiar}
                                    style={style.submit}
                                    startIcon={<ClearAll />}
                                >
                                    Limpiar
                                </Button>
                            </Grid2>
                            <Grid2>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    disabled={btnDisabled}
                                    sx={{ mx: 2 }}
                                    style={style.submit}
                                    onClick={handleGuardarRegistros}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                >
                                    {loading ? "Guardando..." : "Guardar"}
                                </Button>
                            </Grid2>
                        </Grid2>
                    )}
                    <Divider sx={{ my: 2 }} />

                </form>
            )}

            {fecha && (
                // Aquí se renderiza la lista de registros guardados.
                <Grid2 container spacing={4} sx={{ mt: 4 }}>
                    {
                        registosFromAPI && registosFromAPI.length > 0
                            ? (
                                registosFromAPI.map((item, index) => (
                                    <Grid2 key={index} size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
                                        <PivoteItemGuardados data={item} onClick={handleClickEditarRegistro} />
                                    </Grid2>
                                ))
                            )
                            : (
                                <p>No hay registros capturados.</p>
                            )
                    }
                </Grid2>
            )}

            {/* Dialog para confirmar la CANCELACIÓN o LIMPIAR */}
            <ConfirmDialog
                open={openConfirm}
                title={
                    accionConfirm === "limpiar"
                        ? "¿Está seguro de que desea limpiar la captura?"
                        : accionConfirm === "abandonar"
                            ? "¿Está seguro de que desea abandonar la captura?"
                            : "¿Está seguro de que desea cancelar?"
                }
                content={
                    accionConfirm === "limpiar"
                        ? "Se eliminarán todos los datos capturados y se dejará solo un renglón vacío."
                        : accionConfirm === "abandonar"
                            ? "Se perderán los cambios no guardados."
                            : "Se perderán los cambios no guardados."
                }
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmCancel}
                width={accionConfirm === "limpiar" || accionConfirm === "abandonar"
                    ? "570px" : ""
                }
                height={accionConfirm === "limpiar" || accionConfirm === "abandonar"
                    ? "220px" : ""
                }
            />

            <DialogEditarRegistroPivote
                open={openDialogEditar}
                onClose={handleCloseDialogEditar}
                data={registroSeleccionado}
                onGuardar={handleGuardarCambiosRegistro}
                usuarioSesion={usuarioSesion}
                dataSource={{
                    clientes: listadoClientes,
                    soluciones: listadoSoluciones,
                    actividades: listadoActividades
                }}
            />

        </>
    )
}

export default DetalleRegistroPivote;