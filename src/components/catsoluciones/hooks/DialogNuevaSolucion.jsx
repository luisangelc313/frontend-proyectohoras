import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";

const DialogNuevaSolucion = ({
    open,
    handleClose,
    nombreSolucion,
    errorNombreSolucion,
    nombreSolucionRef,
    ingresarValoresMemoria,
    handleGuardarSolucion,
    loading,
    maxLength,
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
        <DialogTitle>Nueva Solucion</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="nombreSolucion"
                label="Nombre"
                type="text"
                fullWidth
                variant="outlined"
                error={errorNombreSolucion.nombreSolucion}
                inputRef={nombreSolucionRef}
                value={nombreSolucion}
                onChange={(e) =>
                    ingresarValoresMemoria({
                        ...e,
                        target: { ...e.target, value: e.target.value.toUpperCase() },
                    })
                }
                helperText={`${nombreSolucion.length}/${maxLength} caracteres`}
                slotProps={{
                    htmlInput: { maxLength },
                }}
            />
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
                onClick={handleGuardarSolucion}
                color="primary"
                disabled={loading}
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

export default DialogNuevaSolucion;