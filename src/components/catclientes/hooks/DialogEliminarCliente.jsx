import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const DialogEliminarCliente = ({
    open,
    handleClose,
    handleEliminarCliente,
    objClienteSeleccionado,
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
    >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
            <Typography>
                ¿Está seguro de que desea eliminar este cliente?
            </Typography>
            {objClienteSeleccionado && (
                <Typography
                    variant="button"
                    gutterBottom
                    sx={{ display: "block", color: "red" }}
                >
                    {objClienteSeleccionado.Nombre}
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
            <Button onClick={handleEliminarCliente} color="primary" sx={{
                "&:hover": {
                    backgroundColor: "rgba(42, 57, 63, 0.1)",
                },
            }}>
                Eliminar
            </Button>
        </DialogActions>
    </Dialog>
);

export default DialogEliminarCliente;
