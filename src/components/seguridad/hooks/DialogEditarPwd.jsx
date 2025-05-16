import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import {
    AppBar,
    Box,
    Button,
    CircularProgress, // Import CircularProgress
    Container,
    Dialog,
    Divider,
    Grid2,
    IconButton,
    Snackbar,
    SnackbarContent,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import style from "../../Tool/style";
import { useStateValue } from '../../../context/store';
import { actualizarPwd } from "../../../actions/UsuarioAction";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const DialogEditarPwd = ({
    handleOpen,
    handleClose,
    Transition,
    usuarioSesionActual
}) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [{ sesionUsuario }, dispatch] = useStateValue();

    const [usuarioCredenciales, setUsuarioCredenciales] = useState({
        usuarioId: usuarioSesionActual?.usuarioId || "",
        passwordActual: "",
        passwordNuevo: "",
        passwordNuevoConfirmar: ""
    });

    const [errors, setErrors] = useState({
        passwordActual: false,
        passwordNuevo: false,
        passwordNuevoConfirmar: false
    });

    const [loading, setLoading] = useState(false); // Add loading state
    const [logoutLoading, setLogoutLoading] = useState(false); // Add logout loading state
    const [isDisabled, setIsDisabled] = useState(false); // Add isDisabled state


    const ingresarValoresMemoriaPwdActual = e => {
        const { name, value } = e.target;
        setUsuarioCredenciales((anterior) => ({
            ...anterior,
            [name]: value,
            passwordNuevo: anterior.passwordNuevo, // Asegura que no se altere
            passwordNuevoConfirmar: anterior.passwordNuevoConfirmar // Asegura que no se altere
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: !value && errors.passwordActual ? true : false,
        }));
    };


    const ingresarValoresMemoriaPwdNuevo = (e) => {
        const { name, value } = e.target;
        setUsuarioCredenciales((anterior) => ({
            ...anterior,
            [name]: value,
            passwordActual: anterior.passwordActual, // Asegura que no se altere
            passwordNuevoConfirmar: anterior.passwordNuevoConfirmar // Asegura que no se altere
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: !value && errors.passwordNuevo ? true : false,
        }));
    };


    const ingresarValoresMemoriaPwdNuevoConfirmar = e => {
        const { name, value } = e.target;
        setUsuarioCredenciales((anterior) => ({
            ...anterior,
            [name]: value,
            passwordActual: anterior.passwordActual, // Asegura que no se altere
            passwordNuevo: anterior.passwordNuevo // Asegura que no se altere
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: !value && errors.passwordNuevoConfirmar ? true : false,
        }));
    };


    const handleGuardarCambios = async e => {
        e.preventDefault();
        const { passwordActual, passwordNuevo, passwordNuevoConfirmar } = usuarioCredenciales;

        if (!usuarioCredenciales.usuarioId) {
            usuarioCredenciales.usuarioId = sesionUsuario.usuario.usuarioId;
        }

        const newErrors = {
            passwordActual: !passwordActual,
            passwordNuevo: !passwordNuevo,
            passwordNuevoConfirmar: !passwordNuevoConfirmar
        };

        setErrors(newErrors);

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

        if (passwordNuevo !== passwordNuevoConfirmar) {
            dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                    open: true,
                    mensaje: "Las nuevas contraseñas no coinciden.",
                    severity: "warning",
                    vertical: "bottom",
                    horizontal: "left"
                },
            });
            return;
        }

        setLoading(true); // Set loading to true before the request

        // Actualizar contraseña
        try {
            const response = await actualizarPwd({
                usuarioId: usuarioCredenciales.usuarioId,
                passwordActual,
                passwordNuevo,
                passwordNuevoConfirmar
            }, dispatch);

            if (response.status === 200) {
                setLogoutLoading(true); // Set logout loading to true
                setIsDisabled(true); // Disable inputs and buttons

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

                setTimeout(() => {
                    //Hacer un cierre de sesión por seguridad de usuario.
                    console.log('se ejecuto cerrar sesion');
                    localStorage.removeItem("token_seguridad");
                    dispatch({
                        type: "SALIR_SESION",
                        nuevoUsuario: null,
                        autenticado: false
                    })
                    navigate('/auth/login', { raplace: true });

                }, 3500); // 2.5 seconds delay
            } else {
                setIsDisabled(false);
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
            setIsDisabled(false);

            let mensajeError = "Error al actualizar la contraseña.";
            const objError = error?.response?.data?.errors;
            if (objError?.PasswordActual) {
                mensajeError = objError?.PasswordActual[0];
                errors.passwordActual = true;
                setErrors(errors);
            }
            else if (objError?.PasswordNuevo) {
                mensajeError = objError?.PasswordNuevo[0];
                errors.passwordNuevo = true;
                setErrors(errors);
            }
            else if (objError?.PasswordNuevoConfirmar) {
                mensajeError = objError?.PasswordNuevoConfirmar[0];
                errors.passwordNuevoConfirmar = true;
                setErrors(errors);
            }
            else {
                //Viene del server el valor de "msg"
                let msg = error?.response?.data?.errors?.msg;
                if (msg) mensajeError = msg;
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

    return (
        <Dialog fullScreen open={handleOpen} onClose={handleClose} TransitionComponent={Transition} style={style.dialogEditPwd}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close" disabled={isDisabled}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Seguridad de Usuario
                    </Typography>
                    <Button autoFocus variant='outlined' color="inherit" onClick={handleGuardarCambios} disabled={loading || isDisabled}>
                        {loading ? <CircularProgress size={24} /> : "Guardar"}
                    </Button>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="md" justify="center" sx={{ my: 5 }}>
                <form style={style.form}>
                    <Grid2 container spacing={2}>
                        {/* Password */}
                        <Grid2 size={{ xs: 12, md: 12 }}>
                            <TextField
                                variant="outlined"
                                type="password"
                                id="passwordActual"
                                label="Contraseña Actual"
                                name="passwordActual"
                                fullWidth
                                required
                                autoFocus
                                disabled={isDisabled}
                                error={errors.passwordActual}
                                onChange={ingresarValoresMemoriaPwdActual}
                                value={usuarioCredenciales.passwordActual || ""}
                                slotProps={{
                                    htmlInput: { maxLength: 50 },
                                }}
                            />
                        </Grid2>
                        {/* Nuevo Password */}
                        <Grid2 size={{ xs: 12, md: 12 }}>
                            <TextField
                                variant="outlined"
                                type="password"
                                id="passwordNuevo"
                                label="Nueva Contraseña"
                                name="passwordNuevo"
                                fullWidth
                                required
                                disabled={isDisabled}
                                error={errors.passwordNuevo}
                                onChange={ingresarValoresMemoriaPwdNuevo}
                                value={usuarioCredenciales.passwordNuevo || ""}
                                slotProps={{
                                    htmlInput: { maxLength: 50 },
                                }}
                            />
                        </Grid2>
                        {/* Confirmar Nuevo Password */}
                        <Grid2 size={{ xs: 12, md: 12 }}>
                            <TextField
                                variant="outlined"
                                type="password"
                                id="passwordNuevoConfirmar"
                                label="Confirmar Nueva Contraseña"
                                name="passwordNuevoConfirmar"
                                fullWidth
                                required
                                disabled={isDisabled}
                                error={errors.passwordNuevoConfirmar}
                                onChange={ingresarValoresMemoriaPwdNuevoConfirmar}
                                value={usuarioCredenciales.passwordNuevoConfirmar || ""}
                                slotProps={{
                                    htmlInput: { maxLength: 50 },
                                }}
                            />
                        </Grid2>
                    </Grid2>
                </form>

                <Grid2 size={{ xs: 12, md: 12 }} sx={{ mt: 10 }}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                            Requisitos de Contraseña:
                        </Typography>
                        <Divider sx={{ flexGrow: 1, ml: 2 }} />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.
                    </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 12 }} sx={{ mt: 10 }}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                            Advertencia:
                        </Typography>
                        <Divider sx={{ flexGrow: 1, ml: 2 }} />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Por su seguridad.
                    </Typography>
                    <Typography variant="body2">
                        Al cambiar la contraseña, se cerrará la sesión actual y deberá iniciar sesión nuevamente.
                    </Typography>
                </Grid2>
            </Container>
            <Snackbar
                open={logoutLoading}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1300,
                }}
            >
                <SnackbarContent
                    message="Cerrando sesión..."
                    sx={{
                        width: '100%',
                        maxWidth: '600px', // Set max width
                        height: '80px', // Set height
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.2rem', // Increase font size
                    }}
                />
            </Snackbar>
        </Dialog>
    );
}

export default DialogEditarPwd;