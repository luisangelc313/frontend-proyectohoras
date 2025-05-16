import { useState } from "react";

import {
  Box,
  Divider,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material"

//import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import 'dayjs/locale/es';
import dayjs from 'dayjs';

import style from "../Tool/style";

dayjs.locale('es'); // Configurar el idioma español

const ListadoRegistro = () => {

  const [porRango, setPorRango] = useState('');
  const handleChange = (event) => {
    setPorRango(event.target.value);
  };
  // Mapeo del valor al texto correspondiente
  const obtenerTextoSeleccionado = () => {
    switch (porRango) {
      case 20:
        return "Rango de Fechas";
      case 21:
        return "Fecha única";
      default:
        return "Ninguna";
    }
  };

  return (
    <div style={style.table}>
      <Typography component="h1" variant="h5">
        Registro de Tiempos
      </Typography>

      <Divider sx={{ my: 1 }} />

      <Grid2 container style={style.tableGridContainer}>
        <Grid2 size={{ xs: 6, sm: 7, md: 2 }}>
          <Typography variant="body1" color="textSecondary" sx={{ pt: 2 }}>
            Filtro de búsqueda por fecha
          </Typography>
        </Grid2>
        <Box sx={{ width: 250 }}>
          <FormControl fullWidth>
            <InputLabel id="lblFiltros">{obtenerTextoSeleccionado()}</InputLabel>
            <Select
              labelId="lblFiltros"
              id="lblFiltros"
              value={porRango}
              onChange={handleChange}
              autoWidth
              label={obtenerTextoSeleccionado()}
            >
              <MenuItem value="">
                <em>Ninguna</em>
              </MenuItem>
              <MenuItem value={20}>Rango de Fechas</MenuItem>
              <MenuItem value={21}>Fecha unica</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
          >
            <DatePicker
              label="Ingrese fecha de registro a buscar"
              value={null}
              //onChange={handleChangeFechaBusqueda}
              maxDate={dayjs()}
              slotProps={{ textField: { fullWidth: true } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                />
              )}
            />
          </LocalizationProvider> */}
      </Grid2>

    </div>
  )
}

export default ListadoRegistro