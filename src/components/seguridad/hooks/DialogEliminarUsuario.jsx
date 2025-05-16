import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const DialogEliminarUsuario = ({
    open,
    handleClose,
    handleEliminarUsuario,
    usuarioSeleccionado,
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
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
            <Typography>
                ¿Está seguro de que desea eliminar este usuario?
            </Typography>
            {usuarioSeleccionado && (
                <Typography
                    variant="button"
                    gutterBottom
                    sx={{ display: "block", color: "red" }}
                >
                    {usuarioSeleccionado.NombreCompleto}
                </Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary" sx={{
                "&:hover": {
                    backgroundColor: "rgba(42, 57, 63, 0.1)",
                },
            }}>
                Cancelar
            </Button>
            <Button onClick={handleEliminarUsuario} color="primary" sx={{
                "&:hover": {
                    backgroundColor: "rgba(42, 57, 63, 0.1)",
                },
            }}>
                Eliminar
            </Button>
        </DialogActions>
    </Dialog>
);

export default DialogEliminarUsuario;
