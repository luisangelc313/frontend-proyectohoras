import { useState } from "react";

import { HttpStatus } from "../../../utils/HttpStatus";
import { useStateValue } from "../../../context/store";
import {
  guardarClienteAction,
  actualizarClienteAction,
  eliminarClienteAction,
  inactivarActivarClienteAction,
} from "../../../actions/ClienteAction";

// Function to normalize and compare strings
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};


export const useHandleGuardarCliente = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const handleGuardarCliente = async (
    e,
    nombreCliente,
    nombreClienteRef,
    setErrorNombreCliente,
    handleCloseModalNvoCliente,
    setPaginadorRequest,
    resetFormDialog
  ) => {
    e.preventDefault();
    if (!nombreCliente.trim()) {
      nombreClienteRef.current.focus();
      setErrorNombreCliente({ nombreCliente: true });
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Nombre Cliente es requerido",
          severity: "warning",
        },
      });
      return false;
    }

    let msgError = "Ocurrió un error al guardar la información";
    setLoading(true);

    try {

      const response = await guardarClienteAction({ Nombre: nombreCliente });
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
        setPaginadorRequest((prev) => ({
          ...prev,
          numeroPagina: prev.numeroPagina,
        }));
        handleCloseModalNvoCliente();
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

  return { handleGuardarCliente, loading };
};


export const useHandleEditarCliente = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const handleEditarCliente = async (
    e,
    clienteOriginalToEdit,
    clienteToEdit,
    nombreClienteEditRef,
    setErrorNombreClienteEdit,
    handleCloseEditDialog,
    setPaginadorRequest,
    resetFormDialog
  ) => {
    e.preventDefault();
    if (!clienteToEdit.Nombre.trim()) {
      nombreClienteEditRef.current.focus();
      setErrorNombreClienteEdit({ nombreClienteEdit: true });
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Nombre Cliente es requerido",
          severity: "warning",
        },
      });
      return;
    }

    // Normalize and compare strings
    const originalNombre = normalizeString(clienteOriginalToEdit.Nombre);
    const editedNombre = normalizeString(clienteToEdit.Nombre);

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
      const response = await actualizarClienteAction(clienteToEdit);
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
      nombreClienteEditRef.current.focus();
      setErrorNombreClienteEdit({ nombreClienteEdit: true });
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

  return { handleEditarCliente, loading };
};


export const useHandleEliminarCliente = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const handleEliminarCliente = async (
    e,
    clienteSeleccionado,
    handleCloseConfirmDialog,
    setPaginadorRequest
  ) => {
    e.preventDefault();
    //Se invoca la acción de petición que se conectar a la API para ejecutar el endpoint
    if (clienteSeleccionado) {
      let msgError = "Ocurrió un error al eliminar la información";
      setLoading(true);

      try {
        const response = await eliminarClienteAction(clienteSeleccionado);
        const { status, statusText } = response;
        setLoading(false);

        if (status === HttpStatus.OK && statusText === "OK") {
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje: "Cliente eliminado correctamente",
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

  return { handleEliminarCliente, loading };
};


export const useHandleActivarInactivarCliente = () => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const handleActivarInactivarCliente = async (
    e,
    objClienteSeleccionado,
    handleCloseConfirmDialog,
    setPaginadorRequest
  ) => {
    e.preventDefault();
    if (objClienteSeleccionado) {
      const isChecked = objClienteSeleccionado.Activo;
      const msgAccion = isChecked ? "Inactivo" : "Activo";
      const msgError = `Ocurrió un error al ${msgAccion} la información.`;
      setLoading(true);

      try {
        var response = await inactivarActivarClienteAction(objClienteSeleccionado);
        let responseData = response[0];
        setLoading(false);

        let { status, statusText } = responseData;
        if (status === HttpStatus.OK && statusText === "OK") {
          let msgInformativo = `Se ${msgAccion} correctamente el cliente.`;
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

  return { handleActivarInactivarCliente, loading };
};