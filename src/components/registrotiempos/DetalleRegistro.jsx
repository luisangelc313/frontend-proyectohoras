import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Cancel from '@mui/icons-material/Cancel';
import ClearAll from '@mui/icons-material/ClearAll';
import SaveIcon from '@mui/icons-material/Save';

import style from "../Tool/style";

const clientes = ['COLGATE', 'SAINT GOBAIN'];
const soluciones = ['CONNECTOR', 'EREQ'];
const actividades = ['DESARROLLO', 'BUG', 'MANTENIMIENTO', 'OTROS'];
const horas = [1, 2, 3, 4, 5, 6, 7, 8];

const DetalleRegistro = ({ fecha }) => {
  //Estado para los renglones dinámicos
  const [rows, setRows] = useState([{}]); // Empieza con un renglón vacío

  // Cuando cambia la fecha seleccionada, simula una petición a la API
  useEffect(() => {
    if (fecha) {
      console.log("Fecha:", fecha);
    } else {
      console.log("Sin fecha");
    }
  }, [fecha]);

  const [temporalRows, setTemporalRows] = useState([]);
  const [savedRows, setSavedRows] = useState([]);

  const handleClickAggNuevoRenglon = e => {
    e.preventDefault();
    setRows([...rows, {}]);
  };


  const handleGuardarRegistros = e => {
    e.preventDefault();
    setSavedRows([...savedRows, ...temporalRows]);
    setTemporalRows([]);
  };


  return (
    <>
      <Box>
        <Typography variant="h6">
          Registro de Horas por Proyecto{" "}
        </Typography>
        {fecha && (
          <span
            style={{
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "Arial",
              captionSide: "bottom",
            }}
          >
            {
              // Capitaliza Día y Mes
              fecha.locale("es").format("dddd, DD [de] MMMM [de] YYYY")
                .replace(
                  /^([a-záéíóúñ]+), (\d{2} [a-z ]+ )([a-záéíóúñ]+)( de \d{4})$/i,
                  (match, dia, diaNum, mes, resto) =>
                    `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${diaNum}${mes.charAt(0).toUpperCase() + mes.slice(1)}${resto}`
                )
            }
          </span>
        )}

        {fecha && (
          <Typography variant="h6" gutterBottom>
            <span
              style={{
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "Arial",
                captionSide: "bottom",
                marginRight: 5,
              }}>Horas Capturas: </span>
            0
          </Typography>
        )}

        {fecha && console.log("Fecha Seleccionada:", fecha)}

      </Box>
      <Divider sx={{ my: 3 }} />
      {/* Renglón de captura */}
      <form style={style.form}>
        <Grid2 container spacing={2} sx={{ mt: 4 }}>
          {/* Cliente */}
          <Grid2 size={{ xs: 6, md: 2 }}>
            <FormControl variant="outlined" size="small" fullWidth required>
              <InputLabel id="cliente-label">Cliente</InputLabel>
              <Select
                labelId="cliente-label"
                id="cliente"
                name="clienteId"
                required
                label="Cliente"
              //value={}
              //onChange={handleChangeCliente}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {clientes.map(c =>
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid2>

          {/* Solución */}
          <Grid2 size={{ xs: 6, md: 2 }}>
            <FormControl variant="outlined" size="small" fullWidth required>
              <InputLabel id="solucion-label">Solución</InputLabel>
              <Select
                labelId="solucion-label"
                id="solucion"
                name="solucionId"
                required
                label="Solucion"
              //sx={{ fontSize: 15 }}
              //value={}
              //onChange={handleChangeCliente}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {soluciones.map(c =>
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                )}
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
              <InputLabel id="actividad-label">Actividad</InputLabel>
              <Select
                labelId="actividad-label"
                id="actividad"
                name="actividadId"
                required
                label="Actividad"
              //sx={{ fontSize: 15 }}
              //value={}
              //onChange={handleChangeCliente}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {actividades.map(c =>
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid2>

          {/* Hora */}
          <Grid2 size={{ xs: 6, md: 1 }}>
            <FormControl variant="outlined" size="small" fullWidth required>
              <InputLabel id="horas-label">Horas</InputLabel>
              <Select
                labelId="actividad-label"
                id="horas"
                name="horasValor"
                required
                label="Horas"
              //value={}
              //onChange={handleChangeCliente}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {horas.map(c =>
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid2>

          {/* Nuevo renglón */}
          <Grid2 size={{ xs: 6, md: 1 }}>
            <Tooltip title="Agregar Nuevo Renglón">
              <IconButton color="primary" onClick={handleClickAggNuevoRenglon}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Grid2>
        </Grid2>

        {/* sección de botones (Cancelar, Limpiar, Guardar) */}
        <Grid2
          container
          spacing={0}
          sx={{ marginTop: 5 }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid2>
            <Button
              type="button"
              variant="contained"
              color="error"
              size="medium"
              sx={{ mx: 2 }}
              //onClick={handleOpenDialogCancelar}
              style={style.submit}
              startIcon={<Cancel />}
            >
              Cancelar
            </Button>
          </Grid2>
          <Grid2>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              size="medium"
              sx={{ mx: 2 }}
              //onClick={handleLimpiarFormulario}
              style={style.submit}
              startIcon={<ClearAll />}
            >
              Limpiar
            </Button>
          </Grid2>
          <Grid2>
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="medium"
              sx={{ mx: 2 }}
              style={style.submit}
              onClick={handleGuardarRegistros}
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
          </Grid2>
        </Grid2>
        <Divider sx={{ my: 2 }} />
      </form>
    </>
  )
}

export default DetalleRegistro;