import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

import { PathsUrl } from '../../../utils/Paths';
import { HttpStatus } from "../../../utils/HttpStatus";
import { useStateValue } from "../../../context/store";
import { obtenerDataImagen } from "../../../actions/ImagenAction";
import {
    actualizarMiPerfil,
    registrarUsuario,
    editarUsuario,
    eliminarUsuarioAction,
    inactivarActivarUsuarioAction,
} from "../../../actions/UsuarioAction";


export const handleCropComplete = async (
    imagePromise,
    imageObjectFile,
    setUsuario,
    setCroppedImage,
    setDialogOpen,
    croppedImage
) => {
    imagePromise.then((croppedImageUrl) => {
        const fileUrl = imageObjectFile
            ? URL.createObjectURL(imageObjectFile)
            : null;

        // Fetch additional image metadata
        return obtenerDataImagen(imageObjectFile).then((imageMetadata) => {
            // Update user state with the cropped image and metadata
            setUsuario((prevUsuario) => ({
                ...prevUsuario,
                imagenPerfil: imageMetadata, // JSON containing image data, name, extension, etc.
                fotoUrl: fileUrl || croppedImageUrl, // Display the cropped image
            }));

            // Update the cropped image state (optional for preview)
            setCroppedImage("croppedImage", croppedImage);

            // Close the cropping dialog
            setDialogOpen(false);
        });
    })
        .catch((error) => {
            console.error("Error during cropping:", error);
        });
};


export const useHandleGuardarMiPerfil = () => {
    const [loading, setLoading] = useState(false);

    const handleGuardarMiPerfil = async (
        usuario,
        usuarioOriginal,
        dispatch,
        handleCloseModal,
    ) => {
        setLoading(true);

        // Remove all non-numeric characters from numeroTelefono
        const cleanedNumeroTelefono = usuario.numeroTelefono ? usuario.numeroTelefono.replace(/\D/g, '') : "";

        const objUsuarioRequest = {
            "usuarioId": usuario.usuarioId,
            "nombreCompleto": usuario.nombreCompleto,
            "email": usuario.email,
            "perfilId": usuario.perfilId,
            "username": usuario.username,
            "numeroTelefono": cleanedNumeroTelefono,
            "token": usuario.token,
            "fotoUrl": usuario.fotoUrl,
            "imagen": null,
            "passsword": usuario.passsword,
            "confirmarPasssword": usuario.confirmarPassword,
            "UsuarioConfiguracion": {
                "excederOchoHoras": usuario.usuarioConfig.excederOchoHoras,
                "horaRangoInicio": usuario.usuarioConfig.horaRangoInicio,
                "horaRangoFin": usuario.usuarioConfig.horaRangoFin,
                "permitirCapturaFinDeSemana": usuario.usuarioConfig.permitirCapturaFinDeSemana,
                "horasPermitidasPorDia": usuario.usuarioConfig.horasPermitidasPorDia,
                "usuarioId": usuario.usuarioConfig.usuarioId,
                "fechaNacimiento": usuario.usuarioConfig.fechaNacimiento,
                "mostrarCumpleanio": usuario.usuarioConfig.mostrarCumpleanio
            },
            "imagenPerfil": null,
        };
        if (usuario.imagenPerfil) {
            objUsuarioRequest.imagenPerfil = {
                "nombre": usuario.imagenPerfil.nombre,
                "extension": usuario.imagenPerfil.extension,
                "data": usuario.imagenPerfil.data,
            }
        }

        // console.log("Usuario Componente:", usuario);
        // console.log("Usuario Request:", objUsuarioRequest);
        //return;

        actualizarMiPerfil(objUsuarioRequest, dispatch).then((response) => {
            //console.log("Se actualizo el usuario", response);
            setLoading(false);
            if (response.status === HttpStatus.OK) {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Información guardada exitosamente.",
                        severity: "success",
                    },
                });
                window.localStorage.setItem("token_seguridad", response.data.token);

                setTimeout(() => {
                    window.location.reload();
                }, 2000); // 2 seconds delay
            }
            else {
                //console.error("Error:", Object.keys(response.data.errors));
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Ocurrió un error al actualizar la información." + Object.keys(response.data.errors),
                        severity: "error",
                    },
                });
            }
            handleCloseModal();
        });
    }
    return { handleGuardarMiPerfil, loading };
}


