import HttpCliente from "../services/HttpCliente";
import axios from 'axios';

const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;


export const paginacionUsuarioAction = async paginador => {
  const response = await HttpCliente.post("/usuario/listadopaginado", paginador);
  return response;
};


export const registrarUsuario = (usuario, dispatch, usuarioSesion) => {
  return new Promise((resolve, reject) => {
    HttpCliente.post(`/usuario`, usuario)
      .then((response) => {
        dispatch({
          type: "INICIAR_SESION",
          sesion: usuarioSesion.usuario,
          autenticado: usuarioSesion.autenticado,
        });

        resolve(response);

      }).catch((error) => {
        reject(error);
        resolve(error.response);

        let mensajeError = "Error interno de servidor de aplicación.";
        const objError = error?.response?.data?.errors;
        if (objError?.NombreCompleto) {
          mensajeError = objError?.NombreCompleto[0];
        }
        else if (objError?.Username) {
          mensajeError = objError?.Username[0];
        }
        else if (objError?.Email) {
          mensajeError = objError?.Email[0];
        }
        else if (objError?.Password) {
          mensajeError = objError?.Password[0];
        }
        else if (objError?.ConfirmarPassword) {
          mensajeError = objError?.ConfirmarPassword[0];
        }
        else if (objError?.msg) {
          mensajeError = objError?.msg;
        }

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: mensajeError,
            severity: "error",
            vertical: "bottom",
            horizontal: "left"
          },
        });
      });
  });
};


export const editarUsuario = (usuario, dispatch, usuarioSesion) => {
  const id = usuario.UsuarioId;
  return new Promise((resolve, reject) => {
    HttpCliente.put(`/usuario/${id}`, usuario)
      .then((response) => {
        dispatch({
          type: "INICIAR_SESION",
          sesion: usuarioSesion.usuario,
          autenticado: usuarioSesion.autenticado,
        });

        resolve(response);

      }).catch((error) => {
        reject(error);
        resolve(error.response);

        let mensajeError = "Error interno de servidor de aplicación.";
        const objError = error?.response?.data?.errors;
        if (objError?.NombreCompleto) {
          mensajeError = objError?.NombreCompleto[0];
        }
        else if (objError?.Username) {
          mensajeError = objError?.Username[0];
        }
        else if (objError?.Email) {
          mensajeError = objError?.Email[0];
        }
        else if (objError?.Password) {
          mensajeError = objError?.Password[0];
        }
        else if (objError?.ConfirmarPassword) {
          mensajeError = objError?.ConfirmarPassword[0];
        }
        else if (objError?.msg) {
          mensajeError = objError?.msg;
        }

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: mensajeError,
            severity: "error",
            vertical: "bottom",
            horizontal: "left"
          },
        });
      });
  });
}


export const obtenerUsuarioActual = (dispatch) => {
  return new Promise((resolve, reject) => {
    HttpCliente.get("/usuario")
      .then((response) => {
        //console.log("response", response);
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile = "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }

        if (response.data.primerAcceso && !response.data.fechaPrimerAcceso) {
          dispatch({
            type: "SET_MENU_VISIBILITY",
            payload: false, // Oculta el menú
          });
        }

        const nuevoToken = response.data.token;

        // Guardar el nuevo token en localStorage
        localStorage.setItem("token_seguridad", nuevoToken);

        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error.response);
        //resolve(error);
      });
  });
};


export const actualizarMiPerfil = (usuario, dispatch) => {
  return new Promise((resolve, reject) => {
    HttpCliente.put(`/usuario/miperfil/${usuario.usuarioId}`, usuario)
      .then((response) => {
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile = "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }

        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });

        resolve(response);
      })
      .catch((error) => {
        reject(error);
        resolve(error.response);

        let mensajeError = "Error interno de servidor de aplicación.";
        const objError = error?.response?.data?.errors;
        if (objError?.NombreCompleto) {
          mensajeError = objError?.NombreCompleto[0];
        }
        else if (objError?.Username) {
          mensajeError = objError?.Username[0];
        }
        else if (objError?.Email) {
          mensajeError = objError?.Email[0];
        }
        else if (objError?.Password) {
          mensajeError = objError?.Password[0];
        }
        else if (objError?.ConfirmarPassword) {
          mensajeError = objError?.ConfirmarPassword[0];
        }

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: mensajeError,
            severity: "error",
          },
        });
      });
  });
};


export const actualizarPwd = (usuarioCredenciales, dispatch) => {
  return new Promise((resolve, reject) => {
    HttpCliente.put(`/usuario/editarpwd/${usuarioCredenciales.usuarioId}`, usuarioCredenciales)
      .then((response) => {

        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });

        resolve(response);
      })
      .catch((error) => {
        reject(error);
        resolve(error.response);
      });
  });
};


//Obtiene el usuario por ID, sino se recibe el valor del parámetro, se manda el formato Guide por defecto.
export const obtenerUsuarioPorID = (usuarioId) => {
  if (!usuarioId) usuarioId = "00000000-0000-0000-0000-000000000000";

  return new Promise((resolve, reject) => {
    HttpCliente.get(`/usuario/${usuarioId}`)
      .then((response) => {
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile = "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }

        resolve(response);
      })
      .catch((error) => reject(error.response));
  });
};


export const inactivarActivarUsuarioAction = (usuario, dispatch, usuarioSesion) => {
  const objUsuarioRequest = {
    "id": usuario.UsuarioId,
    "activo": !usuario.Activo,
  }
  return new Promise((resolve, reject) => {
    HttpCliente.put(`/usuario/eliminadologico`, objUsuarioRequest)
      .then((response) => {

        dispatch({
          type: "INICIAR_SESION",
          sesion: usuarioSesion.usuario,
          autenticado: usuarioSesion.autenticado,
        });

        resolve(response);
      })
      .catch((error) => {
        reject(error);
        resolve(error.response);
      });
  });
}


export const eliminarUsuarioAction = (usuario, dispatch, usuarioSesion) => {
  return new Promise((resolve, reject) => {
    HttpCliente.delete(`/usuario/${usuario.UsuarioId}`)
      .then((response) => {

        dispatch({
          type: "INICIAR_SESION",
          sesion: usuarioSesion.usuario,
          autenticado: usuarioSesion.autenticado,
        });

        resolve(response);
      })
      .catch((error) => {
        reject(error);
        resolve(error.response);
      });
  });
}


export const loginUsuario = (usuario, dispatch) => {
  return new Promise((resolve) => {
    instancia.post("/usuario/login", usuario)
      .then((response) => {
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile = "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }

        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });

        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

