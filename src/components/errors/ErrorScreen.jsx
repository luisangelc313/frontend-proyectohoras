import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

//import style from "../Tool/style";

const ErrorScreen = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/"); // Redirige a la página principal
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            bgcolor="#f8f9fa"
            textAlign="center"
            p={3}
        >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "#d32f2f", mb: 2 }} />
            <Typography variant="h4" gutterBottom color="textPrimary">
                Error 404: Página no encontrada
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
                👀
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                sx={{ textTransform: "none", padding: "10px 20px" }}
            >
                Volver al inicio
            </Button>
        </Box>
    );
}

export default ErrorScreen;