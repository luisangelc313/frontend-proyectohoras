import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";

const DialogEditarCliente = ({
    open,
    handleClose,
    clienteToEdit,
    errorNombreClienteEdit,
    nombreClienteEditRef,
    ingresarValoresMemoriaEdit,
    handleEditarCliente,
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
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="nombreClienteEdit"
                label="Nombre"
                type="text"
                fullWidth
                variant="outlined"
                value={clienteToEdit?.Nombre || ""}
                inputRef={nombreClienteEditRef}
                error={errorNombreClienteEdit.nombreClienteEdit}
                onChange={(e) =>
                    ingresarValoresMemoriaEdit({
                        ...e,
                        target: { ...e.target, value: e.target.value.toUpperCase() },
                    })
                }
                helperText={`${clienteToEdit?.Nombre.length || 0}/${maxLength} caracteres`}
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
                onClick={handleEditarCliente}
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

export default DialogEditarCliente;
