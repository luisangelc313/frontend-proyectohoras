import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid2,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Cancel from '@mui/icons-material/Cancel';
import ClearAll from '@mui/icons-material/ClearAll';
import SaveIcon from '@mui/icons-material/Save';

import style from "../Tool/style";
import RenderRow from './RenderRow';

//const clientes = ['COLGATE', 'SAINT GOBAIN'];
//const soluciones = ['CONNECTOR', 'EREQ'];
//const actividades = ['DESARROLLO', 'BUG', 'MANTENIMIENTO', 'OTROS'];
//const horas = [1, 2, 3, 4, 5, 6, 7, 8];

const DetalleRegistro = ({
  fecha,
  listadoClientes,
  listadoSoluciones,
  listadoActividades,
  usuarioSesion
}) => {
  //Estado para los renglones dinámicos
  const [rows, setRows] = useState([]); // Empieza con un renglón vacío

  // Cuando cambia la fecha seleccionada, simula una petición a la API
  useEffect(() => {
    if (fecha && rows.length === 0) {
      setRows([{ id: Date.now() }]);
    }
    if (!fecha) {
      setRows([]);
    }
  }, [fecha, rows.length]);

  //const [temporalRows, setTemporalRows] = useState([]);
  //const [savedRows, setSavedRows] = useState([]);

  const handleClickAggNuevoRenglon = e => {
    e.preventDefault();
    setRows([...rows, { id: Date.now() }]);
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleRemoveRow = (index) => {
    setRows(rows => rows.filter((_, idx) => idx !== index));
  };

  // Este evento se ejecuta cuando se Guarda la Información.
  const handleGuardarRegistros = e => {
    e.preventDefault();
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

        {/* {fecha && console.log("Fecha Seleccionada:", fecha)} */}

      </Box>
      <Divider sx={{ my: 3 }} />
      {/* Renglón de captura */}
      {fecha && (
        <form style={style.form}>
          {rows.map((row, idx) => (
            <RenderRow
              key={row.id}
              index={idx}
              row={row}
              clientes={listadoClientes}
              soluciones={listadoSoluciones}
              actividades={listadoActividades}
              handleRowChange={handleRowChange}
              handleRemoveRow={handleRemoveRow}
              usuarioSesion={usuarioSesion}
            />
          ))}

          {/* Botón "Nuevo renglón" */}
          <Grid2 container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid2>
              <Tooltip title="Agregar Nuevo Renglón">
                <IconButton color="primary" onClick={handleClickAggNuevoRenglon}>
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            </Grid2>
          </Grid2>

          {/* ...botones de acción...
              sección de botones (Cancelar, Limpiar, Guardar) 
           */}
          <Grid2
            container
            spacing={0}
            sx={{ marginTop: 2 }}
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
      )}
    </>
  )
}

export default DetalleRegistro;