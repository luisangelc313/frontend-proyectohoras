import { useState } from "react";
import {
  guardarActividadAction,
  actualizarActividadAction,
  eliminarActividadAction,
  inactivarActividadAction,
} from "../../../actions/ActividadAction";
import { HttpStatus } from "../../../utils/HttpStatus";
import { useStateValue } from "../../../context/store";

// Function to normalize and compare strings
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};


export const useHandleGuardarActividad = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const handleGuardarActividad = async (
    e,
    nombreActividad,
    nombreActividadRef,
    setErrorNombreActividad,
    handleCloseModalNueva,
    setPaginadorRequest,
    resetFormDialog
  ) => {
    e.preventDefault();
    if (!nombreActividad.trim()) {
      nombreActividadRef.current.focus();
      setErrorNombreActividad({ nombreActividad: true });
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Nombre Actividad es requerido",
          severity: "warning",
        },
      });
      return;
    }

    let msgError = "Ocurrió un error al guardar la información";
    setLoading(true);

    try {
      const response = await guardarActividadAction({
        Nombre: nombreActividad,
      });
      let responseData = response[0];
      setLoading(false);
      if (responseData.status === HttpStatus.OK) {
        resetFormDialog();
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Información guardada correctamente",
            severity: "success",
          },
        });
        setPaginadorRequest((prev) => ({
          ...prev,
          numeroPagina: prev.numeroPagina,
        }));
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
      return false;
    }
    handleCloseModalNueva();
  };

  return { handleGuardarActividad, loading };
};


export const useHandleEditarActividad = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const handleEditarActividad = async (
    e,
    actividadObjetoOriginal,
    actividadToEdit,
    nombreActividadEditRef,
    setErrorNombreActividadEdit,
    handleCloseEditDialog,
    setPaginadorRequest,
    resetFormDialog
  ) => {
    e.preventDefault();
    if (!actividadToEdit.Nombre.trim()) {
      nombreActividadEditRef.current.focus();
      setErrorNombreActividadEdit({ nombreActividadEdit: true });
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Nombre Actividad es requerido",
          severity: "warning",
        },
      });
      return;
    }

    // Normalize and compare strings
    const originalNombre = normalizeString(actividadObjetoOriginal.Nombre);
    const editedNombre = normalizeString(actividadToEdit.Nombre);

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
      const response = await actualizarActividadAction(actividadToEdit);
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
      nombreActividadEditRef.current.focus();
      setErrorNombreActividadEdit({ nombreActividadEdit: true });
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

  return { handleEditarActividad, loading };
};


export const useHandleEliminarActividad = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const handleEliminarActividad = async (
    e,
    actividadSeleccionada,
    handleCloseConfirmDialog,
    setPaginadorRequest
  ) => {
    e.preventDefault();
    //Se invoca la acción de petición que se onectar a la API para ejecutar el endpoint
    if (actividadSeleccionada) {
      let msgError = "Ocurrió un error al eliminar la información";
      setLoading(true);
      try {
        const response = await eliminarActividadAction(actividadSeleccionada);
        setLoading(false);
        if (response.status === HttpStatus.OK) {
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje: "Actividad eliminada correctamente",
              severity: "success",
            },
          });
          setPaginadorRequest((prev) => ({
            ...prev,
            numeroPagina: prev.numeroPagina,
          }));
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
    handleCloseConfirmDialog();
  };

  return { handleEliminarActividad, loading };
};


export const useHandleActivarInactivarActividad = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const handleActivarInactivarActividad = async (
    e,
    objActividadSeleccionada,
    handleCloseConfirmDialog,
    setPaginadorRequest
  ) => {
    e.preventDefault();
    if (objActividadSeleccionada) {
      const isChecked = objActividadSeleccionada.Activa; //checkboxState[actividadToInactivate.ActividadId];
      const msgAccion = isChecked ? "Inactivo" : "Activo";
      setLoading(true);

      try {
        var response = await inactivarActividadAction(objActividadSeleccionada);
        let responseData = response[0];
        setLoading(false);

        if (responseData.status === HttpStatus.OK) {
          let msgInformativo = `Se ${msgAccion} correctamente la actividad`;
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
        } else {
          let msgError = `Ocurrió un error al ${msgAccion} la actividad`;
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
        const errorMessage =
          error.response?.data?.errors?.msg ||
          `Ocurrió un error al ${msgAccion} la información`;
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
    handleCloseConfirmDialog();
  };
  return { handleActivarInactivarActividad, loading };
};