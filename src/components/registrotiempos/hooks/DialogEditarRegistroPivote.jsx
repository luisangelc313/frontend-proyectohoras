import { useEffect } from "react";
import {
    Autocomplete,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    FormControl,
    Grid2,
    Typography, TextField,
} from "@mui/material";
import { useState } from "react";

const DialogEditarRegistroPivote = ({
    open,
    onClose,
    data,
    onGuardar,
    usuarioSesion,
    dataSource,
}) => {

    const maxLengthProyecto = 1000;
    const maxHoras = Number(usuarioSesion?.usuarioConfig?.horasPermitidasPorDia) || 0;
    const horasPermitidas = Array.from({ length: maxHoras }, (_, i) => ({
        id: i + 1,
        nombre: String(i + 1)
    }));

    //console.info("DialogEditarRegistroPivote data:", data);

    // Maneja el cambio de datos en los campos del formulario
    const handleRowChange = (field, value) => {
        setRegistroEditado(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const [registroEditado, setRegistroEditado] = useState(data || {});
    useEffect(() => {
        setRegistroEditado(data || {});
    }, [data]);



    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ "& .MuiDialog-paper": { width: "600px", height: "470px", px: 2, my: 2 } }}>

            <DialogTitle>Editar Registro</DialogTitle>
            <Divider sx={{ my: 1 }} />

            <DialogContent>
                {data ? (
                    <>
                        <Grid2 container spacing={2} sx={{ mt: 1 }}>
                            {/*CLIENTE */}
                            <Grid2 size={{ xs: 12, md: 12 }}>
                                <FormControl variant="outlined" size="small" fullWidth required>

                                    <Autocomplete
                                        options={dataSource.clientes}
                                        getOptionLabel={option => option.nombre || ""}
                                        isOptionEqualToValue={(option, value) => option.clienteId === value.clienteId}
                                        value={dataSource.clientes.find(c => c.clienteId === registroEditado.clienteId) || null}
                                        onChange={(_, newValue) =>
                                            handleRowChange("clienteId", newValue ? newValue.clienteId : "")
                                        }
                                        renderOption={(props, option, { index }) => (
                                            <li {...props} key={`${option.clienteId}-${index}`}>
                                                {option.nombre}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Cliente"
                                                size="small"
                                                required
                                                variant="outlined"
                                            //error={errors.cliente}
                                            //helperText={errors.cliente ? "Requerido" : ""}
                                            />
                                        )}
                                        noOptionsText="Sin resultados"
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid2>

                            {/* SOLUCIÓN */}
                            <Grid2 size={{ xs: 12, md: 12 }}>
                                <FormControl variant="outlined" size="small" fullWidth required>

                                    <Autocomplete
                                        options={dataSource.soluciones}
                                        getOptionLabel={option => option.nombre || ""}
                                        isOptionEqualToValue={(option, value) => option.solucionId === value.solucionId}
                                        value={dataSource.soluciones.find(c => c.solucionId === registroEditado.solucionId) || null}
                                        onChange={(_, newValue) =>
                                            handleRowChange("solucionId", newValue ? newValue.solucionId : "")
                                        }
                                        renderOption={(props, option, { index }) => (
                                            <li {...props} key={`${option.solucionId}-${index}`}>
                                                {option.nombre}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Solucion"
                                                size="small"
                                                required
                                                variant="outlined"
                                            //error={errors.solucion}
                                            //helperText={errors.solucion ? "Requerido" : ""}
                                            />
                                        )}
                                        noOptionsText="Sin resultados"
                                        fullWidth
                                    />

                                </FormControl>
                            </Grid2>

                            {/* PROYECTO */}
                            <Grid2 size={{ xs: 12, md: 12 }} sx={{ mt: 2 }}>
                                <div style={{ position: 'relative' }}>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: -16, // Ajusta según tu diseño
                                            right: 0,
                                            background: '#1976d2',
                                            color: '#fff',
                                            borderRadius: '12px',
                                            padding: '2px 8px',
                                            fontSize: 12,
                                            fontWeight: 500,
                                            pointerEvents: 'none',
                                            zIndex: 2,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        {(data?.proyecto || "").length}/{maxLengthProyecto}
                                    </span>
                                    <TextField
                                        label="Proyecto"
                                        name="proyecto"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        required
                                        multiline
                                        minRows={1}
                                        maxRows={1}
                                        value={registroEditado.proyecto || ""}
                                        //error={errors.proyecto}
                                        //helperText={errors.proyecto ? "Requerido" : ""}
                                        onChange={e => handleRowChange("proyecto", e.target.value)}
                                    // slotProps={{
                                    //     htmlInput: { maxLength: maxLengthProyecto },
                                    //     style: { overflowY: 'hidden' }
                                    // }}
                                    />
                                </div>
                            </Grid2>

                            {/* ACTIVIDAD y HORA */}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', marginTop: '20px' }}>
                                {/* ACTIVIDAD */}
                                <Grid2 size={{ xs: 12, md: 8 }}>
                                    <FormControl variant="outlined" size="small" fullWidth required>

                                        <Autocomplete
                                            options={dataSource.actividades}
                                            getOptionLabel={option => option.nombre || ""}
                                            isOptionEqualToValue={(option, value) => option.actividadId === value.actividadId}
                                            value={dataSource.actividades.find(c => c.actividadId === registroEditado.actividadId) || null}
                                            onChange={(_, newValue) =>
                                                handleRowChange("actividadId", newValue ? newValue.actividadId : "")
                                            }
                                            renderOption={(props, option, { index }) => (
                                                <li {...props} key={`${option.actividadId}-${index}`}>
                                                    {option.nombre}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Actividad"
                                                    size="small"
                                                    required
                                                    variant="outlined"
                                                //error={errors.actividad}
                                                //helperText={errors.actividad ? "Requerido" : ""}
                                                />
                                            )}
                                            noOptionsText="Sin resultados"
                                            fullWidth
                                        />
                                    </FormControl>
                                </Grid2>

                                {/* HORA */}
                                <Grid2 size={{ xs: 12, md: 4 }}>
                                    <FormControl
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{ minWidth: 90 }}
                                        required
                                    >
                                        <Autocomplete
                                            options={horasPermitidas}
                                            getOptionLabel={option => option.nombre}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={horasPermitidas.find(h => h.id === registroEditado.horas) || null}
                                            onChange={(_, newValue) =>
                                                handleRowChange("horas", newValue ? newValue.id : "")
                                            }
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.nombre}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Horas"
                                                    size="small"
                                                    required
                                                    variant="outlined"
                                                    //error={errors.horas}
                                                    //helperText={errors.horas ? "Requerido" : ""}
                                                    slotProps={{
                                                        //htmlInput: { maxLength: 2 },
                                                    }}
                                                />
                                            )}
                                            noOptionsText="Sin resultados"
                                            fullWidth
                                        />
                                    </FormControl>
                                </Grid2>
                            </div>

                        </Grid2>
                    </>
                ) : (
                    <Typography>No hay datos para mostrar.</Typography>
                )}
            </DialogContent>

            <Divider sx={{ my: 1 }} />

            <DialogActions sx={{ mb: 1 }}>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={() => onGuardar(registroEditado)} color="primary" variant="contained">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogEditarRegistroPivote;