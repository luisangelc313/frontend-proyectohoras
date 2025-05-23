import {
    TextField,
    FormControl,
    Grid2,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

const RenderRow = ({ row, index, clientes, soluciones, actividades, horas, handleRowChange }) => {
    return (
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {/* Cliente */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    <InputLabel id={`cliente-label${index}`}>Cliente</InputLabel>
                    <Select
                        labelId={`cliente-label${index}`}
                        id="cliente"
                        name="clienteId"
                        required
                        label="Cliente"
                        value={row.cliente || ""}
                        onChange={e => handleRowChange(index, "cliente", e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Ninguno</em>
                        </MenuItem>
                        {clientes.map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>

            {/* Solución */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    <InputLabel id={`solucion-label${index}`}>Solución</InputLabel>
                    <Select
                        labelId={`solucion-label${index}`}
                        id="solucion"
                        name="solucionId"
                        required
                        value={row.solucion || ""}
                        label="Solución"
                        onChange={e => handleRowChange(index, "solucion", e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Ninguno</em>
                        </MenuItem>
                        {soluciones.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>

            {/* Proyecto */}
            <Grid2 size={{ xs: 12, md: 4 }}>
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
                    slotProps={{
                        htmlInput: { maxLength: 1000 },
                        style: { overflowY: 'hidden' }
                    }}
                />
            </Grid2>

            {/* Actividad */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    <InputLabel id={`actividad-label${index}`}>Actividad</InputLabel>
                    <Select
                        labelId={`actividad-label${index}`}
                        id="actividad"
                        name="actividadId"
                        required
                        label="Actividad"
                        value={row.actividad || ""}
                        onChange={e => handleRowChange(index, "actividad", e.target.value)}
                    >
                        {actividades.map(a => (
                            <MenuItem key={a} value={a}>{a}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>

            {/* Horas */}
            <Grid2 size={{ xs: 6, md: 1 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    <InputLabel id={`horas-label${index}`}>Horas</InputLabel>
                    <Select
                        labelId="actividad-label"
                        id={`horas-label${index}`}
                        name="horasValor"
                        required
                        label="Horas"
                        value={row.horas || ""}
                        onChange={e => handleRowChange(index, "horas", e.target.value)}
                    >
                        {horas.map(h => (
                            <MenuItem key={h} value={h}>{h}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>

        </Grid2>
    );
};

export default RenderRow;