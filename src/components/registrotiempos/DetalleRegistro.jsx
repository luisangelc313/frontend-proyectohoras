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
import { useStateValue } from "../../context/store";


const DetalleRegistro = ({
  listadoClientes,
  listadoSoluciones,
  listadoActividades,
  usuarioSesion
}) => {
  //Estado para los renglones dinámicos
  const [rows, setRows] = useState([]); // Empieza con un renglón vacío

  //const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [, dispatch] = useStateValue();

  useEffect(() => {
    console.log("usuarioSesion", usuarioSesion)
  }, [usuarioSesion]);

  const handleClickAggNuevoRenglon = e => {
    e.preventDefault();
    setRows([...rows, { id: Date.now() }]);
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    // Si showErrors está activo, lo desactivamos al editar cualquier campo
    //if (showErrors) setShowErrors(false);

    // Elimina el error solo de ese campo/renglón
    if (fieldErrors[index]?.[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        if (updated[index]) {
          updated[index] = { ...updated[index], [field]: false };
        }
        return updated;
      });
    }
  };

  const handleRemoveRow = (index) => {
    setRows(rows => rows.filter((_, idx) => idx !== index));
  };

  // Campos obligatorios
  const camposObligatorios = ["mes", "cliente", "solucion", "proyecto", "actividad", "horas"];

  // const getRowErrors = (row) => {
  //   const errors = {};
  //   camposObligatorios.forEach(campo => {
  //     errors[campo] = !row[campo] || row[campo] === "";
  //   });
  //   return errors;
  // };

  // Este evento se ejecuta cuando se Guarda la Información.
  const handleGuardarRegistros = e => {
    e.preventDefault();

    if (!rows || rows.length === 0) return;

    let newFieldErrors = {};
    let hasError = false;

    rows.forEach((row, rowIdx) => {
      camposObligatorios.forEach(campo => {
        if (!row[campo] || row[campo] === "") {
          hasError = true;
          if (!newFieldErrors[rowIdx]) newFieldErrors[rowIdx] = {};
          newFieldErrors[rowIdx][campo] = true;
        }
      });
    });

    setFieldErrors(newFieldErrors);

    // Buscar si algún renglón tiene un campo obligatorio vacío
    // const renglonIncompleto = rows.some(row =>
    //   camposObligatorios.some(campo => !row[campo] || row[campo] === "")
    // );

    if (hasError) {
      //setShowErrors(true); // <-- Mostrar errores
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Debe capturar los campos que son obligatorios.",
          severity: "warning",
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }

    //setShowErrors(false); // <-- Ocultar errores si todo está bien
    setFieldErrors({});

    // try {
    // } catch (error) {
    // } finally {
    // }

  };

  const meses = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    nombre: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase(),//.replace(/^\w/, c => c.toUpperCase())
    hora: 0
  }));


  return (
    <>
      <Box>
        <Typography variant="h6">
          Registro de Horas por Proyecto{" "}
        </Typography>
        <Typography variant="h6" gutterBottom>
          <span
            style={{
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "Arial",
              captionSide: "bottom",
              marginRight: 5,
            }}>Usuario: </span>
          {usuarioSesion && usuarioSesion.username}
        </Typography>

      </Box>
      <Divider sx={{ my: 3 }} />
      {/* Renglón de captura */}

      <form style={style.form}>
        {rows.map((row, idx) => (
          <RenderRow
            key={row.id || idx}
            index={idx}
            row={row}
            clientes={listadoClientes}
            soluciones={listadoSoluciones}
            actividades={listadoActividades}
            handleRowChange={handleRowChange}
            handleRemoveRow={handleRemoveRow}
            //errors={showErrors ? getRowErrors(row) : {}} // <--- Solo muestra errores si showErrors es true
            errors={fieldErrors[idx] || {}} // <-- errores solo para ese renglón
          //usuarioSesion={usuarioSesion}
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
        {rows.length > 0 && (
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
        )}
        <Divider sx={{ my: 2 }} />
      </form>

      {/* Resumen de horas */}
      <Grid2 container spacing={1} sx={{ mt: 2 }}>
        <Grid2 size={{ xs: 6, md: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resumen
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 5 }}>
          <Typography variant="body1" gutterBottom>
            Cuenta de Horas
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 5 }}></Grid2>
      </Grid2>

      <Grid2 container spacing={1} sx={{ mt: 2 }}>
        <Grid2 size={{ xs: 6, md: 2 }}>
          <Typography variant="h6" gutterBottom>
            <span
              style={{
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "Arial",
                captionSide: "bottom",
                marginRight: 5,
              }}>Total General: </span>
            {0}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 6, md: 10 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            {meses.map((mes, idx) => (
              <Typography
                key={mes.id}
                variant="body1"
                gutterBottom
                sx={{ display: 'inline-block', marginLeft: idx === 0 ? 0 : 2 }}
              >
                {mes.nombre}: <b>{mes.hora ?? 0}</b>,
              </Typography>
            ))}
          </div>
        </Grid2>

      </Grid2>

    </>
  )
}

export default DetalleRegistro;