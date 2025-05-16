import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

const DialogNuevaActividad = ({
  open,
  handleClose,
  nombreActividad,
  errorNombreActividad,
  nombreActividadRef,
  ingresarValoresMemoria,
  handleGuardarActividad,
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
    <DialogTitle>Nueva Actividad</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="nombreActividad"
        label="Nombre"
        type="text"
        fullWidth
        variant="outlined"
        error={errorNombreActividad.nombreActividad}
        inputRef={nombreActividadRef}
        value={nombreActividad}
        onChange={(e) =>
          ingresarValoresMemoria({
            ...e,
            target: { ...e.target, value: e.target.value.toUpperCase() },
          })
        }
        helperText={`${nombreActividad.length}/${maxLength} caracteres`}
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
        onClick={handleGuardarActividad}
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

export default DialogNuevaActividad;