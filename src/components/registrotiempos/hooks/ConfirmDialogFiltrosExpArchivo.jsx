import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider
} from "@mui/material";

const ConfirmDialogFiltrosExpArchivo = ({
    open,
    title = "Exportar Archivo",
    content = "¿Está seguro de que desea continuar?",
    onClose,
    onConfirm,
    width = "",
    height = ""
}) => {
    return (
        <Dialog open={open} onClose={onClose}
            sx={{ "& .MuiDialog-paper": { width: width || "450px", height: height || "200px", px: 2, my: 2 } }}>
            <DialogTitle
                sx={{
                    textAlign: "left",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 600
                }}>{title}</DialogTitle>
            <DialogContent
                sx={{
                    textAlign: "left",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                {content}
            </DialogContent>
            <Divider sx={{ my: 1 }} />
            <DialogActions sx={{ mb: 1 }}>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialogFiltrosExpArchivo;