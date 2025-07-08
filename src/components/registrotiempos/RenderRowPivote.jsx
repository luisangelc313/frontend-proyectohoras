import {
    TextField,
    FormControl,
    Grid2,
    Tooltip,
    IconButton,
    Autocomplete
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const RenderRowPivote = ({
    row,
    index,
    clientes,
    soluciones,
    actividades,
    handleRowChange,
    handleRemoveRow,
    usuarioSesion }) => {

    const maxHoras = Number(usuarioSesion?.usuarioConfig?.horasPermitidasPorDia) || 0;
    const horasPermitidas = Array.from({ length: maxHoras }, (_, i) => ({
        id: i + 1,
        nombre: String(i + 1)
    }));

    const maxLengthProyecto = 1000;

    return (
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {/* Cliente */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    {/* <InputLabel id={`cliente-label${index}`}>Cliente</InputLabel> */}
                    <Tooltip
                        title={
                            row.cliente
                                ? (
                                    (clientes.find(c => c.clienteId === row.cliente)?.nombre?.length > 9)
                                        ? clientes.find(c => c.clienteId === row.cliente)?.nombre
                                        : ""
                                )
                                : ""
                        }
                        disableHoverListener={
                            !row.cliente ||
                            !(clientes.find(c => c.clienteId === row.cliente)?.nombre?.length > 9)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={clientes}
                            getOptionLabel={option => option.nombre || ""}
                            isOptionEqualToValue={(option, value) => option.clienteId === value.clienteId}
                            value={clientes.find(c => c.clienteId === row.cliente) || null}
                            onChange={(_, newValue) =>
                                handleRowChange(index, "cliente", newValue ? newValue.clienteId : "")
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
                                />
                            )}
                            noOptionsText="Sin resultados"
                            fullWidth
                        />
                    </Tooltip>
                </FormControl>
            </Grid2>

            {/* Solución */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    {/* <InputLabel id={`solucion-label${index}`}>Solución</InputLabel> */}
                    <Tooltip
                        title={
                            row.solucion
                                ? (
                                    (soluciones.find(c => c.solucionId === row.solucion)?.nombre?.length > 9)
                                        ? soluciones.find(c => c.solucionId === row.solucion)?.nombre
                                        : ""
                                )
                                : ""
                        }
                        disableHoverListener={
                            !row.solucion ||
                            !(soluciones.find(c => c.solucionId === row.solucion)?.nombre?.length > 9)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={soluciones}
                            getOptionLabel={option => option.nombre || ""}
                            isOptionEqualToValue={(option, value) => option.solucionId === value.solucionId}
                            value={soluciones.find(c => c.solucionId === row.solucion) || null}
                            onChange={(_, newValue) =>
                                handleRowChange(index, "solucion", newValue ? newValue.solucionId : "")
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
                                />
                            )}
                            noOptionsText="Sin resultados"
                            fullWidth
                        />
                    </Tooltip>
                </FormControl>
            </Grid2>

            {/* Proyecto */}
            <Grid2 size={{ xs: 12, md: 4 }}>
                <div style={{ position: 'relative' }}>
                    <span
                        style={{
                            position: 'absolute',
                            top: -18, // Ajusta según tu diseño
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
                        {(row.proyecto || "").length}/{maxLengthProyecto}
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
                        value={row.proyecto || ""}
                        onChange={e => handleRowChange(index, "proyecto", e.target.value)}
                        slotProps={{
                            htmlInput: { maxLength: maxLengthProyecto },
                            style: { overflowY: 'hidden' }
                        }}
                    />
                </div>
            </Grid2>

            {/* Actividad */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    {/* <InputLabel id={`actividad-label${index}`}>Actividad</InputLabel> */}
                    <Tooltip
                        title={
                            row.actividad
                                ? (
                                    (actividades.find(c => c.actividadId === row.actividad)?.nombre?.length > 9)
                                        ? actividades.find(c => c.actividadId === row.actividad)?.nombre
                                        : ""
                                )
                                : ""
                        }
                        disableHoverListener={
                            !row.actividad ||
                            !(actividades.find(c => c.actividadId === row.actividad)?.nombre?.length > 9)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={actividades}
                            getOptionLabel={option => option.nombre || ""}
                            isOptionEqualToValue={(option, value) => option.actividadId === value.actividadId}
                            value={actividades.find(c => c.actividadId === row.actividad) || null}
                            onChange={(_, newValue) =>
                                handleRowChange(index, "actividad", newValue ? newValue.actividadId : "")
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
                                />
                            )}
                            noOptionsText="Sin resultados"
                            fullWidth
                        />
                    </Tooltip>
                </FormControl>
            </Grid2>

            {/* Horas */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                            value={horasPermitidas.find(h => h.id === row.horas) || null}
                            onChange={(_, newValue) =>
                                handleRowChange(index, "horas", newValue ? newValue.id : "")
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
                                    slotProps={{
                                        //htmlInput: { maxLength: 2 },
                                    }}
                                />
                            )}
                            noOptionsText="Sin resultados"
                            fullWidth
                        />
                    </FormControl>

                    {/* Botón "Eliminar renglón" */}
                    <Tooltip title="Eliminar renglón">
                        <IconButton
                            color="error"
                            onClick={() => handleRemoveRow(index)}
                            size="small"
                            sx={{ ml: 1 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Grid2>

        </Grid2 >
    );
};

export default RenderRowPivote;