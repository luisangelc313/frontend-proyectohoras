import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";

const DialogNuevoPerfil = ({
    open,
    handleClose,
    nombrePerfil,
    errorNombrePerfil,
    nombrePerfilRef,
    ingresarValoresMemoria,
    handleGuardarPerfil,
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
        <DialogTitle>Nuevo Perfil</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="nombrePerfil"
                label="Nombre"
                type="text"
                fullWidth
                variant="outlined"
                error={errorNombrePerfil.nombrePerfil}
                inputRef={nombrePerfilRef}
                value={nombrePerfil}
                onChange={(e) =>
                    ingresarValoresMemoria({
                        ...e,
                        target: { ...e.target, value: e.target.value.toUpperCase() },
                    })
                }
                helperText={`${nombrePerfil.length}/${maxLength} caracteres`}
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
                onClick={handleGuardarPerfil}
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

export default DialogNuevoPerfil;