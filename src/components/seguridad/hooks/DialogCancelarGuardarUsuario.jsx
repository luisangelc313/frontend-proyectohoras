import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
} from "@mui/material";

const DialogCancelarGuardarUsuario = ({
    open,
    handleClose,
    handleCancelar,
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
        sx={{ "& .MuiDialog-paper": { width: "450px", height: "200px" } }}
    >
        <DialogTitle>INFORMATIVO</DialogTitle>
        <DialogContent>
            <Typography>
                Hay cambios pendientes sin guardar.<br />
                ¿Está seguro que desea cancelar?
            </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
            <Button
                onClick={handleClose}
                color="error"
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(42, 57, 63, 0.1)",
                    },
                }}
            >
                Cerrar
            </Button>
            <Button
                onClick={handleCancelar}
                color="info"
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(42, 57, 63, 0.1)",
                    },
                }}
            >
                Si, Cancelar
            </Button>
        </DialogActions>
    </Dialog>
);

export default DialogCancelarGuardarUsuario;