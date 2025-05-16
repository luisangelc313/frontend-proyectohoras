import { useState } from "react";

import { HttpStatus } from "../../../utils/HttpStatus";
import { useStateValue } from "../../../context/store";
import {
    guardarPerfilAction,
    actualizarPerfilAction,
    eliminarPerfilAction,
} from "../../../actions/PerfilAction";

const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};


export const useHandleGuardarPerfil = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleGuardarPerfil = async (
        e,
        nombrePerfil,
        nombrePerfilRef,
        setErrorNombrePerfil,
        handleCloseModalNvoPerfil,
        resetFormDialog,
        callbackRecagarDatos
    ) => {
        e.preventDefault();
        if (!nombrePerfil.trim()) {
            nombrePerfilRef.current.focus();
            setErrorNombrePerfil({ nombrePerfil: true });
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Nombre Perfil es requerido",
                    severity: "warning",
                },
            });
            return false;
        }

        let msgError = "Ocurrió un error al guardar la información";
        setLoading(true);

        try {
            const response = await guardarPerfilAction({ Nombre: nombrePerfil });
            let responseData = response[0];

            if (responseData.statusText === "OK" && responseData.status === HttpStatus.OK) {
                setLoading(false);
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Información guardada correctamente",
                        severity: "success",
                    },
                });
                resetFormDialog();
                handleCloseModalNvoPerfil();

                if (callbackRecagarDatos)
                    callbackRecagarDatos(); // Execute the callback to refresh the list
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
        }
        catch (error) {
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

    return { handleGuardarPerfil, loading };
}


export const useHandleEditarPerfil = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleEditarPerfil = async (
        e,
        perfilOriginalToEdit,
        perfilToEdit,
        nombrePerfilEditRef,
        setErrorNombrePerfilEdit,
        handleCloseEditDialog,
        resetFormDialog,
        callbackRecargarDatos
    ) => {
        e.preventDefault();

        if (!perfilToEdit.Nombre.trim()) {
            nombrePerfilEditRef.current.focus();
            setErrorNombrePerfilEdit({ nombrePerfilEdit: true });
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Nombre Perfil es requerido",
                    severity: "warning",
                },
            });
            return;
        }

        // Normalize and compare strings
        const originalNombre = normalizeString(perfilOriginalToEdit.Nombre);
        const editedNombre = normalizeString(perfilToEdit.Nombre);

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
            const response = await actualizarPerfilAction(perfilToEdit);
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

                callbackRecargarDatos && callbackRecargarDatos(); // Execute the callback to refresh the list
                handleCloseEditDialog();
            }
        } catch (error) {
            setLoading(false);
            nombrePerfilEditRef.current.focus();
            setErrorNombrePerfilEdit({ nombrePerfilEdit: true });
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

    return { handleEditarPerfil, loading };
}


export const useHandleEliminarPerfil = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleEliminarPerfil = async (e,
        perfilSeleccionado,
        handleCloseConfirmDialog,
        callbackRecagarDatos
    ) => {
        e.preventDefault();

        if (perfilSeleccionado) {
            let msgError = "Ocurrió un error al eliminar la información.";
            setLoading(true);

            try {
                const response = await eliminarPerfilAction(perfilSeleccionado);
                const { status, statusText } = response;
                setLoading(false);

                if (status === HttpStatus.OK && statusText === "OK") {
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: "Perfil eliminado correctamente.",
                            severity: "success",
                        },
                    });

                    callbackRecagarDatos && callbackRecagarDatos();
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
            handleCloseConfirmDialog();
        }
    }

    return { handleEliminarPerfil, loading };
}