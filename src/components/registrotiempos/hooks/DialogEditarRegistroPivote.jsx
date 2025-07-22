import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Typography
} from "@mui/material";

const DialogEditarRegistroPivote = ({ open, onClose, data, onGuardar }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ "& .MuiDialog-paper": { width: "600px", height: "350px", px: 2, my: 2 } }}>

            <DialogTitle>Editar Registro</DialogTitle>

            <DialogContent>
                {data ? (
                    <>
                        <Typography>Cliente: {data?.cliente?.nombre}</Typography>
                        <Typography>Solución: {data?.solucion?.nombre}</Typography>
                        <Typography>Proyecto: {data?.proyecto}</Typography>
                        <Typography>Actividad: {data?.actividad?.nombre}</Typography>
                        <Typography>Horas: {data?.horas}</Typography>
                        {/* Aquí puedes agregar TextFields para edición */}
                    </>
                ) : (
                    <Typography>No hay datos para mostrar.</Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={() => onGuardar(data)} color="primary" variant="contained">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogEditarRegistroPivote;