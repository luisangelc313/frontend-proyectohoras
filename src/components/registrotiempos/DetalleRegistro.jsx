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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CircularProgress from "@mui/material/CircularProgress";

import style from "../Tool/style";
import { HttpStatus } from "../../utils/HttpStatus";
import RenderRow from './RenderRow';
import { useStateValue } from "../../context/store";
import {
  guardarTiemposProyectoAction,
  obtenerRegistrosPaginadoAction,
} from "../../actions/RegistroTiemposAction";
import TblRegistrosTiemposPorProyecto from "./TblRegistrosTiemposPorProyecto";


const DetalleRegistro = ({
  listadoClientes,
  listadoSoluciones,
  listadoActividades,
  usuarioSesion
}) => {
  //Estado para los renglones dinámicos
  const [rows, setRows] = useState([]); // Empieza con un renglón vacío

  const meses = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    nombre: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase(),//.replace(/^\w/, c => c.toUpperCase())
    hora: 0
  }));

  //const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingTiemposPorProyecto, setLoadingTiemposPorProyecto] = useState(false);
  const [{ sesionUsuario }, dispatch] = useStateValue();

  // Variables para almacenar los datos de la API Registros Tiempos por Proyecto
  const [registrosTiemposPorProyecto, setRegistrosTiemposPorProyecto] = useState([]);

  useEffect(() => {

    const obtenerRegistrosTiemposPorProyecto = async () => {
      setLoadingTiemposPorProyecto(true);
      const msgError = "Ocurrió un error al obtener los registros de tiempos por proyecto.";

      try {
        const usuario = sesionUsuario?.usuario;
        const payload = {
          usuarioId: usuario?.usuarioId || "",
          numeroPagina: 1,
          cantidadElementos: 10,
          descripcion: "",
          solucionId: null,
          clienteId: null,
          actividadId: null,
          fechaInicio: null,
          fechaFin: null
        };

        const response = await obtenerRegistrosPaginadoAction(payload);

        if (response && response.data && response.status === 200 && response.statusText === "OK") {

          if (response.data && response.data.length > 0) {
            setRegistrosTiemposPorProyecto(response.data.map(item => ({
              registroId: item.registroId,
              mes: meses.find(m => m.id === item.mes)?.nombre || item.mes,
              cliente: item.cliente.nombre,
              solucion: item.solucion.nombre,
              proyecto: item.descripcion,
              actividad: item.actividad.nombre,
              horas: item.horas
            })));
          }

        } else {
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje: msgError,
              severity: "error",
            },
          });

        }

      } catch (error) {
        console.log("Error Catch", error)
        const errorMessage = error?.data?.errors?.msg || msgError;
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: errorMessage,
            severity: "error",
          },
        });

      } finally {
        setLoadingTiemposPorProyecto(false);
      }
    }

    obtenerRegistrosTiemposPorProyecto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionUsuario]);

  const handleClickAggNuevoRenglon = e => {
    e.preventDefault();
    //setRows([...rows, { id: Date.now() }]);
    setRows([
      ...rows,
      {
        id: Date.now(),
        usuarioId: usuarioSesion?.usuarioId || "", // o como obtengas el usuario
        mes: "",
        clienteId: "",
        solucionId: "",
        proyecto: "",
        actividadId: "",
        horas: ""
      }
    ]);
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

  const handleExportExcel = () => {
    // Lógica para exportar a Excel
  };

  const handleExportPDF = () => {
    // Lógica para exportar a PDF
  };

  // Campos obligatorios
  const camposObligatorios = ["mes", "cliente", "solucion", "proyecto", "actividad", "horas"];

  // Este evento se ejecuta cuando se Guarda la Información.
  const handleGuardarRegistros = async e => {
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
    setLoading(true); // <-- Activa el loading


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
    const msjError = "Ocurrió un error al guardar los registros.";

    const myRequest = rows.map(row => ({
      usuarioId: usuarioSesion.usuarioId || "",
      mes: row.mes,
      clienteId: row.cliente,
      solucionId: row.solucion,
      proyecto: row.proyecto,
      actividadId: row.actividad,
      horas: row.horas
    }));

    // console.log("Datos a guardar:", myRequest);
    // setLoading(false);
    // return;

    try {
      const payload = { registros: myRequest };
      const response = await guardarTiemposProyectoAction(payload);
      let { status, statusText } = response;

      if (status === HttpStatus.OK && statusText === "OK") {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Información registrada correctamente.",
            severity: "success",
          },
        });

      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: msjError,
            severity: "error",
            vertical: "bottom",
            horizontal: "left"
          },
        });
      }

    } catch (error) {
      const errorMessage = error?.data?.errors?.msg || msjError;
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: errorMessage,
          severity: "error",
          vertical: "bottom",
          horizontal: "left"
        },
      });

    } finally {
      setLoading(false); // <-- Desactiva el loading
    }

  };

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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                style={style.submit}
                onClick={handleGuardarRegistros}
              >
                {loading ? "Guardando..." : "Guardar"}
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
        <Grid2 size={{ xs: 6, md: 2 }}>
          <Typography variant="body1" gutterBottom>
            Cuenta de Horas
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 8 }}>
          {/* botones de exportación para Excel y PDF */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip title="Exportar a Excel">
              <IconButton
                color="success"
                size="large"
                onClick={handleExportExcel}
                sx={{
                  border: '2px solid transparent',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    border: '2px solid #1F4E78', // Cambia el color del border
                  },
                }}
              >
                <FileDownloadOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportar a PDF">
              <IconButton
                color="error"
                size="large"
                onClick={handleExportPDF}
                sx={{
                  border: '2px solid transparent',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    border: '2px solid #1F4E78', // Cambia el color del border
                    //color: '#F2F2F2'
                  },
                }}
              >
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Grid2>
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
                {mes.nombre}: <b>{mes.hora ?? 0}</b>
              </Typography>
            ))}
          </div>
        </Grid2>

      </Grid2>

      <Grid2 container spacing={1} sx={{ mt: 4 }}>
        {loadingTiemposPorProyecto ? (
          <Grid2 item xs={12} sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Grid2>
        ) : (
          <TblRegistrosTiemposPorProyecto registros={registrosTiemposPorProyecto} />
        )}
      </Grid2>

    </>
  )
}

export default DetalleRegistro;