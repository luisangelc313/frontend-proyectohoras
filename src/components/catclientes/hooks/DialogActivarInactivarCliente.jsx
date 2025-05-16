import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const DialogActivarInactivarCliente = ({
  open,
  handleClose,
  handleActivarInactivar,
  clienteToActiveInactive,
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
        {clienteToActiveInactive?.Activo ? "inactivar" : "activar"} este cliente?
      </Typography>
      {clienteToActiveInactive && (
        <Typography
          variant="button"
          gutterBottom
          sx={{ display: "block", color: "red" }}
        >
          {clienteToActiveInactive.Nombre}
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
        onClick={handleActivarInactivar}
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

export default DialogActivarInactivarCliente;