export const useValidarModificacionesModelo = () => {
    const handleValidarModificacionesModelo = (usuario, usuarioOriginal) => {
        // Remove all non-numeric characters from numeroTelefono
        const cleanedNumeroTelefonoA = usuario.numeroTelefono ? usuario.numeroTelefono.replace(/\D/g, '') : "";
        const cleanedNumeroTelefonoB = usuarioOriginal.numeroTelefono ? usuarioOriginal.numeroTelefono.replace(/\D/g, '') : "";

        const objA = {
            "nombreCompleto": usuario.nombreCompleto,
            "email": usuario.email,
            "username": usuario.username,
            "numeroTelefono": cleanedNumeroTelefonoA,
            "UsuarioConfiguracion": {
                "excederOchoHoras": usuario.usuarioConfig.excederOchoHoras,
                "horaRangoInicio": usuario.usuarioConfig.horaRangoInicio,
                "horaRangoFin": usuario.usuarioConfig.horaRangoFin,
                "permitirCapturaFinDeSemana": usuario.usuarioConfig.permitirCapturaFinDeSemana,
                "horasPermitidasPorDia": usuario.usuarioConfig.horasPermitidasPorDia,
                "usuarioId": usuario.usuarioConfig.usuarioId,
                "fechaNacimiento": usuario.usuarioConfig.fechaNacimiento,
                "mostrarCumpleanio": usuario.usuarioConfig.mostrarCumpleanio
            },
        };

        const objB = {
            "nombreCompleto": usuarioOriginal.nombreCompleto,
            "email": usuarioOriginal.email,
            "username": usuarioOriginal.username,
            "numeroTelefono": cleanedNumeroTelefonoB,
            "UsuarioConfiguracion": {
                "excederOchoHoras": usuarioOriginal.usuarioConfig.excederOchoHoras,
                "horaRangoInicio": usuarioOriginal.usuarioConfig.horaRangoInicio,
                "horaRangoFin": usuarioOriginal.usuarioConfig.horaRangoFin,
                "permitirCapturaFinDeSemana": usuarioOriginal.usuarioConfig.permitirCapturaFinDeSemana,
                "horasPermitidasPorDia": usuarioOriginal.usuarioConfig.horasPermitidasPorDia,
                "usuarioId": usuarioOriginal.usuarioConfig.usuarioId,
                "fechaNacimiento": usuarioOriginal.usuarioConfig.fechaNacimiento,
                "mostrarCumpleanio": usuarioOriginal.usuarioConfig.mostrarCumpleanio
            },
        };

        const strA = JSON.stringify(objA);
        const strB = JSON.stringify(objB);

        const seleccionoFotoPerfil = usuario.imagenPerfil != null;
        if (seleccionoFotoPerfil) return true;

        //if (usuario.password !== "" || usuario.confirmarPassword !== "") return true;

        return strA !== strB;
    }
    return handleValidarModificacionesModelo;
}


