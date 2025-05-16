import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";

const DialogEditarPerfil = ({
    open,
    handleClose,
    perfilToEdit,
    errorNombrePerfilEdit,
    nombrePerfilEditRef,
    ingresarValoresMemoriaEdit,
    handleEditarPerfil,
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
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="nombrePerfilEdit"
                label="Nombre"
                type="text"
                fullWidth
                variant="outlined"
                value={perfilToEdit?.Nombre || ""}
                inputRef={nombrePerfilEditRef}
                error={errorNombrePerfilEdit.nombrePerfilEdit}
                onChange={(e) =>
                    ingresarValoresMemoriaEdit({
                        ...e,
                        target: { ...e.target, value: e.target.value.toUpperCase() },
                    })
                }
                helperText={`${perfilToEdit?.Nombre.length || 0}/${maxLength} caracteres`}
                slotProps={{
                    htmlInput: { maxLength: 150 },
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
                onClick={handleEditarPerfil}
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

export default DialogEditarPerfil;
