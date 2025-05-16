import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography
} from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
//import LockIcon from "@mui/icons-material/Lock";
//import SecurityIcon from '@mui/icons-material/Security';

import style from "../Tool/style";
import { useStateValue } from "../../context/store";
import { actualizarPwd } from "../../actions/UsuarioAction";


const CambiarPwd = () => {
    const navigate = useNavigate();

    const [{ sesionUsuario }, dispatch] = useStateValue();
    const [usuarioCredenciales, setUsuarioCredenciales] = useState({
        usuarioId: "",
        passwordActual: "",
        passwordNuevo: "",
        passwordNuevoConfirmar: ""
    });

    // State for loading
    const [loading, setLoading] = useState(false);

    const [mensajeErrorServidor, setMensajeErrorServidor] = useState("");
    const [errorPasswordActual, setErrorPasswordActual] = useState(false);
    const [error, setError] = useState(false);

    // Check if both fields have values
    const isButtonDisabled = !usuarioCredenciales.passwordNuevo || !usuarioCredenciales.passwordNuevoConfirmar;

    const handlePasswordCurrentChange = e => {
        setUsuarioCredenciales(prev => ({
            ...prev,
            passwordActual: e.target.value
        }));

        setErrorPasswordActual(
            (e.target.value === usuarioCredenciales.passwordNuevo || e.target.value === usuarioCredenciales.passwordNuevoConfirmar)
            && e.target.value !== ""
        );
    };

    const handlePasswordChange = e => {
        setUsuarioCredenciales(prev => ({
            ...prev,
            passwordNuevo: e.target.value
        }));

        setError(
            (e.target.value !== usuarioCredenciales.passwordNuevoConfirmar && usuarioCredenciales.passwordNuevoConfirmar !== "")
            || usuarioCredenciales.passwordActual === e.target.value
        );
    };

    const handlePasswordConfirmChange = e => {
        setUsuarioCredenciales(prev => ({
            ...prev,
            passwordNuevoConfirmar: e.target.value
        }));

        setError(
            (e.target.value !== usuarioCredenciales.passwordNuevo && usuarioCredenciales.passwordNuevo !== "")
            || usuarioCredenciales.passwordActual === e.target.value
        );
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { passwordActual, passwordNuevo, passwordNuevoConfirmar } = usuarioCredenciales;

        // Validar que la nueva contraseña sea diferente a la actual
        if (!passwordActual
            || passwordActual === passwordNuevo
            || passwordActual === passwordNuevoConfirmar
        ) {
            setErrorPasswordActual(true);
            setError(true);
            setLoading(false);
            return;
        }

        if (!passwordActual || !passwordNuevo || !passwordNuevoConfirmar) {
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Todos los campos son obligatorios.",
                    severity: "warning",
                    vertical: "bottom",
                    horizontal: "left"
                },
            });
            return;
        }

        // Start loading
        setLoading(true);

        // Actualizar contraseña
        try {
            const response = await actualizarPwd({
                usuarioId: usuarioCredenciales.usuarioId,
                passwordActual,
                passwordNuevo,
                passwordNuevoConfirmar
            }, dispatch);

            if (response.status === 200) {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Contraseña actualizada exitosamente.",
                        severity: "success",
                        vertical: "bottom",
                        horizontal: "left"
                    },
                });

                navigate('/', { raplace: true });

            } else {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: response.data.mensaje || "Error al actualizar la contraseña.",
                        severity: "error",
                        vertical: "bottom",
                        horizontal: "left"
                    },
                });
            }

            return;

        } catch (error) {
            setLoading(false); // Set loading to false after the request

            let mensajeError = "Error al actualizar la contraseña.";
            const objError = error?.response?.data?.errors;
            if (objError?.PasswordActual) {
                mensajeError = objError?.PasswordActual[0];
                if (mensajeError) {
                    setMensajeErrorServidor(mensajeError);
                }
                //errorPasswordActual = true;
                setErrorPasswordActual(true);
            }
            else if (objError?.PasswordNuevo) {
                mensajeError = objError?.PasswordNuevo[0];
                if (mensajeError) {
                    setMensajeErrorServidor(mensajeError);
                }
                //error = true;
                setError(true);
            }
            else if (objError?.PasswordNuevoConfirmar) {
                mensajeError = objError?.PasswordNuevoConfirmar[0];
                if (mensajeError) {
                    setMensajeErrorServidor(mensajeError);
                }
                //errors.passwordNuevoConfirmar = true;
                setError(true);
            }
            else {
                //Viene del server el valor de "msg"
                let msg = error?.response?.data?.errors?.msg;
                if (msg) {
                    mensajeError = msg;
                    setMensajeErrorServidor(mensajeError);

                    if (objError.msg.includes("Contraseña Actual")) setErrorPasswordActual(true);
                }
            }

            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: mensajeError,
                    severity: "error",
                    vertical: "bottom",
                    horizontal: "left",
                },
            });

        } finally {
            setLoading(false); // Set loading to false after the request
        }
    }

    useEffect(() => {
        if (sesionUsuario.usuario && sesionUsuario.usuario.usuarioId) {
            setUsuarioCredenciales(prev => ({
                ...prev,
                usuarioId: sesionUsuario.usuario.usuarioId
            }));
        }

    }, [sesionUsuario.usuario]);

    return (
        <Container maxWidth="sm" style={style.container}>
            <div style={style.paper}>
                <Avatar style={style.avatar}>
                    <VpnKeyIcon style={style.icon} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Por seguridad, debe cambiar su contraseña.
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginBottom: "5px", marginTop: "5px" }}
                >
                    Su nueva contraseña debe ser diferente a la default.
                </Typography>
                <Typography
                    variant="body2"
                    color="textPrimary"
                    style={{ marginBottom: "5px", marginTop: "5px" }}
                >
                    Nueva Contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.
                </Typography>
                <form style={style.form}>
                    <TextField
                        variant="outlined"
                        type="password"
                        id="passwordActual"
                        label="Contraseña Actual"
                        name="passwordActual"
                        fullWidth
                        required
                        autoFocus
                        onChange={handlePasswordCurrentChange}
                        value={usuarioCredenciales.passwordActual}
                        error={errorPasswordActual}
                        helperText={
                            mensajeErrorServidor && errorPasswordActual
                                ? mensajeErrorServidor
                                : errorPasswordActual
                                    ? (!usuarioCredenciales.passwordActual
                                        ? "La contraseña actual es requerida"
                                        : (usuarioCredenciales.passwordActual === usuarioCredenciales.passwordNuevo || usuarioCredenciales.passwordActual === usuarioCredenciales.passwordNuevoConfirmar)
                                            ? "La contraseña actual debe ser diferente a la nueva"
                                            : "")
                                    : ""
                        }
                        slotProps={{
                            htmlInput: { maxLength: 50 },
                        }}
                        style={{
                            marginBottom: "15px", marginTop: "20px"
                        }}
                    />
                    <TextField
                        variant="outlined"
                        type="password"
                        id="passwordNuevo"
                        label="Nueva Contraseña"
                        name="passwordNuevo"
                        fullWidth
                        required
                        value={usuarioCredenciales.passwordNuevo}
                        onChange={handlePasswordChange}
                        error={error}
                        helperText={
                            mensajeErrorServidor && error
                                ? mensajeErrorServidor
                                : error
                                    ? (usuarioCredenciales.passwordActual === usuarioCredenciales.passwordNuevo
                                        ? "La nueva contraseña debe ser diferente a la actual"
                                        : "Las contraseñas no coinciden")
                                    : ""
                        }
                        slotProps={{
                            htmlInput: { maxLength: 50 },
                        }}
                        style={{
                            marginBottom: "15px"
                        }}
                    />
                    <TextField
                        variant="outlined"
                        type="password"
                        id="passwordNuevoConfirmar"
                        label="Confirmar Nueva Contraseña"
                        name="passwordNuevoConfirmar"
                        fullWidth
                        required
                        onChange={handlePasswordConfirmChange}
                        error={error}
                        helperText={
                            mensajeErrorServidor && error
                                ? mensajeErrorServidor
                                : error
                                    ? (usuarioCredenciales.passwordActual === usuarioCredenciales.passwordNuevoConfirmar
                                        ? "La nueva contraseña debe ser diferente a la actual"
                                        : "Las contraseñas no coinciden")
                                    : ""
                        }
                        slotProps={{
                            htmlInput: { maxLength: 50 },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        style={style.submit}
                        disabled={loading || isButtonDisabled} // Disable button if loading or fields are empty || Disable button while loading
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default CambiarPwd;
