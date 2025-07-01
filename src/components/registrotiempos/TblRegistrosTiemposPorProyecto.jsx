import { useState } from "react";
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    ConfirmDialogEliminarRegistroResumen
} from "./Confirm";
import {
    eliminarRegistroAction,
} from "../../actions/RegistroTiemposAction";
import { HttpStatus } from "../../utils/HttpStatus";
import { useStateValue } from "../../context/store";


const headers = [
    { label: "MES" },
    { label: "CLIENTE" },
    { label: "SOLUCIÓN" },
    { label: "PROYECTO" },
    { label: "ACTIVIDAD" },
    { label: "HORAS", align: "right" },
    { label: "" }
];

const TblRegistrosTiemposPorProyecto = ({
    registros = [],
    count = 0,
    rowsPerPage = 10,
    page = 0,
    handlePageChange,
    handleRowsPerPageChange,
    refrescarResumen, // Función para refrescar la tabla con los registros actualizados 'Resumen'
}) => {

    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [registroAEliminar, setRegistroAEliminar] = useState(null);


    // Editar registro
    const handleEditarRegistroResumen = (registro) => {
        // Aquí tu lógica de edición
        console.log("Editar registro resumen:", registro);
    };

    // Eliminar registro
    const handleOpenDialogConfirmEliminar = (registro) => {
        // Lógica de eliminación
        //console.log("Eliminar registro resumen:", registro);

        setRegistroAEliminar(registro); // Guarda el registro a eliminar
        setOpenDialog(true);// Abre el diálogo de confirmación
    };


    // Cuando el usuario confirma la eliminación
    const handleConfirmEliminar = async () => {
        //console.log("Registro a Eliminar:", registroAEliminar);

        //Llamar acción de eliminar registro
        setLoading(true);
        let msgError = "Ocurrió un error al eliminar la información";
        try {
            const response = await eliminarRegistroAction(registroAEliminar);
            const { status, statusText } = response;

            setLoading(false);

            if (status === HttpStatus.OK && statusText === "OK") {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Registro eliminado correctamente",
                        severity: "success",
                        //vertical: "bottom",
                        //horizontal: "left"
                    },
                });

                if (refrescarResumen) refrescarResumen(); // <--- refresca los datos de la tabla 'Resumen'

            } else {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: msgError,
                        severity: "error",
                    },
                });
            }

        } catch (error) {
            const errorMessage = error.response?.data?.errors?.msg || msgError;
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
            setOpenDialog(false);
            setRegistroAEliminar(null);
        }

    };

    // Cuando el usuario cancela
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRegistroAEliminar(null);
    };


    return (
        <>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header.label}
                                    align={header.align || "left"}
                                    sx={{ backgroundColor: "#1F4E78", color: "#fff", py: 1.5 }}
                                >
                                    <b>{header.label}</b>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registros && registros.length > 0 ? (
                            registros.map(row => (
                                <TableRow key={row.registroId}>
                                    <TableCell>{row.mes}</TableCell>
                                    <TableCell>{row.cliente}</TableCell>
                                    <TableCell>{row.solucion}</TableCell>
                                    <TableCell>{row.proyecto}</TableCell>
                                    <TableCell>{row.actividad}</TableCell>
                                    <TableCell align="right">{row.horas}</TableCell>
                                    <TableCell
                                        sx={{
                                            width: 50,
                                            minWidth: 60,
                                            maxWidth: 80,
                                            p: 0.4,
                                            position: 'relative',
                                            '& .acciones-botones': {
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                            },
                                            '&:hover .acciones-botones': {
                                                opacity: 1,
                                            }
                                        }}
                                    >
                                        <Box className="acciones-botones" sx={{ display: "flex" }}>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                aria-label="Editar"
                                                title="Editar Registro"
                                                onClick={() => handleEditarRegistroResumen(row)}
                                            >
                                                <EditIcon sx={{ fontSize: '16px' }} />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                aria-label="Eliminar"
                                                title="Eliminar Registro"
                                                onClick={() => handleOpenDialogConfirmEliminar(row)}
                                            >
                                                <DeleteIcon sx={{ fontSize: '16px' }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center" sx={{ py: 3 }}>
                                    <span
                                        style={{
                                            fontSize: 17,
                                            fontWeight: "600",
                                            fontFamily: "Arial",
                                            captionSide: "bottom"
                                        }}>
                                        Sin Registros
                                    </span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                <TablePagination
                    component="div"
                    rowsPerPageOptions={[5, 10, 25]}
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count}`
                    }
                >
                </TablePagination>
            </Box>

            <ConfirmDialogEliminarRegistroResumen
                open={openDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmEliminar}
                proyectoEliminar={registroAEliminar ? registroAEliminar.descripcion : ""}
                loading={loading}
            />
        </>
    )
};

export default TblRegistrosTiemposPorProyecto;
