import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

const DialogEditarActividad = ({
  open,
  handleClose,
  actividadToEdit,
  errorNombreActividadEdit,
  nombreActividadEditRef,
  ingresarValoresMemoriaEdit,
  handleEditarActividad,
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
    <DialogTitle>Editar Actividad</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="nombreActividadEdit"
        label="Nombre"
        type="text"
        fullWidth
        variant="outlined"
        value={actividadToEdit?.Nombre || ""}
        inputRef={nombreActividadEditRef}
        error={errorNombreActividadEdit.nombreActividadEdit}
        onChange={(e) =>
          ingresarValoresMemoriaEdit({
            ...e,
            target: { ...e.target, value: e.target.value.toUpperCase() },
          })
        }
        helperText={`${
          actividadToEdit?.Nombre.length || 0
        }/${maxLength} caracteres`}
        slotProps={{
          htmlInput: { maxLength: 250 },
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
        onClick={handleEditarActividad}
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

export default DialogEditarActividad;
