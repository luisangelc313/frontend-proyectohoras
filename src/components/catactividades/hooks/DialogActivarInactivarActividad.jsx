import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const DialogActivarInactivarActividad = ({
  open,
  handleClose,
  handleActivarInactivarActividad,
  actividadToActiveInactive,
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
    <DialogTitle>Confirmar Inactivación</DialogTitle>
    <DialogContent>
      <Typography>
        ¿Está seguro de que desea{" "}
        {actividadToActiveInactive?.Activa ? "inactivar" : "activar"} esta
        actividad?
      </Typography>
      {actividadToActiveInactive && (
        <Typography
          variant="button"
          gutterBottom
          sx={{ display: "block", color: "red" }}
        >
          {actividadToActiveInactive.Nombre}
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
        onClick={handleActivarInactivarActividad}
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

export default DialogActivarInactivarActividad;