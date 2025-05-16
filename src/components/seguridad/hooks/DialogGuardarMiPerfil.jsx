import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";

const DialogGuardar = ({
    open,
    handleClose,
    handleGuardar,
    Transition,
    loading,
}) => (
    <Dialog
        open={open}
        onClose={(e, reason) => {
            e.preventDefault();
            if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                handleClose();
            }
        }}
        TransitionComponent={Transition}
        sx={{ "& .MuiDialog-paper": { width: "450px", height: "180px" } }}
    >
        <DialogTitle>INFORMATIVO</DialogTitle>
        <DialogContent>
            <Typography>
                ¿Desea continuar y guardar los cambios?
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
                Cancelar
            </Button>
            <Button
                onClick={handleGuardar}
                disabled={loading}
                color="info"
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(42, 57, 63, 0.1)",
                    },
                }}
            >
                {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
        </DialogActions>
    </Dialog>

);

export default DialogGuardar;