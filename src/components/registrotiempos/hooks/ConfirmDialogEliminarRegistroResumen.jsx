import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography
} from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress";

const ConfirmDialogEliminarRegistroResumen = ({
    open,
    onClose,
    onConfirm,
    proyectoEliminar = "",
    loading = false, // Manejador del estado de carga.
}) => {

    const handleonClose = (e, reason) => {
        // Puedes hacer lógica adicional aquí si lo necesitas
        if (onClose) onClose(e, reason);
    }

    const handleonConfirm = (e) => {
        if (onConfirm) onConfirm(e);
    };


    return (
        <Dialog
            open={open}
            onClose={handleonClose}
            sx={{ "& .MuiDialog-paper": { width: "530px", height: "260px", px: 2, my: 2 } }}>

            <DialogTitle
                sx={{
                    textAlign: "left",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 600
                }}>
                Confirmación de Eliminación
            </DialogTitle>

            <DialogContent
                sx={{
                    textAlign: "left",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    '&:hover .proyecto-eliminar': {
                        opacity: 1,
                        transition: 'opacity 0.3s',
                    }
                }}>
                <Typography variant="body2" gutterBottom>
                    ¿Está seguro de que desea eliminar este registro?
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Esta acción no se puede deshacer.
                </Typography>
                <Typography
                    variant="caption"
                    gutterBottom
                    className="proyecto-eliminar"
                    sx={{
                        display: 'block',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    }}
                >
                    Proyecto a eliminar: <b>{proyectoEliminar}</b>
                </Typography>
            </DialogContent>

            <Divider sx={{ my: 1 }} />

            <DialogActions sx={{ mb: 1 }}>
                <Button onClick={handleonClose} color="error" variant="outlined">
                    Cancelar
                </Button>
                <Button
                    onClick={handleonConfirm}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? "Eliminando..." : "Aceptar"}
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default ConfirmDialogEliminarRegistroResumen;