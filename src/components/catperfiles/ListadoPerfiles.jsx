import React, { useEffect, useState, useRef, useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
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
  Stack,
  Slide,
  Paper,
  useMediaQuery,
  useTheme,
  TableSortLabel, // Import TableSortLabel
} from "@mui/material";

import style from "../Tool/style";
import useStyles from "../../styles/theme-style";
import ControlTyping from "../Tool/ControlTyping";
import { useStateValue } from "../../context/store";
import { perfilListadoAction } from "../../actions/PerfilAction";
import {
  useHandleGuardarPerfil,
  useHandleEditarPerfil,
  useHandleEliminarPerfil
} from "./hooks/HandlePerfil";
import {
  DialogNuevoPerfil,
  DialogEditarPerfil,
  DialogEliminarPerfil,
} from "./Dialogs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const maxLength = 150;

const ListadoPerfiles = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [textoBusquedaPerfil, setTextoBusquedaPerfil] = useState("");
  const typingBuscadorTexto = ControlTyping(textoBusquedaPerfil, 1500);

  const nombrePerfilRef = useRef(null);
  const nombrePerfilEditRef = useRef(null);
  const [errorNombrePerfil, setErrorNombrePerfil] = useState({ nombrePerfil: false });
  const [errorNombrePerfilEdit, setErrorNombrePerfilEdit] = useState({ nombrePerfil: false });
  const [listaPerfiles, setListaPerfiles] = useState([]);

  // Sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Nombre');

  // Variables para el Diaglog Nuevo Perfil.
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [openDialogNuevoPerfil, setOpenDialogNuevoPerfil] = useState(false);
  // Variables para el Editar Perfil
  const [openDialogEditarPerfil, setOpenDialogEditarPerfil] = useState(false);
  const [perfilToEdit, setPerfilToEdit] = useState(null);
  const [perfilOriginalToEdit, setPerfilOriginalToEdit] = useState(null);
  //Variables para el ButtonIcon Eliminar
  const [openDialogEliminarPerfil, setOpenDialogEliminarPerfil] = useState(false);
  const [perfilToDelete, setPerfilToDelete] = useState(null);


  // Use the custom hook (CRUD de Perfiles)
  const { handleGuardarPerfil } = useHandleGuardarPerfil();
  const { handleEliminarPerfil } = useHandleEliminarPerfil();
  const { handleEditarPerfil } = useHandleEditarPerfil();

  //INICIO. Variables constrol de Dialogs Abrir-Cerrar
  const handleOpenDialogNuevoPerfil = () => setOpenDialogNuevoPerfil(true);
  const handleCloseDialogNuevoPerfil = () => {
    setOpenDialogNuevoPerfil(false);
    resetFormDialogNvoPerfil();
  };

  const handleOpenDialogEditarPerfil = (perfil) => {
    // Add your logic here
    setPerfilToEdit(perfil);
    setPerfilOriginalToEdit({ ...perfil });
    setOpenDialogEditarPerfil(true);
  };
  const handleCloseDialogEditarPerfil = () => {
    setOpenDialogEditarPerfil(false);
    resetFormDialogEditarPerfil();
  };

  const handleOpenDialogEliminarPerfil = (perfil) => {
    // Add your logic here
    setPerfilToDelete(perfil);
    setOpenDialogEliminarPerfil(true);
  };

  const handleCloseDialogEliminarPerfil = () => {
    setOpenDialogEliminarPerfil(false);
    setPerfilToDelete(null);
  };
  //FIN. Variables control de Dialogs Abrir-Cerrar


  //Binding TextField Nuevo Perfil
  const ingresarValoresMemoria = e => {
    let value = e.target.value;
    setNombrePerfil(value);

    if (value && errorNombrePerfil.nombrePerfil) {
      setErrorNombrePerfil({ nombrePerfil: false });
    }
  };
  //Binding TextField Editar Perfil
  const ingresarValoresMemoriaEdit = e => {
    let value = e.target.value;
    setPerfilToEdit({
      ...perfilToEdit,
      Nombre: e.target.value.toUpperCase(),
    });

    if (value && errorNombrePerfilEdit.nombrePerfilEdit) {
      setErrorNombrePerfilEdit({ nombrePerfilEdit: false });
    }
  };


  const resetFormDialogNvoPerfil = () => {
    setNombrePerfil("");
    setErrorNombrePerfil({ nombrePerfil: false });
  };
  const resetFormDialogEditarPerfil = () => {
    setPerfilToEdit(null);
    setErrorNombrePerfilEdit({ nombrePerfilEdit: false });
    setPerfilOriginalToEdit(null);
  };


  //Variables y funciones para sort label.  Sorting functions
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sortComparator = (a, b) => {
    if (b[orderBy] < a[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (b[orderBy] > a[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const sortedListaPerfiles = listaPerfiles.slice().sort(sortComparator);


  const obtenerListaPerfiles = useCallback(async () => {
    setLoading(true);
    let tituloVariant = "";

    if (typingBuscadorTexto) {
      tituloVariant = typingBuscadorTexto;
    }

    const objetoRequest = {
      nombre: tituloVariant
    };

    //Debe tener al menos dos caracteres el valor "nombre".
    if (objetoRequest.nombre !== "" && objetoRequest.nombre.length <= 1) {
      setLoading(false);
      return;
    }

    try {
      const response = await perfilListadoAction(objetoRequest);
      setListaPerfiles(response.data);
    } catch (error) {
      let errorMessage = error.response?.data?.errors?.msg || "Ocurrió un error al obtener la información.";
      setListaPerfiles([]);
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: errorMessage,
          severity: "error",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [typingBuscadorTexto, dispatch]);

  useEffect(() => {
    obtenerListaPerfiles();
  }, [obtenerListaPerfiles]);

  return (
    <div style={style.table}>
      <Typography component="h1" variant="h5">
        Listado de Perfiles
      </Typography>

      <Grid2 container style={style.tableGridContainer}>
        <Grid2 size={{ xs: 12, sm: 8, md: 8 }}>
          <TextField
            fullWidth
            name="textoBusquedaPerfil"
            variant="outlined"
            label="Buscar"
            maxLength={maxLength}
            onChange={(e) => setTextoBusquedaPerfil(e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box display="flex" justifyContent="center">
            <Tooltip title="Nuevo Perfil">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon sx={{ fontSize: 30 }}>add_circle</Icon>}
                sx={{ padding: "13px 30px" }}
                onClick={handleOpenDialogNuevoPerfil}
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
                        active={orderBy === 'Nombre'}
                        direction={orderBy === 'Nombre' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'Nombre')}
                      >
                        Perfil
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === 'Nombre'}
                          direction={orderBy === 'Nombre' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'Nombre')}
                        >
                          Perfil
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Acción
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedListaPerfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMdDown ? 1 : 2} align="center">
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
                  sortedListaPerfiles.map((perfil) => (
                    <TableRow
                      key={perfil.PerfilId}
                    >
                      {isMdDown ? (
                        <TableCell
                          align="left"
                        >
                          {perfil.Nombre}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell
                            align="left"
                          >
                            {perfil.Nombre}
                          </TableCell>
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
                                  onClick={() => handleOpenDialogEliminarPerfil(perfil)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Editar"
                                onClick={() => handleOpenDialogEditarPerfil(perfil)}
                              >
                                <IconButton
                                  aria-label="edit"
                                  sx={{ cursor: "pointer" }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
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
        </>
      )}

      <DialogNuevoPerfil
        open={openDialogNuevoPerfil}
        handleClose={handleCloseDialogNuevoPerfil}
        nombrePerfil={nombrePerfil}
        errorNombrePerfil={errorNombrePerfil}
        nombrePerfilRef={nombrePerfilRef}
        ingresarValoresMemoria={ingresarValoresMemoria}
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
        handleGuardarPerfil={async (e) => {
          await handleGuardarPerfil(
            e,
            nombrePerfil,
            nombrePerfilRef,
            setErrorNombrePerfil,
            handleCloseDialogNuevoPerfil,
            resetFormDialogNvoPerfil,
            obtenerListaPerfiles
          );
        }} //Use the hook function/Use the hook function
      />

      <DialogEditarPerfil
        open={openDialogEditarPerfil}
        handleClose={handleCloseDialogEditarPerfil}
        perfilToEdit={perfilToEdit}
        errorNombrePerfilEdit={errorNombrePerfilEdit}
        nombrePerfilEditRef={nombrePerfilEditRef}
        ingresarValoresMemoriaEdit={ingresarValoresMemoriaEdit}
        loading={loading}
        maxLength={maxLength}
        Transition={Transition}
        handleEditarPerfil={(e) =>
          handleEditarPerfil(
            e,
            perfilOriginalToEdit,
            perfilToEdit,
            nombrePerfilEditRef,
            setErrorNombrePerfilEdit,
            handleCloseDialogEditarPerfil,
            resetFormDialogEditarPerfil,
            obtenerListaPerfiles
          )
        }
      />

      <DialogEliminarPerfil
        open={openDialogEliminarPerfil}
        handleClose={handleCloseDialogEliminarPerfil}
        perfilSeleccionado={perfilToDelete}
        Transition={Transition}
        handleEliminarPerfil={async e => {
          await handleEliminarPerfil(
            e,
            perfilToDelete,
            handleCloseDialogEliminarPerfil,
            obtenerListaPerfiles
          );
        }}
      />

    </div>
  )
}

export default ListadoPerfiles;