import {
    Autocomplete,
    Divider,
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip
} from "@mui/material";
import { useState } from "react";


const FiltrosExportacion = ({
    clientes,
    soluciones,
    actividades,
}) => {

    const arrTipoFiltros = [
        { value: 1, text: "Todos" },
        { value: 2, text: "Agregar filtrado" }
    ];
    const [valorFiltro, setValorFiltro] = useState("");

    const handleChangeParametrosFiltro = e => {
        setValorFiltro(e.target.value);
        console.log("Valor del filtro seleccionado:", e.target.value);
    };


    const [mesSeleccionado, setMesSeleccionado] = useState(""); // Estado para el mes
    const [meses] = useState(
        Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            nombre: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase(),//.replace(/^\w/, c => c.toUpperCase())
            hora: 0
        }))
    );
    const handleChangeMes = e => {
        setMesSeleccionado(e.target.value);
    }

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [solucionSeleccionado, setSolucionSeleccionado] = useState(null);
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);


    return (
        <>
            <Grid2 container>
                {/* Seleccione Opción */}
                <Grid2 size={{ xs: 6, md: 6 }}>
                    <FormControl fullWidth sx={{ mt: 1 }} size="small">
                        <InputLabel id="lblParametrosFiltro">Seleccione opción</InputLabel>
                        <Select
                            labelId="lblParametrosFiltro"
                            id="parametrosFiltro"
                            value={valorFiltro}
                            name="parametrosFiltro"
                            label="Seleccione opción"
                            onChange={handleChangeParametrosFiltro}
                        >
                            <MenuItem value="">
                                <em>Seleccione opción</em>
                            </MenuItem>
                            {Array.isArray(arrTipoFiltros) &&
                                arrTipoFiltros.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Divider sx={{ my: 2 }} />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 6 }}></Grid2>


                {/* Cliente */}
                <Grid2 size={{ xs: 6, md: 6 }}>
                    <Tooltip
                        title={
                            clienteSeleccionado && clienteSeleccionado.nombre && clienteSeleccionado.nombre.length > 16
                                ? clienteSeleccionado.nombre
                                : ""
                        }
                        disableHoverListener={
                            !clienteSeleccionado ||
                            !(clienteSeleccionado.nombre && clienteSeleccionado.nombre.length > 16)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={clientes}
                            getOptionLabel={option => option.nombre || ""}
                            //getOptionLabel={option => option.nombre ? `${option.nombre} (${option.clienteId.slice(0, 6)})` : ""}
                            isOptionEqualToValue={(option, value) => option.clienteId === value.clienteId}
                            value={clienteSeleccionado}
                            onChange={(_, newValue) => {
                                setClienteSeleccionado(newValue);
                                console.log("Cliente seleccionado:", newValue);
                            }}
                            renderOption={(props, option) => (
                                // con renderOption se evitar que marque error si se repite el nombre de Cliente.
                                <li {...props} key={option.clienteId}>
                                    {option.nombre}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cliente"
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            noOptionsText="Sin resultados"
                        />
                    </Tooltip>
                </Grid2>


                {/* MES */}
                <Grid2 size={{ xs: 6, md: 6 }} sx={{ pl: 2 }}>
                    <FormControl fullWidth sx={{ mt: 0 }} size="small">
                        <InputLabel id="lblMes">Mes</InputLabel>
                        <Select
                            labelId="lblMes"
                            id="mes"
                            value={mesSeleccionado}
                            name="Mes"
                            label="Solución"
                            onChange={handleChangeMes}
                        >
                            <MenuItem value="">
                                <em>Seleccione mes</em>
                            </MenuItem>
                            {meses.map((mes) => (
                                <MenuItem key={mes.id} value={mes.id}>{mes.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>


                {/* Solución */}
                <Grid2 size={{ xs: 6, md: 6 }} sx={{ mt: 2, pl: 0 }}>
                    <Tooltip
                        title={
                            solucionSeleccionado && solucionSeleccionado.nombre && solucionSeleccionado.nombre.length > 16
                                ? solucionSeleccionado.nombre
                                : ""
                        }
                        disableHoverListener={
                            !solucionSeleccionado ||
                            !(solucionSeleccionado.nombre && solucionSeleccionado.nombre.length > 16)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={soluciones}
                            getOptionLabel={option => option.nombre || ""}
                            isOptionEqualToValue={(option, value) => option.solucionId === value.solucionId}
                            value={solucionSeleccionado}
                            onChange={(_, newValue) => {
                                setSolucionSeleccionado(newValue);
                                console.log("Solución seleccionada:", newValue);
                            }}
                            renderOption={(props, option) => (
                                // con renderOption se evitar que marque error si se repite el nombre de Cliente.
                                <li {...props} key={option.solucionId}>
                                    {option.nombre}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Solución"
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            noOptionsText="Sin resultados"
                        />
                    </Tooltip>
                </Grid2>


                {/* Actividad */}
                <Grid2 size={{ xs: 6, md: 6 }} sx={{ mt: 2, pl: 2 }}>
                    <Tooltip
                        title={
                            actividadSeleccionada && actividadSeleccionada.nombre && actividadSeleccionada.nombre.length > 16
                                ? actividadSeleccionada.nombre
                                : ""
                        }
                        disableHoverListener={
                            !actividadSeleccionada ||
                            !(actividadSeleccionada.nombre && actividadSeleccionada.nombre.length > 16)
                        }
                        arrow
                        placement="top"
                    >
                        <Autocomplete
                            options={actividades}
                            getOptionLabel={option => option.nombre || ""}
                            isOptionEqualToValue={(option, value) => option.actividadId === value.actividadId}
                            value={actividadSeleccionada}
                            onChange={(_, newValue) => {
                                setActividadSeleccionada(newValue);
                                console.log("Actividad seleccionada:", newValue);
                            }}
                            renderOption={(props, option) => (
                                // con renderOption se evitar que marque error si se repite el nombre de Cliente.
                                <li {...props} key={option.actividadId}>
                                    {option.nombre}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Actividad"
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            noOptionsText="Sin resultados"
                        />
                    </Tooltip>
                </Grid2>


            </Grid2>
        </>
    )
}

export default FiltrosExportacion;