export const useHandleGuardarUsuario = () => {
    const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación
    const [loading, setLoading] = useState(false);

    const handleGuardarUsuario = async (
        usuario,
        usuarioOriginal,
        dispatch,
        handleCloseModal,
        UsuarioEnSesion,
    ) => {
        setLoading(true);

        // Remove all non-numeric characters from numeroTelefono
        const cleanedNumeroTelefono = usuario.numeroTelefono ? usuario.numeroTelefono.replace(/\D/g, '') : "";

        const objUsuarioRequest = {
            "NombreCompleto": usuario.NombreCompleto,
            "Email": usuario.Email,
            "Username": usuario.Username,
            "NumeroTelefono": cleanedNumeroTelefono,
            "PerfilId": usuario.PerfilId,
            "Activo": usuario.Activo,
            "Password": usuario.Password,
            "ConfirmarPassword": usuario.ConfirmarPassword,
            "ImagenPerfil": null,
            "UsuarioConfiguracion": {
                "ExcederOchoHoras": usuario.Config.excederOchoHoras,
                "HoraRangoInicio": usuario.Config.horaRangoInicio,
                "HoraRangoFin": usuario.Config.horaRangoFin,
                "PermitirCapturaFinDeSemana": usuario.Config.permitirCapturaFinDeSemana,
                "HorasPermitidasPorDia": usuario.Config.horasPermitidasPorDia,
                "FechaNacimiento": usuario.Config.fechaNacimiento,
                "MostrarCumpleanio": usuario.Config.mostrarCumpleanio
            },
        };

        // si el usuario tiene valor en id, significa que es una actualización de datos.
        let esEditar = false;
        if (usuario.usuarioId && usuarioOriginal.id) {
            objUsuarioRequest.UsuarioId = usuario.usuarioId;
            esEditar = true;
        }


        //Validar campos requeridos
        if (!objUsuarioRequest.NombreCompleto
            || !objUsuarioRequest.Email
            || !objUsuarioRequest.Username
            || !esEditar && (!objUsuarioRequest.Password || !objUsuarioRequest.ConfirmarPassword)) {
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: 'Todos los campos marcados con "*" son requeridos.',
                    severity: "error",
                    vertical: "bottom",
                    horizontal: "left"
                },
            });
            handleCloseModal();
            return;
        }

        // console.log("Usuario Request:", objUsuarioRequest);
        // return;

        const action = esEditar ? editarUsuario : registrarUsuario;

        try {
            const response = await action(objUsuarioRequest, dispatch, UsuarioEnSesion);

            setLoading(false);
            if (response.status === HttpStatus.OK) {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Información guardada exitosamente.",
                        severity: "success",
                        vertical: "bottom",
                        horizontal: "left"
                    },
                });

                //setTimeout(() => {
                //Hacer redirect al Lisado de Usuarios.
                navigate(PathsUrl.UsuarioListado);
                //}, 2000); // 2 seconds delay

            } else {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Ocurrió un error al guardar la información: " + Object.keys(response.data.errors),
                        severity: "error",
                        vertical: "bottom",
                        horizontal: "left"
                    },
                });
            }

        } catch {
            //console.log("Error:", error);
            // dispatch({
            //     type: "OPEN_SNACKBAR",
            //     openMensaje: {
            //         open: true,
            //         mensaje: "Ocurrió un error al procesar la solicitud.",
            //         severity: "error",
            //         vertical: "bottom",
            //         horizontal: "left"
            //     },
            // });
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    }

    return { handleGuardarUsuario, loading };
}


