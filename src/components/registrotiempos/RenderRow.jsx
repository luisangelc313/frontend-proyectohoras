import {
    TextField,
    FormControl,
    Grid2,
    Tooltip,
    IconButton,
    Autocomplete
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const RenderRow = ({
    row,
    index,
    clientes,
    soluciones,
    actividades,
    handleRowChange,
    handleRemoveRow,
    errors = {}
}) => {

    const mesesDelAnio = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        nombre: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase()//.replace(/^\w/, c => c.toUpperCase())
    }));

    return (
        <Grid2 container spacing={1} sx={{ mt: 2 }}>
            {/* MES */}
            <Grid2 size={{ xs: 6, md: 1 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    <Tooltip
                        title={row.mes
                            ? (mesesDelAnio.find(m => m.id === row.mes)?.nombre || "")
                            : ""}
                        disableHoverListener={
                            !row.mes ||
                            !(mesesDelAnio.find(m => m.id === row.mes)?.nombre?.length > 4)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={mesesDelAnio}
                            getOptionLabel={option => option.nombre}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={mesesDelAnio.find(m => m.id === row.mes) || null}
                            onChange={(_, newValue) =>
                                handleRowChange(index, "mes", newValue ? newValue.id : "")
                            }
                            renderOption={(props, option, { index }) => (
                                <li {...props} key={`${option.id}-${index}`}>
                                    {option.nombre}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Mes"
                                    size="small"
                                    error={errors.mes}
                                    helperText={errors.mes ? "Campo requerido" : ""}
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

            {/* Cliente */}
            <Grid2 size={{ xs: 6, md: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    {/* <InputLabel id={`cliente-label${index}`}>Cliente</InputLabel> */}
                    <Tooltip
                        title={
                            row.cliente
                                ? (
                                    (clientes.find(c => c.clienteId === row.cliente)?.nombre?.length > 15)
                                        ? clientes.find(c => c.clienteId === row.cliente)?.nombre
                                        : ""
                                )
                                : ""
                        }
                        disableHoverListener={
                            !row.cliente ||
                            !(clientes.find(c => c.clienteId === row.cliente)?.nombre?.length > 15)
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
                                    error={errors.cliente}
                                    helperText={errors.cliente ? "Campo requerido" : ""}
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
            <Grid2 size={{ xs: 6, md: 2, lg: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    {/* <InputLabel id={`solucion-label${index}`}>Solución</InputLabel> */}
                    <Tooltip
                        title={
                            row.solucion
                                ? (
                                    (soluciones.find(c => c.solucionId === row.solucion)?.nombre?.length > 15)
                                        ? soluciones.find(c => c.solucionId === row.solucion)?.nombre
                                        : ""
                                )
                                : ""
                        }
                        disableHoverListener={
                            !row.solucion ||
                            !(soluciones.find(c => c.solucionId === row.solucion)?.nombre?.length > 15)
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
                                    error={errors.solucion}
                                    helperText={errors.solucion ? "Campo requerido" : ""}
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
            <Grid2 size={{ xs: 12, md: 4, lg: 4 }}>
                <TextField
                    label="Proyecto"
                    name="proyecto"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    multiline
                    error={errors.proyecto}
                    helperText={errors.proyecto ? "Campo requerido" : ""}
                    minRows={1}
                    maxRows={1}
                    value={row.proyecto || ""}
                    onChange={e => handleRowChange(index, "proyecto", e.target.value)}
                    slotProps={{
                        htmlInput: { maxLength: 1000 },
                        style: { overflowY: 'hidden' }
                    }}
                />
            </Grid2>

            {/* Actividad */}
            <Grid2 size={{ xs: 6, md: 2, lg: 2 }}>
                <FormControl variant="outlined" size="small" fullWidth required>
                    {/* <InputLabel id={`actividad-label${index}`}>Actividad</InputLabel> */}
                    <Tooltip
                        title={
                            row.actividad
                                ? (
                                    (actividades.find(c => c.actividadId === row.actividad)?.nombre?.length > 17)
                                        ? actividades.find(c => c.actividadId === row.actividad)?.nombre
                                        : ""
                                )
                                : ""
                        }
                        disableHoverListener={
                            !row.actividad ||
                            !(actividades.find(c => c.actividadId === row.actividad)?.nombre?.length > 17)
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
                                    error={errors.actividad}
                                    helperText={errors.actividad ? "Campo requerido" : ""}
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
            <Grid2 size={{ xs: 6, md: 1, lg: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ minWidth: 90 }}
                        required
                    >
                        <TextField
                            label="Horas"
                            size="small"
                            required
                            variant="outlined"
                            error={errors.horas}
                            helperText={errors.horas ? "Campo requerido" : ""}
                            value={row.horas || ""}
                            onChange={e => {
                                // Solo permite números, máximo 3 dígitos, y elimina ceros a la izquierda
                                let val = e.target.value.replace(/\D/g, '').slice(0, 3);
                                if (val.length > 1) val = val.replace(/^0+/, '');
                                // Solo acepta números válidos (mayor o igual a 1)
                                if (val === "" || (Number(val) >= 1 && Number(val) <= 999)) {
                                    handleRowChange(index, "horas", val === "" ? "" : Number(val));
                                }
                            }}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                maxLength: 3
                            }}
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

export default RenderRow;