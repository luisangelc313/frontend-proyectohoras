import { useState } from "react";

import { HttpStatus } from "../../../utils/HttpStatus";
import { useStateValue } from "../../../context/store";

import {
    guardarSolucionAction,
    actualizarSolucionAction,
    eliminarSolucionAction,
    inactivarActivarSolucionAction,
} from "../../../actions/SolucionAction";

// Function to normalize and compare strings
const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};


export const useHandleGuardarSolucion = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);
    const handleGuardarSolucion = async (
        e,
        nombreSolucion,
        nombreSolucionRef,
        setErrorNombreSolucion,
        handleCloseModalNvaSolucion,
        setPaginadorRequest,
        resetFormDialog
    ) => {
        e.preventDefault();
        if (!nombreSolucion.trim()) {
            nombreSolucionRef.current.focus();
            setErrorNombreSolucion({ nombreSolucion: true });
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Nombre Solución es requerido.",
                    severity: "warning",
                },
            });
            return false;
        }

        let msgError = "Ocurrió un error al guardar la información.";
        setLoading(true);

        try {
            const response = await guardarSolucionAction({ Nombre: nombreSolucion });
            let responseData = response[0];

            if (responseData.statusText === "OK" && responseData.status === HttpStatus.OK) {
                setLoading(false);
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Información guardada correctamente.",
                        severity: "success",
                    },
                });
                resetFormDialog();
                setPaginadorRequest((prev) => ({
                    ...prev,
                    numeroPagina: prev.numeroPagina,
                }));
                handleCloseModalNvaSolucion();
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
            setLoading(false);
            const errorMessage = error.response?.data?.errors?.msg || msgError;

            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: errorMessage,
                    severity: "error",
                },
            });
        }
    };

    return { handleGuardarSolucion, loading };
};


export const useHandleEditarSolucion = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleEditarSolucion = async (
        e,
        solucionObjetoOriginal,
        solucionToEdit,
        nombreSolucionEditRef,
        setErrorNombreSolucionEdit,
        handleCloseEditDialog,
        setPaginadorRequest,
        resetFormDialog
    ) => {
        e.preventDefault();
        if (!solucionToEdit.Nombre.trim()) {
            nombreSolucionEditRef.current.focus();
            setErrorNombreSolucionEdit({ nombreSolucionEdit: true });
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Nombre Solucion es requerido",
                    severity: "warning",
                },
            });
            return;
        }

        // Normalize and compare strings
        const originalNombre = normalizeString(solucionObjetoOriginal.Nombre);
        const editedNombre = normalizeString(solucionToEdit.Nombre);

        if (originalNombre === editedNombre) {
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "No hay cambios para guardar.",
                    severity: "info",
                },
            });
            return;
        }

        let msgError = "Ocurrió un error al guardar la información";
        setLoading(true);
        try {
            const response = await actualizarSolucionAction(solucionToEdit);
            let responseData = response[0];
            setLoading(false);
            if (responseData.status === HttpStatus.OK) {
                resetFormDialog();
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Información actualizada correctamente.",
                        severity: "success",
                    },
                });
                setPaginadorRequest((prev) => ({
                    ...prev,
                    numeroPagina: prev.numeroPagina,
                }));

                handleCloseEditDialog();
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
            setLoading(false);
            nombreSolucionEditRef.current.focus();
            setErrorNombreSolucionEdit({ nombreSolucionEdit: true });
            const errorMessage = error.response?.data?.errors?.msg || msgError;
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: errorMessage,
                    severity: "error",
                },
            });
        }
    };

    return { handleEditarSolucion, loading };
};


export const useHandleEliminarSolucion = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleEliminarSolucion = async (
        e,
        solucionSeleccionado,
        handleCloseConfirmDialog,
        setPaginadorRequest
    ) => {
        e.preventDefault();
        if (solucionSeleccionado) {
            let msgError = "Ocurrió un error al eliminar la información.";
            setLoading(true);

            try {
                //Se invoca la acción de petición que se conectar a la API para ejecutar el endpoint
                const response = await eliminarSolucionAction(solucionSeleccionado);
                const { status, statusText } = response;
                setLoading(false);

                if (status === HttpStatus.OK && statusText === "OK") {
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: "Solución eliminada correctamente.",
                            severity: "success",
                        },
                    });
                    setPaginadorRequest((prev) => ({
                        ...prev,
                        numeroPagina: prev.numeroPagina,
                    }));
                    handleCloseConfirmDialog();
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
            }
        }
    };

    return { handleEliminarSolucion, loading };
};


export const useHandleActivarInactivarSolucion = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleActivarInactivarSolucion = async (
        e,
        solucionSeleccionado,
        handleCloseConfirmDialog,
        setPaginadorRequest
    ) => {
        e.preventDefault();
        if (solucionSeleccionado) {
            const isChecked = solucionSeleccionado.Activo;
            const msgAccion = isChecked ? "Inactivo" : "Activo";
            const msgError = `Ocurrió un error al ${msgAccion} la información.`;
            setLoading(true);

            try {
                var response = await inactivarActivarSolucionAction(solucionSeleccionado);
                let responseData = response[0];
                setLoading(false);

                let { status, statusText } = responseData;
                if (status === HttpStatus.OK && statusText === "OK") {
                    let msgInformativo = `Se ${msgAccion} correctamente la solución.`;
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: msgInformativo,
                            severity: "success",
                        },
                    });
                    setPaginadorRequest((prev) => ({
                        ...prev,
                        numeroPagina: prev.numeroPagina,
                    }));

                    handleCloseConfirmDialog();
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
                setLoading(false);
                const errorMessage = error.response?.data?.errors?.msg || msgError;
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: errorMessage,
                        severity: "error",
                    },
                });
            }
        }
    };
    return { handleActivarInactivarSolucion, loading };
};