import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const DialogActivarInactivarUsuario = ({
    open,
    handleClose,
    handleActivarInactivar,
    usuarioToActiveInactive,
    Transition,
}) => (
    <Dialog
        open={open}
        onClose={(event, reason) => {
            if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                handleClose();
            }
        }}
        TransitionComponent={Transition}
        sx={{ "& .MuiDialog-paper": { width: "550px", height: "220px" } }}
    >
        <DialogTitle>Confirmar {usuarioToActiveInactive?.Activo ? "Inactivación" : "Activación"}</DialogTitle>
        <DialogContent>
            <Typography>
                ¿Está seguro de que desea{" "}
                {usuarioToActiveInactive?.Activo ? "Inactivar" : "Activar"} este usuario?
            </Typography>
            {usuarioToActiveInactive && (
                <Typography
                    variant="button"
                    gutterBottom
                    sx={{ display: "block", color: "red" }}
                >
                    {usuarioToActiveInactive.NombreCompleto}
                </Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button
                onClick={handleClose}
                color="primary"
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(42, 57, 63, 0.1)",
                    },
                    color: "red",
                }}
            >
                Cancelar
            </Button>
            <Button
                onClick={handleActivarInactivar}
                color="primary"
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(42, 57, 63, 0.1)",
                    },
                }}
            >
                Confirmar
            </Button>
        </DialogActions>
    </Dialog>
);

export default DialogActivarInactivarUsuario;