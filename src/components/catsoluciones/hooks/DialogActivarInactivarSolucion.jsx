import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const DialogActivarInactivarSolucion = ({
    open,
    handleClose,
    handleActivarInactivar,
    solucionToActiveInactive,
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
        sx={{ "& .MuiDialog-paper": { width: "600px", height: "230px" } }}
    >
        <DialogTitle>
            Confirmar {solucionToActiveInactive?.Activo ? "Inactivación" : "Activación"}
        </DialogTitle>
        <DialogContent>
            <Typography>
                ¿Está seguro de que desea
                {solucionToActiveInactive?.Activo ? " inactivar " : " activar "} esta solución?
            </Typography>
            {solucionToActiveInactive && (
                <Typography
                    variant="button"
                    gutterBottom
                    sx={{ display: "block", color: "red" }}
                >
                    {solucionToActiveInactive.Nombre}
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

export default DialogActivarInactivarSolucion;