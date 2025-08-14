import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Link,
    Paper,
    TextField,
    Typography,
    Alert,
    Stack,
    Divider,
} from "@mui/material";

import { PathsUrl } from "../../utils/Paths";


const RecuperarPwd = () => {
    // Simple email validation
    const isValidEmail = (email) => /.+@.+\..+/.test(email.trim());

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        setError("");

        const trimmed = email.trim();
        if (!trimmed) {
            setError("Ingresa tu correo electrónico.");
            return;
        }
        if (!isValidEmail(trimmed)) {
            setError("Formato de correo no válido.");
            return;
        }

        try {
            setLoading(true);

            // Simula una llamada a la API
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSent(true);
        } catch (err) {
            setError(err?.message || "No se pudo enviar el enlace. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: { xs: "100dvh", sm: "100vh" },
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    // Soft, modern background
                    background: (theme) =>
                        theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)"
                            : "linear-gradient(135deg, #0b0f19 0%, #121826 100%)",
                }}
            >
                <Container maxWidth="xs" disableGutters sx={{ mx: "auto" }}>
                    <Paper
                        elevation={8}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        <Stack spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                                <LockResetIcon />
                            </Avatar>
                            <Box textAlign="center">
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Recuperar contraseña
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Escribe el correo asociado a tu cuenta y te enviaremos un enlace
                                    para restablecer tu contraseña.
                                </Typography>
                            </Box>

                            {sent && (
                                <Alert severity="success" sx={{ width: "100%" }}>
                                    ¡Listo! Si <b>{email.trim()}</b> está registrado, te llegará un
                                    correo con instrucciones para restablecer tu contraseña.
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
                                <Stack spacing={2}>
                                    <TextField
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Correo electrónico"
                                        placeholder="tucorreo@dominio.com"
                                        autoComplete="email"
                                        autoFocus
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={Boolean(error)}
                                        helperText={error || " "}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        fullWidth
                                    >
                                        {loading ? "Enviando…" : sent ? "Reenviar enlace" : "Enviar enlace"}
                                    </Button>

                                    <Divider flexItem>o</Divider>

                                    {/* Opción con href (ancla nativa). Para React Router, usa component={RouterLink} to="/login" */}
                                    <Link
                                        component={RouterLink}
                                        to={`/${PathsUrl.AuthLogin}`}
                                        underline="hover"
                                        sx={{ alignSelf: "center", cursor: "pointer" }}
                                        replace
                                    >
                                        Volver a iniciar sesión
                                    </Link>
                                </Stack>
                            </Box>

                            <Typography variant="caption" color="text.secondary">
                                ¿No recibiste el correo? Revisa la carpeta de spam o intenta de nuevo en 1–2 minutos.
                            </Typography>
                        </Stack>
                    </Paper>

                    <Typography variant="caption" display="block" textAlign="center" mt={2} color="text.secondary">
                        © {new Date().getFullYear()} — B2B Negocios
                    </Typography>
                </Container>
            </Box>
        </>
    );
}

export default RecuperarPwd