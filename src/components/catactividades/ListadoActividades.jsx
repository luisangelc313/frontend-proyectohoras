import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid2,
  IconButton,
  Tooltip,
  Icon,
  TableContainer,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Stack,
  Slide,
  Paper,
  useMediaQuery,
  useTheme,
  TableSortLabel,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import style from "../Tool/style";
import ControlTyping from "../Tool/ControlTyping";
import useStyles from "../../styles/theme-style";
import { useStateValue } from "../../context/store";
import { paginacionActividad } from "../../actions/ActividadAction";
import {
  DialogNuevaActividad,
  DialogEditarActividad,
  DialogEliminarActividad,
  DialogActivarInactivarActividad,
} from "./Dialogs";

//hooks Actividad (guardar, editar, eliminar, inactivar)
import {
  useHandleGuardarActividad,
  useHandleEditarActividad,
  useHandleEliminarActividad,
  useHandleActivarInactivarActividad,
} from "./hooks/HandleActividad";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const maxLength = 150;

const ListadoActividades = () => {
  const classes = useStyles();
  const [, dispatch] = useStateValue();
  const nombreActividadRef = useRef(null);
  const nombreActividadEditRef = useRef(null);
  const [errorNombreActividad, setErrorNombreActividad] = useState({ Username: false });
  const [errorNombreActividadEdit, setErrorNombreActividadEdit] = useState({ Username: false });
  const [textoBusquedaActividad, setTextoBusquedaActividad] = useState("");
  const typingBuscadorTexto = ControlTyping(textoBusquedaActividad, 1500);

  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

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

  // Sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Nombre');

  // Variables para el Diaglog Nueva Actividad.
  const [openDialogNuevaActividad, setOpenDialogNuevaActividad] = useState(false);
  const [nombreActividad, setNombreActividad] = useState("");
  // Variables para el ButtonIcon Editar
  const [openDialogEditarActividad, setOpenDialogEditarActividad] = useState(false);
  const [actividadToEdit, setActividadToEdit] = useState(null);
  const [actividadOrginalToEdit, setActividadOrginalToEdit] = useState(null);
  //Variables para el ButtonIcon Eliminar
  const [openDialogEliminarActividad, setOpenDialogEliminarActividad] = useState(false);
  const [actividadToDelete, setActividadToDelete] = useState(null);
  //Variables para el Checkbox Activar/Inactivar
  const [openDialogActivarInactivarActividad, setOpenDialogActivarInactivarActividad] = useState(false);
  const [actividadToActiveInactive, setActividadToActiveInactive] = useState(null);

  // Use the custom hook (CRUD de actividades)
  const { handleGuardarActividad } = useHandleGuardarActividad();
  const { handleEditarActividad } = useHandleEditarActividad();
  const { handleEliminarActividad } = useHandleEliminarActividad();
  const { handleActivarInactivarActividad } = useHandleActivarInactivarActividad();

  const handleOpenDialogNuevaActividad = () => setOpenDialogNuevaActividad(true);
  const handleCloseDialogNuevaActividad = () => {
    setOpenDialogNuevaActividad(false);
    resetFormDialog();
  };

  const handleOpenDialogEditarActividad = (actividad) => {
    setActividadToEdit(actividad);
    setActividadOrginalToEdit({ ...actividad });
    setOpenDialogEditarActividad(true);
  };
  const handleCloseDialogEditarActividad = () => {
    setOpenDialogEditarActividad(false);
    //setActividadToEdit(null);
    resetFormDialogEditActividad();
  };

  const handleOpenDialogEliminarActividad = (actividad) => {
    setActividadToDelete(actividad);
    setOpenDialogEliminarActividad(true);
  };
  const handleCloseDialogEliminarActividad = () => {
    setOpenDialogEliminarActividad(false);
    setActividadToDelete(null);
  };

  const handleOpenDialogActivarInactivarActividad = (actividad) => {
    setActividadToActiveInactive(actividad);
    setOpenDialogActivarInactivarActividad(true);
  };
  const handleCloseDialogActivarInactivarActividad = () => {
    setOpenDialogActivarInactivarActividad(false);
    setActividadToActiveInactive(null);
  };


  //Binding TextField Nuevo Actividad
  const ingresarValoresMemoria = e => {
    let value = e.target.value;
    setNombreActividad(value);

    if (value && errorNombreActividad.nombreActividad) {
      setErrorNombreActividad({ nombreActividad: false });
    }
  };
  //Binding TextField Editar Actividad
  const ingresarValoresMemoriaEdit = e => {
    let value = e.target.value;
    setActividadToEdit({
      ...actividadToEdit,
      Nombre: e.target.value.toUpperCase(),
    });

    if (value && errorNombreActividadEdit.nombreActividadEdit) {
      setErrorNombreActividadEdit({ nombreActividad: false });
    }
  };

  const resetFormDialog = () => {
    setNombreActividad("");
    setErrorNombreActividad({ nombreActividad: false });
  };

  const resetFormDialogEditActividad = () => {
    setActividadToEdit(null);
    setErrorNombreActividadEdit({ nombreActividad: false });
    setActividadOrginalToEdit(null);
  };

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

  const handleRequestSort = (event, property) => {
    event.preventDefault();
    //const targetClassName = event.target.className || "";
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRecords = [...paginadorResponse.listaRecords].sort((a, b) => {
    if (orderBy === "Nombre") {
      if (order === 'asc') {
        return a.Nombre.localeCompare(b.Nombre);
      } else {
        return b.Nombre.localeCompare(a.Nombre);
      }
    }
    return 0;
  });

  useEffect(() => {
    const obtenerListaActividades = async () => {
      setLoading(true);
      let tituloVariant = "";
      let paginaVariant = paginadorRequest.numeroPagina + 1;

      if (typingBuscadorTexto) {
        tituloVariant = typingBuscadorTexto;
        paginaVariant = 1;
      }

      const objetoPaginadorRequest = {
        nombre: tituloVariant,
        numeroPagina: paginaVariant,
        cantidadElementos: paginadorRequest.cantidadElementos,
      };

      try {
        const response = await paginacionActividad(objetoPaginadorRequest);
        setPaginadorResponse(response.data);

      } catch (error) {
        let errorMessage = error.response?.data?.errors?.msg || "Ocurrió un error al obtener la información.";
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: errorMessage,
            severity: "error",
          },
        });

        setPaginadorResponse({
          listaRecords: [],
          totalRecords: 0,
          numeroPaginas: 0,
        });

      } finally {
        setLoading(false);
      }
    }

    obtenerListaActividades();
  }, [paginadorRequest, typingBuscadorTexto, dispatch]);

  return (
    <div style={style.table}>
      <Typography component="h1" variant="h5">
        Listado de Actividades
      </Typography>
      <Grid2 container style={style.tableGridContainer}>
        <Grid2 size={{ xs: 12, sm: 8, md: 8 }}>
          <TextField
            fullWidth
            name="textoBusquedaActividad"
            variant="outlined"
            label="Buscar"
            onChange={(e) => setTextoBusquedaActividad(e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box display="flex" justifyContent="center">
            <Tooltip title="Nueva Actividad">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon sx={{ fontSize: 30 }}>add_circle</Icon>}
                sx={{ padding: "10px 30px" }}
                onClick={handleOpenDialogNuevaActividad}
              >
                Nuevo
              </Button>
            </Tooltip>
          </Box>
        </Grid2>
      </Grid2>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  {isMdDown ? (
                    // Visible on medium and smaller screens
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      <TableSortLabel
                        active={orderBy === "Nombre"}
                        direction={orderBy === "Nombre" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "Nombre")}
                      >
                        Actividad
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "Nombre"}
                          direction={orderBy === "Nombre" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "Nombre")}
                        >
                          Actividad
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        Estatus
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Acción
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMdDown ? 1 : 3} align="center" sx={{ width: "100%" }}>
                      <Typography variant="button"
                        gutterBottom
                        sx={{
                          display: "block",
                          fontSize: "14px",
                          paddingTop: 2,
                          paddingBottom: 2,
                          textAlign: "center",
                        }}>
                        No se encontraron datos
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (sortedRecords.map((actividad) => (
                  <TableRow
                    key={actividad.ActividadId}
                    sx={{
                      backgroundColor: actividad.Activa ? "inherit" : "#ffebee", // Change background color if inactive
                      "&:nth-of-type(odd)": {
                        backgroundColor: actividad.Activa
                          ? "#f9f9f9"
                          : "#ffcdd2",
                      },
                      "&:hover": {
                        backgroundColor: actividad.Activa
                          ? "#e0f7fa"
                          : "#ef9a9a",
                      },
                    }}
                  >
                    {isMdDown ? (
                      <TableCell
                        align="left"
                        sx={{
                          textDecoration: actividad.Activa
                            ? "none"
                            : "line-through",
                        }}
                      >
                        {actividad.Nombre}
                      </TableCell>
                    ) : (
                      <>
                        <TableCell
                          align="left"
                          sx={{
                            textDecoration: actividad.Activa
                              ? "none"
                              : "line-through",
                          }}
                        >
                          {actividad.Nombre}
                        </TableCell>
                        <TableCell align="left">{actividad.Estatus}</TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Tooltip title="Eliminar">
                              <IconButton
                                aria-label="delete"
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleOpenDialogEliminarActividad(
                                    actividad
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={actividad.Activa ? "Inactivar" : "Activar"}>
                              <Checkbox
                                checked={actividad.Activa || false}
                                sx={{ cursor: "pointer" }}
                                onChange={() =>
                                  handleOpenDialogActivarInactivarActividad(actividad)
                                }
                              />
                            </Tooltip>
                            {actividad.Activa && (
                              <Tooltip
                                title="Editar"
                                onClick={() => handleOpenDialogEditarActividad(actividad)}
                              >
                                <IconButton
                                  aria-label="edit"
                                  sx={{ cursor: "pointer" }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={paginadorResponse.totalRecords}
            rowsPerPage={paginadorRequest.cantidadElementos}
            page={paginadorRequest.numeroPagina}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Actividades por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          ></TablePagination>
        </>
      )}

      <DialogNuevaActividad
        open={openDialogNuevaActividad}
        handleClose={handleCloseDialogNuevaActividad}
        nombreActividad={nombreActividad}
        errorNombreActividad={errorNombreActividad}
        nombreActividadRef={nombreActividadRef}
        ingresarValoresMemoria={ingresarValoresMemoria}
        //guardarActividad={guardarActividad}
        handleGuardarActividad={(e) =>
          handleGuardarActividad(
            e,
            nombreActividad,
            nombreActividadRef,
            setErrorNombreActividad,
            handleCloseDialogNuevaActividad,
            setPaginadorRequest,
            resetFormDialog
          )
        } //Use the hook function
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
      />

      <DialogEditarActividad
        open={openDialogEditarActividad}
        handleClose={handleCloseDialogEditarActividad}
        actividadToEdit={actividadToEdit}
        errorNombreActividadEdit={errorNombreActividadEdit}
        nombreActividadEditRef={nombreActividadEditRef}
        ingresarValoresMemoriaEdit={ingresarValoresMemoriaEdit}
        //handleSaveEdit={handleSaveEditActividad}
        handleEditarActividad={(e) =>
          handleEditarActividad(
            e,
            actividadOrginalToEdit,
            actividadToEdit,
            nombreActividadEditRef,
            setErrorNombreActividadEdit,
            handleCloseDialogEditarActividad,
            setPaginadorRequest,
            resetFormDialogEditActividad
          )
        } //Use the hook function
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
      />

      <DialogEliminarActividad
        open={openDialogEliminarActividad}
        handleClose={handleCloseDialogEliminarActividad}
        //handleDelete={handleDeleteActividad}
        handleEliminarActividad={(e) =>
          handleEliminarActividad(
            e,
            actividadToDelete,
            handleCloseDialogEliminarActividad,
            setPaginadorRequest
          )
        } //Use the hook function
        selectedActividad={actividadToDelete}
        Transition={Transition}
      />

      <DialogActivarInactivarActividad
        open={openDialogActivarInactivarActividad}
        handleClose={handleCloseDialogActivarInactivarActividad}
        //handleActivarInactivarActividad={handleInactivateActividad}
        handleActivarInactivarActividad={(e) =>
          handleActivarInactivarActividad(
            e,
            actividadToActiveInactive,
            handleCloseDialogActivarInactivarActividad,
            setPaginadorRequest
          )
        } //Use the hook function
        actividadToActiveInactive={actividadToActiveInactive}
        Transition={Transition}
      />
    </div>
  );
};

export default ListadoActividades;