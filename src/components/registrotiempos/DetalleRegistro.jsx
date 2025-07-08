import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import style from "../Tool/style";
import { HttpStatus } from "../../utils/HttpStatus";
import RenderRow from './RenderRow';
import { useStateValue } from "../../context/store";
import {
  exportarRegistrosPDFAction,
  exportarRegistrosEXCELAction,
} from "../../actions/ExportarDocumentoAction";
import {
  guardarTiemposProyectoAction,
  obtenerRegistrosPaginadoAction,
} from "../../actions/RegistroTiemposAction";
import {
  ConfirmDialog,
  ConfirmDialogFiltrosExpArchivo,
} from "./Confirm";
import TblRegistrosTiemposPorProyecto from "./TblRegistrosTiemposPorProyecto";
import { ConvertirBase64PDF } from "../../utils/ConvertirBase64ToPDF";
import FiltrosExportacion from './hooks/FiltrosExportacion';


const DetalleRegistro = ({
  listadoClientes,
  listadoSoluciones,
  listadoActividades,
  usuarioSesion
}) => {
  const navigate = useNavigate();
  //Estado para los renglones dinámicos
  const [rows, setRows] = useState([]); // Empieza con un renglón vacío

  const [anioSeleccionado, setAnioSeleccionado] = useState(dayjs());
  const [anioResumen, setAnioResumen] = useState(dayjs());

  const [, setAbandonar] = useState(false);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [accionConfirm, setAccionConfirm] = useState(""); // "cancelar" o "limpiar"


  // Estado para el registro que se está editando
  const [registroEditando, setRegistroEditando] = useState(null);
  // Función para cargar el registro en el formulario superior
  const handleEditarRegistroResumen = registro => {
    // Carga el registro seleccionado en la parte superior para edición
    setRows([{
      ...registro,
      // Asegúrate de mapear los campos correctamente si los nombres difieren
      id: registro.registroId,
      mes: registro.mesId,
      cliente: registro?.clienteId,
      solucion: registro?.solucionId,
      proyecto: registro.descripcion || "",
      actividad: registro.actividadId,
      horas: registro.horas
    }]);
    setRegistroEditando(registro);
  };



  //INICIO. variables para paginación y funciones.
  //const [page, setPage] = useState(0);

  const [paginadorRequest, setPaginadorRequest] = useState({
    titulo: "",
    numeroPagina: 0,
    cantidadElementos: 10,
  });
  const [paginadorResponse, setPaginadorResponse] = useState({
    listaRecords: [],
    totalRecords: 0,
    numeroPaginas: 0,
  });

  const handlePageChange = (event, nuevaPagina) => {
    setPaginadorRequest((anterior) => ({
      ...anterior,
      numeroPagina: parseInt(nuevaPagina),
    }));
  };
  const handleRowsPerPageChange = (event) => {
    setPaginadorRequest((anterior) => ({
      ...anterior,
      cantidadElementos: parseInt(event.target.value),
      numeroPagina: 0,
    }));
  };
  //FIN. variables para paginación y funciones.

  const [meses, setMeses] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      nombre: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase(),//.replace(/^\w/, c => c.toUpperCase())
      hora: 0
    }))
  );

  //const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingTiemposPorProyecto, setLoadingTiemposPorProyecto] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [{ sesionUsuario }, dispatch] = useStateValue();

  const obtenerRegistrosTiemposPorProyecto = async (periodo) => {
    setLoadingTiemposPorProyecto(true);
    const msgError = "Ocurrió un error al obtener los registros de tiempos por proyecto.";

    try {
      const paginaVariant = paginadorRequest.numeroPagina + 1;
      const usuario = sesionUsuario?.usuario;

      const payload = {
        usuarioId: usuario?.usuarioId || "",
        numeroPagina: paginaVariant,
        cantidadElementos: paginadorRequest.cantidadElementos,
        descripcion: "",
        solucionId: null,
        clienteId: null,
        actividadId: null,
        fechaInicio: null,
        fechaFin: null,
        periodo: periodo, // <-- aquí usas el periodo recibido
      };

      const response = await obtenerRegistrosPaginadoAction(payload);

      if (response && response.data && response.status === 200 && response.statusText === "OK") {
        // ...tu lógica de actualización de estados...
        const listaRecords = response?.data?.listaRecords || [];
        setPaginadorResponse(response.data);

        if (response.data && listaRecords.length > 0) {
          // ...actualiza meses, totalGeneral, etc...
          // ...transforma listaRecords si es necesario...
          const cuentasHoras = listaRecords[0]?.cuentasHoras || [];
          const totalGeneral = listaRecords[0]?.totalGeneral || 0;

          const mesesActualizados = meses.map(mes => {
            const encontrado = cuentasHoras.find(c => c.mesID === mes.id);
            return {
              ...mes,
              hora: encontrado ? encontrado.horas : 0
            };
          });

          setMeses(mesesActualizados);
          setTotalGeneral(totalGeneral);

          const listaRecordsTransformada = listaRecords.map(item => ({
            ...item,
            mes: meses.find(m => m.id === item.mes)?.nombre || item.mes,
            mesId: item.mes,
            clienteId: item.cliente?.clienteId || "00000000-0000-0000-0000-000000000000",
            cliente: item.cliente?.nombre || "",
            solucionId: item.solucion?.solucionId || "00000000-0000-0000-0000-000000000000",
            solucion: item.solucion?.nombre || "",
            actividadId: item.actividad?.actividadId || "00000000-0000-0000-0000-000000000000",
            actividad: item.actividad?.nombre || "",
            proyecto: item.descripcion || "",
            horas: item.horas || 0,
          }));

          setPaginadorResponse({
            ...response.data,
            listaRecords: listaRecordsTransformada
          });
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
      console.error("Error Catch", error)
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
  };

  useEffect(() => {

    obtenerRegistrosTiemposPorProyecto(anioResumen.year());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionUsuario, paginadorRequest]);

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



  // Estado para los filtros seleccionados
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({
    cliente: null,
    solucion: null,
    actividad: null,
    mes: null,
    tipoFiltro: null
  });

  // Callback para actualizar los filtros
  const handleFiltrosChange = useCallback((nuevosFiltros) => {
    setFiltrosSeleccionados(nuevosFiltros);
  }, []);

  const fnExportExcel = async () => {
    // Lógica para exportar a Excel
    setLoadingExcel(true);

    let msjError = "Ocurrió un error al exportar a Excel. Intente de nuevo por favor.";

    try {
      const payload = {
        usuarioId: usuarioSesion.usuarioId || "",
        periodo: anioResumen.year() || 0, // enviar el año seleccionado
        clienteId: filtrosSeleccionados.cliente?.clienteId || null,
        solucionId: filtrosSeleccionados.solucion?.solucionId || null,
        actividadId: filtrosSeleccionados.actividad?.actividadId || null,
        mes: filtrosSeleccionados.mes || null,
      }
      const response = await exportarRegistrosEXCELAction(payload);
      let { status, statusText } = response;

      if (status === HttpStatus.OK && statusText === "OK") {

        const base64String = response.data.documentoData || "";
        const nombreArchivo = response.data.nombreDocumento || `HRS X PROY ${anioResumen.year()} - ${usuarioSesion.nombreCompleto}.pdf`;
        ConvertirBase64PDF(base64String, nombreArchivo, false); // false para Excel

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Archivo generado con éxito.",
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
      setLoadingExcel(false);
    }
  };

  const fnExportPDF = async () => {
    // Lógica para exportar a PDF
    setLoadingPDF(true);

    let msjError = "Ocurrió un error al exportar a PDF. Intente de nuevo por favor.";

    try {
      const payload = {
        usuarioId: usuarioSesion.usuarioId || "",
        periodo: anioResumen.year() || 0, // enviar el año seleccionado
        clienteId: filtrosSeleccionados.cliente?.clienteId || null,
        solucionId: filtrosSeleccionados.solucion?.solucionId || null,
        actividadId: filtrosSeleccionados.actividad?.actividadId || null,
        mes: filtrosSeleccionados.mes || null,
      }
      const response = await exportarRegistrosPDFAction(payload);
      let { status, statusText } = response;

      if (status === HttpStatus.OK && statusText === "OK") {

        const base64String = response.data.documentoData || "";
        const nombreArchivo = response.data.nombreDocumento || `HRS X PROY ${anioResumen.year()} - ${usuarioSesion.nombreCompleto}.pdf`;
        ConvertirBase64PDF(base64String, nombreArchivo);

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Archivo generado con éxito.",
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
      setLoadingPDF(false);
    }
  };

  // Variable para abrir el diálogo de filtros de exportación.
  // Tamaños dinámicos para el diálogo de filtros de exportación
  let dialogWidth = "600px";
  let dialogHeight = "350px";
  if (!filtrosSeleccionados.tipoFiltro
    || filtrosSeleccionados.tipoFiltro === 1
    || filtrosSeleccionados.tipoFiltro === "1") {
    // Solo el select visible, hazlo más pequeño
    dialogWidth = "430px";
    dialogHeight = "230px";
  }

  const [openDialogFiltrosExpArchivo, setOpenDialogFiltrosExpArchivo] = useState(false);
  const [tipoExportacion, setTipoExportacion] = useState(null);
  const [errorFiltro, setErrorFiltro] = useState(""); // Nuevo estado para el error
  const handleLimpiarErrorFiltro = () => setErrorFiltro("");

  const handleOpenDialogFiltrosExpArchivo = (tipo) => {
    setTipoExportacion(tipo);
    setOpenDialogFiltrosExpArchivo(true);
  };

  const handleCloseDialogFiltrosExpArchivo = () => {
    setOpenDialogFiltrosExpArchivo(false);
  };

  // Cuando el usuario confirme en el diálogo:
  const handleConfirmDialogFiltrosExpArchivo = e => {
    e.preventDefault();

    // Validar que el usuario haya seleccionado una opción de filtrado
    if (!filtrosSeleccionados.tipoFiltro) {
      setErrorFiltro("Por favor, seleccione una opción de filtrado.");
      return; // No cerrar el modal
    }

    // Si pasa la validación, limpia el error y continúa
    setErrorFiltro("");

    // Dependiendo del tipo de exportación, llama a la función correspondiente
    if (tipoExportacion === "excel") {
      fnExportExcel();

    } else if (tipoExportacion === "pdf") {
      fnExportPDF();
    }

    setOpenDialogFiltrosExpArchivo(false);
  };



  // Campos obligatorios
  const camposObligatorios = ["mes", "cliente", "solucion", "proyecto", "actividad", "horas"];

  // Este evento se ejecuta cuando se Guarda la Información.
  const handleGuardarRegistros = async e => {
    e.preventDefault();

    setRegistroEditando(null);

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

      setLoading(false); // <-- Desactiva el loading
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
      horas: row.horas,
      periodo: anioSeleccionado.year() // Asegúrate de enviar el año seleccionado
    }));

    let registroId = '';
    if (registroEditando) {
      // Si hay un registro editando, actualiza el ID del registro (de momento cuando es editar solo será un registro, se preparara para que sea multiple la edición)
      myRequest[0].registroId = registroEditando.registroId || "00000000-0000-0000-0000-000000000000";
      registroId = myRequest[0].registroId;
    }

    // console.log("Datos a guardar:", myRequest[0]);
    // setLoading(false);
    // return;

    try {
      const paginaVariant = paginadorRequest.numeroPagina + 1;
      const payload = {
        registros: myRequest,
        numeroPagina: paginaVariant,
        cantidadElementos: paginadorRequest.cantidadElementos
      };

      const response = await guardarTiemposProyectoAction(payload, registroId);
      let { status, statusText } = response;

      if (status === HttpStatus.OK && statusText === "OK") {

        const listaRecords = response?.data?.listaRecords || [];
        setPaginadorResponse(response.data);

        if (response.data && listaRecords.length > 0) {
          //console.log("cuentas Horas:", response.data[0].cuentasHoras);

          const cuentasHoras = listaRecords[0]?.cuentasHoras || [];
          const totalGeneral = listaRecords[0]?.totalGeneral || 0;

          // Copia el array meses
          const mesesActualizados = meses.map(mes => {
            // Busca si hay un registro de horas para este mes
            const encontrado = cuentasHoras.find(c => c.mesID === mes.id);
            return {
              ...mes,
              hora: encontrado ? encontrado.horas : 0
            };
          });

          setMeses(mesesActualizados);
          setTotalGeneral(totalGeneral);

          //console.log("paginadorResponse", paginadorResponse);
          //Hacer el map para transformar los registros
          const listaRecordsTransformada = listaRecords.map(item => ({
            ...item,
            mes: meses.find(m => m.id === item.mes)?.nombre || item.mes,
            cliente: item.cliente?.nombre || "",
            solucion: item.solucion?.nombre || "",
            actividad: item.actividad?.nombre || "",
            proyecto: item.descripcion || "",
            horas: item.horas || 0,
          }));

          //actualizar el paginadorResponse con la lista transformada
          setPaginadorResponse({
            ...response.data,
            listaRecords: listaRecordsTransformada
          });
        }

        //Limpia los renglones después de guardar
        setRows([{
          id: Date.now(),
          usuarioId: usuarioSesion?.usuarioId || "",
          mes: "",
          clienteId: "",
          solucionId: "",
          proyecto: "",
          actividadId: "",
          horas: ""
        }]);
        setFieldErrors({});

        //Invoco el handleCancelar porque resetea la captura y el estado de captura.
        if (registroEditando) {
          setRows([]);
          setFieldErrors({});
        }

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


  const handleCancelar = () => {
    // Verifica si hay al menos un renglón con algún valor en los campos editables
    const camposEditables = [...camposObligatorios];
    const tieneAlgunValor = rows.some(row =>
      camposEditables.some(
        campo => row[campo] !== "" && row[campo] !== null && row[campo] !== undefined && row[campo] !== 0
      )
    );

    if (rows.length > 0 && tieneAlgunValor) {
      setAccionConfirm("cancelar");
      setOpenConfirm(true);
    } else {
      setRows([]);
      setFieldErrors({});
    }

    setRegistroEditando(null); // Limpia el estado de edición
    setRows([]); // O restablece los rows como prefieras (puedes dejarlo vacío o con un renglón nuevo)
  };

  const handleConfirmCancel = () => {
    if (accionConfirm === "limpiar") {
      setRows([{
        id: Date.now(),
        usuarioId: usuarioSesion?.usuarioId || "",
        mes: "",
        clienteId: "",
        solucionId: "",
        proyecto: "",
        actividadId: "",
        horas: ""
      }]);
      setFieldErrors({});

    } else if (accionConfirm === "abandonar") {
      navigate("/"); // Redirige al home

    } else {
      setRows([]);
      setFieldErrors({});
    }

    setOpenConfirm(false);
    setAbandonar(false);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleLimpiar = () => {
    const camposEditables = [...camposObligatorios];
    const tieneAlgunValor = rows.some(row =>
      camposEditables.some(
        campo => row[campo] !== "" && row[campo] !== null && row[campo] !== undefined && row[campo] !== 0
      )
    );

    if (rows.length > 0 && tieneAlgunValor) {
      setAccionConfirm("limpiar");
      setOpenConfirm(true);

    } else {
      setRows([{
        id: Date.now(),
        usuarioId: usuarioSesion?.usuarioId || "",
        mes: "",
        clienteId: "",
        solucionId: "",
        proyecto: "",
        actividadId: "",
        horas: ""
      }]);
      setFieldErrors({});
    }
  };

  const handleAbandonar = () => {
    const camposEditables = [...camposObligatorios];
    const tieneAlgunValor = rows.some(row =>
      camposEditables.some(
        campo => row[campo] !== "" && row[campo] !== null && row[campo] !== undefined && row[campo] !== 0
      )
    );

    if (rows.length > 0 && tieneAlgunValor) {
      setAccionConfirm("abandonar");
      setOpenConfirm(true);
      setAbandonar(true);
    } else {
      navigate("/"); // Redirige al home directamente si no hay datos
    }
  };


  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            Registro de Horas por Proyecto{" "}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAbandonar}
            sx={{ fontWeight: 500 }}
          >
            Abandonar Captura
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 2 }}>
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year']}
              label="Periodo"
              value={anioSeleccionado}
              onChange={(nuevoValor) => {
                setAnioSeleccionado(nuevoValor);
                //console.log("Año seleccionado:", nuevoValor ? nuevoValor.year() : null);
              }}
              sx={{ width: 120 }}
              slotProps={{ textField: { size: 'small' } }}
              maxDate={dayjs().endOf('year')}
              disabled={rows.length === 0} // Solo habilitado si hay al menos un renglón
            />
          </LocalizationProvider>
        </Box>

      </Box >
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
            errors={fieldErrors[idx] || {}} // <-- errores solo para ese renglón
            registroEditando={registroEditando}
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
                onClick={handleCancelar}
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
                onClick={handleLimpiar}
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
      <Grid2 container spacing={1} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen
            </Typography>
            {/* Datepicker de Resumen "Periodo" */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year']}
                label="Periodo"
                value={anioResumen}
                onChange={(nuevoValor) => {
                  setAnioResumen(nuevoValor);
                  if (nuevoValor) {
                    obtenerRegistrosTiemposPorProyecto(nuevoValor.year());
                  }
                }}
                sx={{ width: 120 }}
                slotProps={{ textField: { size: 'small' } }}
                maxDate={dayjs().endOf('year')}
              />
            </LocalizationProvider>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 2 }}>
          <Typography variant="body1" gutterBottom>
            Cuenta de Horas
          </Typography>
        </Grid2>
        {/* botones de exportación para EXCEL y PDF */}
        <Grid2 size={{ xs: 6, md: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip title="Exportar a Excel">
              <IconButton
                color="success"
                size="large"
                onClick={() => handleOpenDialogFiltrosExpArchivo("excel")}
                sx={{
                  border: '2px solid transparent',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    border: '2px solid #1F4E78', // Cambia el color del border
                  },
                }}
              >
                {loadingExcel ? <CircularProgress size={24} color="inherit" /> : <FileDownloadOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportar a PDF">
              <IconButton
                color="error"
                size="large"
                onClick={() => handleOpenDialogFiltrosExpArchivo("pdf")}
                sx={{
                  border: '2px solid transparent',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    border: '2px solid #1F4E78', // Cambia el color del border
                    //color: '#F2F2F2'
                  },
                }}
              >
                {loadingPDF ? <CircularProgress size={24} color="inherit" /> : <PictureAsPdfIcon />}
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
            {totalGeneral}
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
          <Grid2
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 160, // Ajusta según la altura de tu tabla
              width: "100%",
            }}
          >
            <Grid2 item>
              <CircularProgress />
            </Grid2>
          </Grid2>
        ) : (
          <TblRegistrosTiemposPorProyecto
            registros={paginadorResponse.listaRecords}
            count={paginadorResponse.totalRecords}
            rowsPerPage={paginadorRequest.cantidadElementos}
            page={paginadorRequest.numeroPagina}
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            // handleEdit={handleEditarRegistroResumen}
            // handleDelete={handleEliminarRegistroResumen}
            refrescarResumen={() => obtenerRegistrosTiemposPorProyecto(anioResumen.year())}
            onEditarRegistro={handleEditarRegistroResumen}
            registroEditando={registroEditando}
          />
        )}
      </Grid2>

      {/* Dialog para confirmar la cancelación */}
      <ConfirmDialog
        open={openConfirm}
        title={
          accionConfirm === "limpiar"
            ? "¿Está seguro de que desea limpiar la captura?"
            : accionConfirm === "abandonar"
              ? "¿Está seguro de que desea abandonar la captura?"
              : "¿Está seguro de que desea cancelar?"
        }
        content={
          accionConfirm === "limpiar"
            ? "Se eliminarán todos los datos capturados y se dejará solo un renglón vacío."
            : accionConfirm === "abandonar"
              ? "Se perderán los cambios no guardados."
              : "Se perderán los cambios no guardados."
        }
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmCancel}
        width={accionConfirm === "limpiar" || accionConfirm === "abandonar"
          ? "570px" : ""
        }
        height={accionConfirm === "limpiar" || accionConfirm === "abandonar"
          ? "220px" : ""
        }
      />

      {/* Dialog para aplicar filtros a exportación de archivos */}
      <ConfirmDialogFiltrosExpArchivo
        open={openDialogFiltrosExpArchivo}
        title={"Filtros Exportación de Archivo"}
        content={
          <FiltrosExportacion
            clientes={listadoClientes}
            soluciones={listadoSoluciones}
            actividades={listadoActividades}
            onFiltrosChange={handleFiltrosChange} // <-- pasa el callback
            errorFiltro={errorFiltro} // <-- pasa el error
            onLimpiarErrorFiltro={handleLimpiarErrorFiltro}
          />
        }
        onClose={handleCloseDialogFiltrosExpArchivo}
        onConfirm={handleConfirmDialogFiltrosExpArchivo}
        width={dialogWidth}
        height={dialogHeight}
      />

    </>
  )
}

export default DetalleRegistro;