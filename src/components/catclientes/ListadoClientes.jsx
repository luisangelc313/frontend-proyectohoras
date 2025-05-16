import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

import style from "../Tool/style";
import ControlTyping from "../Tool/ControlTyping";
import useStyles from "../../styles/theme-style";
import { useStateValue } from "../../context/store";
import { paginacionClienteAction } from "../../actions/ClienteAction";
import {
  useHandleGuardarCliente,
  useHandleActivarInactivarCliente,
  useHandleEditarCliente,
  useHandleEliminarCliente,
} from "./hooks/HandleCliente";
import {
  DialogNuevoCliente,
  DialogActivarInactivarCliente,
  DialogEliminarCliente,
  DialogEditarCliente,
} from "./Dialogs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const maxLength = 150;

const ListadoClientes = () => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();
  const [, dispatch] = useStateValue();
  const nombreClienteRef = useRef(null);
  const nombreClienteEditRef = useRef(null);
  const [errorNombreCliente, setErrorNombreCliente] = useState({ nombreCliente: false });
  const [errorNombreClienteEdit, setErrorNombreClienteEdit] = useState({ nombreClienteEdit: false });
  const [textoBusquedaCliente, setTextoBusquedaCliente] = useState("");
  const typingBuscadorTexto = ControlTyping(textoBusquedaCliente, 1500);


  // Variables para el Diaglog Nuevo Cliente.
  const [nombreCliente, setNombreCliente] = useState("");
  const [openDialogNuevoCliente, setOpenDialogNuevoCliente] = useState(false);
  // Variables para el ButtonIcon Editar
  const [openDialogEditarCliente, setOpenDialogEditarCliente] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState(null);
  const [clienteOriginalToEdit, setClienteOriginalToEdit] = useState(null);
  //Variables para el ButtonIcon Eliminar
  const [openDialogEliminarCliente, setOpenDialogEliminarCliente] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  //Variables para el Checkbox Activar/Inactivar
  const [openDialogActivarInactivar, setOpenDialogActivarInactivar] = useState(false);
  const [clienteToActiveInactive, setClienteToActiveInactive] = useState(null);


  // Use the custom hook (CRUD de clientes)
  const { handleGuardarCliente } = useHandleGuardarCliente();
  const { handleEditarCliente } = useHandleEditarCliente();
  const { handleEliminarCliente } = useHandleEliminarCliente();
  const { handleActivarInactivarCliente } = useHandleActivarInactivarCliente();


  //INICIO. Variables constrol de Dialogs Abrir-Cerrar
  const handleOpenDialogNuevoCliente = () => setOpenDialogNuevoCliente(true);
  const handleCloseDialogNuevoCliente = () => {
    setOpenDialogNuevoCliente(false);
    resetFormDialogNvoCliente();
  };

  const handleOpenDialogEditarCliente = (cliente) => {
    setClienteToEdit(cliente);
    setClienteOriginalToEdit({ ...cliente });
    setOpenDialogEditarCliente(true);
  };
  const handleCloseDialogEditarCliente = () => {
    setOpenDialogEditarCliente(false);
    resetFormDialogEditarCliente();
  };

  const handleOpenDialogEliminarCliente = (cliente) => {
    setClienteToDelete(cliente);
    setOpenDialogEliminarCliente(true);
  };
  const handleCloseDialogEliminarCliente = () => {
    setOpenDialogEliminarCliente(false);
    setClienteToDelete(null);
  };

  const handleOpenDialogActivarInactivar = (cliente) => {
    setClienteToActiveInactive(cliente);
    setOpenDialogActivarInactivar(true);
  };
  const handleCloseDialogActivarInactivar = () => {
    setOpenDialogActivarInactivar(false);
    setClienteToActiveInactive(null);
  };
  //FIN. Variables control de Dialogs Abrir-Cerrar


  //Binding TextField Nuevo Cliente
  const ingresarValoresMemoria = e => {
    let value = e.target.value;
    setNombreCliente(value);

    if (value && errorNombreCliente.nombreCliente) {
      setErrorNombreCliente({ nombreCliente: false });
    }
  };
  //Binding TextField Editar Cliente
  const ingresarValoresMemoriaEdit = e => {
    let value = e.target.value;
    setClienteToEdit({
      ...clienteToEdit,
      Nombre: e.target.value.toUpperCase(),
    });

    if (value && errorNombreClienteEdit.nombreClienteEdit) {
      setErrorNombreClienteEdit({ nombreClienteEdit: false });
    }
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

  const resetFormDialogNvoCliente = () => {
    setNombreCliente("");
    setErrorNombreCliente({ nombreCliente: false });
  };

  const resetFormDialogEditarCliente = () => {
    setClienteToEdit(null);
    setErrorNombreClienteEdit({ nombreClienteEdit: false });
    setClienteOriginalToEdit(null);
  };

  useEffect(() => {
    const obtenerListaClientes = async () => {
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
        const response = await paginacionClienteAction(objetoPaginadorRequest);
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
    };

    obtenerListaClientes();
  }, [paginadorRequest, typingBuscadorTexto, dispatch]);

  return (
    <div style={style.table}>
      <Typography component="h1" variant="h5">
        Listado de Clientes
      </Typography>
      <Grid2 container style={style.tableGridContainer}>
        <Grid2 size={{ xs: 12, sm: 8, md: 8 }}>
          <TextField
            fullWidth
            name="textoBusquedaCliente"
            variant="outlined"
            label="Buscar"
            onChange={(e) => setTextoBusquedaCliente(e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box display="flex" justifyContent="center">
            <Tooltip title="Nuevo Cliente">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon sx={{ fontSize: 30 }}>add_circle</Icon>}
                sx={{ padding: "10px 30px" }}
                onClick={handleOpenDialogNuevoCliente}
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
                        Cliente
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
                          Cliente
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
                ) : (
                  sortedRecords.map((cliente) => (
                    <TableRow
                      key={cliente.ClienteId}
                      sx={{
                        backgroundColor: cliente.Activo ? "inherit" : "#ffebee", // Change background color if inactive
                        "&:nth-of-type(odd)": {
                          backgroundColor: cliente.Activo ? "#f9f9f9" : "#ffcdd2",
                        },
                        "&:hover": {
                          backgroundColor: cliente.Activo ? "#e0f7fa" : "#ef9a9a",
                        },
                      }}
                    >
                      {isMdDown ? (
                        <TableCell
                          align="left"
                          sx={{
                            textDecoration: cliente.Activo
                              ? "none"
                              : "line-through",
                          }}
                        >
                          {cliente.Nombre}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell
                            align="left"
                            sx={{
                              textDecoration: cliente.Activo
                                ? "none"
                                : "line-through",
                            }}
                          >
                            {cliente.Nombre}
                          </TableCell>
                          <TableCell align="left">{cliente.Estatus}</TableCell>
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
                                  onClick={() => handleOpenDialogEliminarCliente(cliente)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={cliente.Activo ? "Inactivar" : "Activar"}>
                                <Checkbox
                                  checked={cliente.Activo || false}
                                  sx={{ cursor: "pointer" }}
                                  onChange={() =>
                                    handleOpenDialogActivarInactivar(cliente)
                                  }
                                />
                              </Tooltip>
                              {cliente.Activo && (
                                <Tooltip
                                  title="Editar"
                                  onClick={() => handleOpenDialogEditarCliente(cliente)}
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
            labelRowsPerPage="Clientes por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          ></TablePagination>
        </>
      )}

      <DialogNuevoCliente
        open={openDialogNuevoCliente}
        handleClose={handleCloseDialogNuevoCliente}
        nombreCliente={nombreCliente}
        errorNombreCliente={errorNombreCliente}
        nombreClienteRef={nombreClienteRef}
        ingresarValoresMemoria={ingresarValoresMemoria}
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
        handleGuardarCliente={(e) =>
          handleGuardarCliente(
            e,
            nombreCliente,
            nombreClienteRef,
            setErrorNombreCliente,
            handleCloseDialogNuevoCliente,
            setPaginadorRequest,
            resetFormDialogNvoCliente
          )
        } //Use the hook function
      />

      <DialogEditarCliente
        open={openDialogEditarCliente}
        handleClose={handleCloseDialogEditarCliente}
        clienteToEdit={clienteToEdit}
        errorNombreClienteEdit={errorNombreClienteEdit}
        nombreClienteEditRef={nombreClienteEditRef}
        ingresarValoresMemoriaEdit={ingresarValoresMemoriaEdit}
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
        handleEditarCliente={(e) =>
          handleEditarCliente(
            e,
            clienteOriginalToEdit,
            clienteToEdit,
            nombreClienteEditRef,
            setErrorNombreClienteEdit,
            handleCloseDialogEditarCliente,
            setPaginadorRequest,
            resetFormDialogEditarCliente
          )
        }
      />

      <DialogEliminarCliente
        open={openDialogEliminarCliente}
        handleClose={handleCloseDialogEliminarCliente}
        selectedCliente={clienteToDelete}
        Transition={Transition}
        handleEliminarCliente={(e) =>
          handleEliminarCliente(
            e,
            clienteToDelete,
            handleCloseDialogEliminarCliente,
            setPaginadorRequest
          )
        }
      />

      <DialogActivarInactivarCliente
        open={openDialogActivarInactivar}
        handleClose={handleCloseDialogActivarInactivar}
        clienteToActiveInactive={clienteToActiveInactive}
        Transition={Transition}
        handleActivarInactivar={(e) =>
          handleActivarInactivarCliente(
            e,
            clienteToActiveInactive,
            handleCloseDialogActivarInactivar,
            setPaginadorRequest
          )
        } //Use the hook function
      />
    </div>
  );
};

export default ListadoClientes;