export const useValidarModificacionesModeloCaptura = () => {
    const handleValidarModificacionesModelo = (usuario, usuarioOriginal) => {
        if (usuario.Password !== "" || usuario.ConfirmarPassword !== "") return true;

        // Remove all non-numeric characters from numeroTelefono
        const cleanedNumeroTelefonoA = usuario.numeroTelefono ? usuario.numeroTelefono.replace(/\D/g, '') : "";
        const cleanedNumeroTelefonoB = usuarioOriginal.phoneNumber ? usuarioOriginal.phoneNumber.replace(/\D/g, '') : "";

        if (!usuario.PerfilId) usuario.PerfilId = "00000000-0000-0000-0000-000000000000";

        const objA = {
            "NombreCompleto": usuario.NombreCompleto,
            "Email": usuario.Email,
            "Username": usuario.Username,
            "NumeroTelefono": cleanedNumeroTelefonoA,
            "PerfilId": usuario.PerfilId,
            "Activo": usuario.Activo,
            "UsuarioConfiguracion": {
                "ExcederOchoHoras": usuario.Config.excederOchoHoras,
                "HoraRangoInicio": usuario.Config.horaRangoInicio,
                "HoraRangoFin": usuario.Config.horaRangoFin,
                "PermitirCapturaFinDeSemana": usuario.Config.permitirCapturaFinDeSemana,
                "HorasPermitidasPorDia": usuario.Config.horasPermitidasPorDia,
                "FechaNacimiento": usuario.Config.fechaNacimiento,
                "MostrarCumpleanio": usuario.Config.mostrarCumpleanio
            },
        };

        const objB = {
            "NombreCompleto": usuarioOriginal.nombreCompleto,
            "Email": usuarioOriginal.email,
            "Username": usuarioOriginal.userName,
            "NumeroTelefono": cleanedNumeroTelefonoB,
            "PerfilId": usuarioOriginal.perfilId,
            "Activo": usuarioOriginal.activo,
            "UsuarioConfiguracion": {
                "ExcederOchoHoras": usuarioOriginal.config.excederOchoHoras,
                "HoraRangoInicio": usuarioOriginal.config.horaRangoInicio,
                "HoraRangoFin": usuarioOriginal.config.horaRangoFin,
                "PermitirCapturaFinDeSemana": usuarioOriginal.config.permitirCapturaFinDeSemana,
                "HorasPermitidasPorDia": usuarioOriginal.config.horasPermitidasPorDia,
                "FechaNacimiento": usuarioOriginal.config.fechaNacimiento,
                "MostrarCumpleanio": usuarioOriginal.config.mostrarCumpleanio
            },
        };

        const strA = JSON.stringify(objA);
        const strB = JSON.stringify(objB);

        return strA !== strB;
    }

    return handleValidarModificacionesModelo;
}


export const useHandleActivarInactivarUsuario = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleActivarInactivarUsuario = async (
        e,
        objUsuarioSeleccionado,
        handleCloseConfirmDialog,
        setPaginadorRequest,
        usuarioEnSesion
    ) => {
        e.preventDefault();

        if (objUsuarioSeleccionado) {
            const isChecked = objUsuarioSeleccionado.Activo;
            const msgAccion = isChecked ? "Inactivar" : "Activar";
            const msgError = `Ocurrió un error al ${msgAccion} al usuario.`;
            setLoading(true);

            try {
                var response = await inactivarActivarUsuarioAction(objUsuarioSeleccionado, dispatch, usuarioEnSesion);
                setLoading(false);

                let { status, statusText } = response;

                if (status === HttpStatus.OK && statusText === "OK") {
                    let msgInformativo = `Información guardada correctamente.`;
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
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: msgError,
                            severity: "error",
                            vertical: "bottom",
                            horizontal: "left"
                        },
                    });
                }

                handleCloseConfirmDialog();

            } catch (error) {
                setLoading(false);
                const errorMessage = error.response?.data?.errors?.msg || msgError;
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

                handleCloseConfirmDialog();
            }
        }
    };

    return { handleActivarInactivarUsuario, loading };
}


export const useHandleEliminarUsuario = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);

    const handleEliminarUsuario = async (
        e,
        objUsuarioSeleccionado,
        handleCloseConfirmDialog,
        setPaginadorRequest,
        usuarioEnSesion
    ) => {
        e.preventDefault();

        if (objUsuarioSeleccionado) {
            const msgError = `Ocurrió un error al eliminar la información.`;
            setLoading(true);

            try {
                var response = await eliminarUsuarioAction(objUsuarioSeleccionado, dispatch, usuarioEnSesion);
                setLoading(false);

                let { status, statusText } = response;

                if (status === HttpStatus.OK && statusText === "OK") {
                    let msgInformativo = `Información eliminada correctamente.`;
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
                    dispatch({
                        type: "OPEN_SNACKBAR",
                        openMensaje: {
                            open: true,
                            mensaje: msgError,
                            severity: "error",
                            vertical: "bottom",
                            horizontal: "left"
                        },
                    });
                }

                handleCloseConfirmDialog();

            } catch (error) {
                setLoading(false);
                const errorMessage = error.response?.data?.errors?.msg || msgError;
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

                handleCloseConfirmDialog();
            }
        }
    };

    return { handleEliminarUsuario, loading };
}


