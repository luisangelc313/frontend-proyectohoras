import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

const ConfirmDialog = ({
    open,
    title = "Confirmar acción",
    content = "¿Está seguro de que desea continuar?",
    onClose,
    onConfirm,
    width = "",
    height = ""
}) => (
    <Dialog open={open} onClose={onClose}
        sx={{ "& .MuiDialog-paper": { width: width || "450px", height: height || "200px", px: 2, my: 2 } }}>
        <DialogTitle
            sx={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 600
            }}>{title}</DialogTitle>
        <DialogContent
            sx={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary" variant="outlined">
                Cancelar
            </Button>
            <Button onClick={onConfirm} color="error" variant="contained">
                Sí, continuar
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;