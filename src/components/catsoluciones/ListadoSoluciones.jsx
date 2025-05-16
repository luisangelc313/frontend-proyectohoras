import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid2,
  Icon,
  IconButton,
  Paper,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import style from "../Tool/style";
import useStyles from "../../styles/theme-style";
import ControlTyping from "../Tool/ControlTyping";
import { useStateValue } from "../../context/store";
import { paginacionSolucionAction } from "../../actions/SolucionAction";

import {
  useHandleGuardarSolucion,
  useHandleEditarSolucion,
  useHandleEliminarSolucion,
  useHandleActivarInactivarSolucion,
} from "./hooks/HandleSolucion";
import {
  DialogNuevaSolucion,
  DialogEditarSolucion,
  DialogEliminarSolucion,
  DialogActivarInactivarSolucion,
} from "./Dialogs";

const maxLength = 150;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListadoSoluciones = () => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();

  const [, dispatch] = useStateValue();
  const nombreSolucionRef = useRef(null);
  const nombreSolucionEditRef = useRef(null);
  const [errorNombreSolucion, setErrorNombreSolucion] = useState({ nombreSolucion: false });
  const [errorNombreSolucionEdit, setErrorNombreSolucionEdit] = useState({ nombreSolucionEdit: false });
  const [textoBusquedaSolucion, setTextoBusquedaSolucion] = useState("");
  const typingBuscadorTexto = ControlTyping(textoBusquedaSolucion, 1500);


  // Variables para el Diaglog Nueva Solucion.
  const [nombreSolucion, setNombreSolucion] = useState("");
  const [openDialogNuevaSolucion, setOpenDialogNuevaSolucion] = useState(false);
  // Variables para el Dialog Editar
  const [openDialogEditarSolucion, setOpenDialogEditarSolucion] = useState(false);
  const [solucionToEdit, setSolucionToEdit] = useState(null);
  const [solucionOriginalToEdit, setSolucionOriginalToEdit] = useState(null);
  //Variables para el Dialog Eliminar
  const [openDialogEliminarSolucion, setOpenDialogEliminarSolucion] = useState(false);
  const [solucionToDelete, setSolucionToDelete] = useState(null);
  //Variables para el Dialog Checkbox Activar/Inactivar
  const [openDialogActivarInactivar, setOpenDialogActivarInactivar] = useState(false);
  const [solucionToActiveInactive, setSolucionToActiveInactive] = useState(null);


  // Use the custom hook (CRUD de Soluciones)
  const { handleGuardarSolucion } = useHandleGuardarSolucion();
  const { handleEditarSolucion } = useHandleEditarSolucion();
  const { handleEliminarSolucion } = useHandleEliminarSolucion();
  const { handleActivarInactivarSolucion } = useHandleActivarInactivarSolucion();


  //INICIO. Variables control de Dialogs Abrir-Cerrar
  const handleOpenDialogNuevaSolucion = () => setOpenDialogNuevaSolucion(true);
  const handleCloseDialogNuevaSolucion = () => {
    setOpenDialogNuevaSolucion(false);
    resetFormDialogNvaSolucion();
  };

  const handleOpenDialogEditarSolucion = (solucion) => {
    setSolucionToEdit(solucion);
    setSolucionOriginalToEdit({ ...solucion });
    setOpenDialogEditarSolucion(true);
  };
  const handleCloseDialogEditarSolucion = () => {
    setOpenDialogEditarSolucion(false);
    resetFormDialogEditarSolucion();
  };

  const handleOpenDialogEliminarSolucion = (solucion) => {
    setSolucionToDelete(solucion);
    setOpenDialogEliminarSolucion(true);
  };
  const handleCloseDialogEliminarSolucion = () => {
    setOpenDialogEliminarSolucion(false);
    setSolucionToDelete(null);
  };

  const handleOpenDialogActivarInactivar = (solucion) => {
    setSolucionToActiveInactive(solucion);
    setOpenDialogActivarInactivar(true);
  };
  const handleCloseDialogActivarInactivar = () => {
    setOpenDialogActivarInactivar(false);
    setSolucionToActiveInactive(null);
  };
  //FIN. Variables constrol de Dialogs Abrir-Cerrar


  //Binding TextField Nueva Solucion
  const ingresarValoresMemoria = e => {
    let value = e.target.value;
    setNombreSolucion(value);

    if (value && errorNombreSolucion.nombreSolucion) {
      setErrorNombreSolucion({ nombreSolucion: false });
    }
  };
  //Binding TextField Editar Solucion
  const ingresarValoresMemoriaEdit = e => {
    let value = e.target.value;
    setSolucionToEdit({
      ...solucionToEdit,
      Nombre: e.target.value.toUpperCase(),
    });

    if (value && errorNombreSolucionEdit.nombreSolucionEdit) {
      setErrorNombreSolucionEdit({ nombreSolucionEdit: false });
    }
  };

  const resetFormDialogNvaSolucion = () => {
    setNombreSolucion("");
    setErrorNombreSolucion({ nombreSolucion: false });
  };

  const resetFormDialogEditarSolucion = () => {
    setSolucionToEdit(null);
    setErrorNombreSolucionEdit({ nombreSolucionEdit: false });
    setSolucionOriginalToEdit(null);
  };


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

  // Sorting state variables para paginador
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Nombre");
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
      if (order === "asc") {
        return a.Nombre.localeCompare(b.Nombre);
      } else {
        return b.Nombre.localeCompare(a.Nombre);
      }
    }
    return 0;
  });


  useEffect(() => {
    const obtenerListaSoluciones = async () => {
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
        const response = await paginacionSolucionAction(objetoPaginadorRequest);
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
      setLoading(false);
    };

    obtenerListaSoluciones();
  }, [paginadorRequest, typingBuscadorTexto, dispatch]);

  return (
    <div style={style.table}>
      <Typography component="h1" variant="h5">
        Listado de Soluciones
      </Typography>
      <Grid2 container style={style.tableGridContainer}>
        <Grid2 size={{ xs: 12, sm: 8, md: 8 }}>
          <TextField
            fullWidth
            name="textoBusquedaSolucion"
            variant="outlined"
            label="Buscar"
            onChange={(e) => setTextoBusquedaSolucion(e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box display="flex" justifyContent="center">
            <Tooltip title="Nueva Solucion">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon sx={{ fontSize: 30 }}>add_circle</Icon>}
                sx={{ padding: "10px 30px" }}
                onClick={handleOpenDialogNuevaSolucion}
              >
                Nueva
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
                        Solucion
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "Nombre"}
                          direction={orderBy === "Nombre" ? order : "asc"}
                          onClick={(event) =>
                            handleRequestSort(event, "Nombre")
                          }
                        >
                          Solucion
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
                          paddingBottom: 2
                        }}>
                        No se encontraron datos
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRecords.map((solucion) => (
                    <TableRow
                      key={solucion.SolucionId}
                      sx={{
                        backgroundColor: solucion.Activo ? "inherit" : "#ffebee", // Change background color if inactive
                        "&:nth-of-type(odd)": {
                          backgroundColor: solucion.Activo ? "#f9f9f9" : "#ffcdd2",
                        },
                        "&:hover": {
                          backgroundColor: solucion.Activo ? "#e0f7fa" : "#ef9a9a",
                        },
                      }}
                    >
                      {isMdDown ? (
                        <TableCell
                          align="left"
                          sx={{
                            textDecoration: solucion.Activo ? "none" : "line-through",
                          }}
                        >
                          {solucion.Nombre}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell
                            align="left"
                            sx={{
                              textDecoration: solucion.Activo ? "none" : "line-through",
                            }}
                          >
                            {solucion.Nombre}
                          </TableCell>
                          <TableCell align="left">{solucion.Estatus}</TableCell>
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
                                  onClick={() => handleOpenDialogEliminarSolucion(solucion)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={solucion.Activo ? "Inactivar" : "Activar"}>
                                <Checkbox
                                  checked={solucion.Activo || false}
                                  sx={{ cursor: "pointer" }}
                                  onChange={() => handleOpenDialogActivarInactivar(solucion)}
                                />
                              </Tooltip>
                              {solucion.Activo && (
                                <Tooltip
                                  title="Editar"
                                  onClick={() => handleOpenDialogEditarSolucion(solucion)}
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
            labelRowsPerPage="Solucions por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          ></TablePagination>
        </>
      )}

      <DialogNuevaSolucion
        open={openDialogNuevaSolucion}
        handleClose={handleCloseDialogNuevaSolucion}
        nombreSolucion={nombreSolucion}
        errorNombreSolucion={errorNombreSolucion}
        nombreSolucionRef={nombreSolucionRef}
        ingresarValoresMemoria={ingresarValoresMemoria}
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
        handleGuardarSolucion={(e) =>
          handleGuardarSolucion(
            e,
            nombreSolucion,
            nombreSolucionRef,
            setErrorNombreSolucion,
            handleCloseDialogNuevaSolucion,
            setPaginadorRequest,
            resetFormDialogNvaSolucion
          )
        } //Use the hook function
      />

      <DialogEditarSolucion
        open={openDialogEditarSolucion}
        handleClose={handleCloseDialogEditarSolucion}
        solucionToEdit={solucionToEdit}
        errorNombreSolucionEdit={errorNombreSolucionEdit}
        nombreSolucionEditRef={nombreSolucionEditRef}
        ingresarValoresMemoriaEdit={ingresarValoresMemoriaEdit}
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
        handleEditarSolucion={(e) =>
          handleEditarSolucion(
            e,
            { ...solucionOriginalToEdit },//Objeto solución a editar original.
            solucionToEdit,
            nombreSolucionEditRef,
            setErrorNombreSolucionEdit,
            handleCloseDialogEditarSolucion,
            setPaginadorRequest,
            resetFormDialogEditarSolucion
          )
        }
      />

      <DialogEliminarSolucion
        open={openDialogEliminarSolucion}
        handleClose={handleCloseDialogEliminarSolucion}
        solucionSeleccionado={solucionToDelete}
        Transition={Transition}
        handleEliminarSolucion={(e) =>
          handleEliminarSolucion(
            e,
            solucionToDelete,
            handleCloseDialogEliminarSolucion,
            setPaginadorRequest
          )
        }
      />

      <DialogActivarInactivarSolucion
        open={openDialogActivarInactivar}
        handleClose={handleCloseDialogActivarInactivar}
        solucionToActiveInactive={solucionToActiveInactive}
        Transition={Transition}
        handleActivarInactivar={(e) =>
          handleActivarInactivarSolucion(
            e,
            solucionToActiveInactive,
            handleCloseDialogActivarInactivar,
            setPaginadorRequest
          )
        } //Use the hook function
      />
    </div>
  )
}

export default ListadoSoluciones;