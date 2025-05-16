import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const DialogEliminarActividad = ({
  open,
  handleClose,
  handleEliminarActividad,
  selectedActividad,
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
        ¿Está seguro de que desea eliminar esta actividad?
      </Typography>
      {selectedActividad && (
        <Typography
          variant="button"
          gutterBottom
          sx={{ display: "block", color: "red" }}
        >
          {selectedActividad.Nombre}
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
      <Button onClick={handleEliminarActividad} color="primary" sx={{
          "&:hover": {
            backgroundColor: "rgba(42, 57, 63, 0.1)",
          },
        }}>
        Eliminar
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogEliminarActividad;
