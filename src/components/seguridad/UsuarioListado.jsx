import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
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

import style from "../Tool/style";
import useStyles from "../../styles/theme-style";
import { PathsUrl } from '../../utils/Paths';
import ControlTyping from "../Tool/ControlTyping";
import { useStateValue } from "../../context/store";
import { paginacionUsuarioAction } from "../../actions/UsuarioAction";
import {
  useHandleEliminarUsuario,
  useHandleActivarInactivarUsuario,
} from "./hooks/HandleUsuario";
import {
  DialogActivarInactivarUsuario,
  DialogEliminarUsuario,
} from "./Dialogs";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const UsuariosListado = () => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();

  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const navigate = useNavigate();
  //Textos de busqueda.
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const typingBuscadorTexto = ControlTyping(textoBusqueda, 1200);//1.2 segundos se dispara el buscador.

  //Variable para el Checkbox Objeto Usuario Activar/Inactivar
  const [usuarioToActiveInactive, setUsuarioToActiveInactive] = useState(null);
  //Variable para el Dialog Eliminar Objeto Usuario
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);


  // Use the custom hook (CRUD de usuarios)
  const { handleActivarInactivarUsuario } = useHandleActivarInactivarUsuario();
  const { handleEliminarUsuario } = useHandleEliminarUsuario();


  const handleNuevoUsuario = e => {
    e.preventDefault();
    // Replace with the actual path to RegistrarUsuario.jsx
    navigate(PathsUrl.UsuarioCaptura);
  };

  const handleEditarUsuario = (e, usuarioId) => {
    e.preventDefault();
    // Replace with the actual path to RegistrarUsuario.jsx
    navigate(`${PathsUrl.UsuarioCaptura}/${usuarioId}`);
  }

  //---->INICIO - Variables para funciones de los Dialogs <----
  const [openDialogEliminarUsuario, setOpenDialogEliminarUsuario] = useState(false);
  const handleOpenDialogEliminarUsuario = usuario => {
    setOpenDialogEliminarUsuario(true);
    setUsuarioToDelete(usuario);
  }
  const handleCloseDialogEliminarUsuario = () => {
    setOpenDialogEliminarUsuario(false);
    setUsuarioToDelete(null);
  };

  const [openDialogActivarInactivarUsuario, setOpenDialogActivarInactivarUsuario] = useState(false);
  const handleOpenDialogActivarInactivarUsuario = usuario => {
    setOpenDialogActivarInactivarUsuario(true);
    setUsuarioToActiveInactive(usuario);
  }

  const handleCloseDialogActivarInactivarUsuario = () => {
    setOpenDialogActivarInactivarUsuario(false);
    setUsuarioToActiveInactive(null);
  };
  //---->FIN- Variables para funciones de los Dialogs <----


  const [paginadorRequest, setPaginadorRequest] = useState({
    nombre: "",
    email: "",
    username: "",
    fechaInicio: null,
    fechaFin: null,
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
  const sortedRecords = [...paginadorResponse.listaRecords].sort((a, b) => {
    if (orderBy === "Nombre") {
      if (order === "asc") {
        return a.NombreCompleto.localeCompare(b.NombreCompleto);
      } else {
        return b.NombreCompleto.localeCompare(a.NombreCompleto);
      }
    } else if (orderBy === "Usuario") {
      if (order === "asc") {
        return a.Usuario.localeCompare(b.Usuario);
      } else {
        return b.Usuario.localeCompare(a.Usuario);
      }
    }
    else if (orderBy === "Perfil") {
      if (order === "asc") {
        return a.Perfil?.nombre.localeCompare(b.Perfil?.nombre);
      } else {
        return b.Perfil?.nombre.localeCompare(a.Perfil?.nombre);
      }
    }
    return 0;
  });
  const handleRequestSort = (event, property) => {
    event.preventDefault();
    //const targetClassName = event.target.className || "";
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };


  //Funciones de Paginación. <------
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


  useEffect(() => {
    const obtenerListaUsuarios = async () => {
      setLoading(true);

      let textoBuscar = "";
      let paginaVariant = paginadorRequest.numeroPagina + 1;

      if (typingBuscadorTexto) {
        textoBuscar = typingBuscadorTexto;
        paginaVariant = 1;
      }

      const objetoPaginadorRequest = {
        TextoBuscar: textoBuscar,
        numeroPagina: paginaVariant,
        cantidadElementos: paginadorRequest.cantidadElementos,
      };

      try {
        const response = await paginacionUsuarioAction(objetoPaginadorRequest);
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
    obtenerListaUsuarios();

    setUsuarioSesion(sesionUsuario.usuario);

  }, [paginadorRequest, dispatch, typingBuscadorTexto, sesionUsuario]);


  return (
    <div style={style.table}>
      <Typography component="h1" variant="h5">
        Listado de Usuarios
      </Typography>

      <Grid2 container style={style.tableGridContainer}>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            fullWidth
            name="textoBusquedaNombre"
            variant="outlined"
            label="Buscar por nombre, usuario o correo"
            onChange={(e) => setTextoBusqueda(e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}></Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
          <Box display="flex" justifyContent="right">
            <Tooltip title="Nuevo Usuario">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon sx={{ fontSize: 30 }}>add_circle</Icon>}
                sx={{ padding: "13px 30px" }}
                onClick={handleNuevoUsuario}
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
          <Typography variant="body1" color="textSecondary" sx={{ marginRight: 2 }}>
            Cargando...
          </Typography>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Table aria-label="customized table">
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
                        Nombre
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Foto
                      </TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "Nombre"}
                          direction={orderBy === "Nombre" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "Nombre")}
                        >
                          Nombre
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "Usuario"}
                          direction={orderBy === "Usuario" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "Usuario")}
                        >
                          Usuario
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "Perfil"}
                          direction={orderBy === "Perfil" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "Perfil")}
                        >
                          Perfil
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold" }}>
                        Correo
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
                    <TableCell colSpan={isMdDown ? 1 : 6} align="center" sx={{ width: "100%" }}>
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
                  sortedRecords.map((usuario) => {
                    let fotoPerfil = usuario.Documento;
                    const fotoPerfilURL = fotoPerfil && fotoPerfil.data
                      ? "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data
                      : "";

                    return (
                      <TableRow
                        key={usuario.UsuarioId}
                        sx={{
                          backgroundColor: usuario.Activo ? "inherit" : "#ffebee", // Change background color if inactive
                          "&:nth-of-type(odd)": {
                            backgroundColor: usuario.Activo ? "#f9f9f9" : "#ffcdd2",
                          },
                          "&:hover": {
                            backgroundColor: usuario.Activo ? "#e0f7fa" : "#ef9a9a",
                          },
                        }}
                      >
                        {isMdDown ? (
                          <TableCell
                            align="left"
                            sx={{
                              textDecoration: usuario.Activo
                                ? "none"
                                : "line-through",
                            }}
                          >
                            {usuario.NombreCompleto}
                          </TableCell>
                        ) : (
                          <>
                            <TableCell align="center">
                              <Avatar
                                alt={usuario.NombreCompleto} src={fotoPerfilURL || undefined}
                                sx={{ marginRight: 2 }}
                                style={{ margin: "0 auto", backgroundColor: "#1976d2" }}
                              >
                                {!fotoPerfilURL && usuario.Usuario // Si no hay fotoPerfilURL, mostrar iniciales
                                  //.split(" ") // Dividir el nombre completo en palabras
                                  //.map((word) => word[0]) // Tomar la primera letra de cada palabra
                                  //.join("") // Unir las iniciales
                                  .toUpperCase()
                                  .slice(0, 2) // Limitar a las dos primeras letras
                                } {/* Convertir a mayúsculas */}
                              </Avatar>
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                textDecoration: usuario.Activo
                                  ? "none"
                                  : "line-through",
                              }}
                            >
                              {usuario.NombreCompleto}
                            </TableCell>
                            <TableCell align="left">{usuario.Usuario}</TableCell>
                            <TableCell align="left">{usuario.Perfil?.nombre}</TableCell>
                            <TableCell align="left">{usuario.Correo}</TableCell>
                            <TableCell align="left">{usuario.Estatus}</TableCell>
                            <TableCell align="center">
                              {/* Si es el Usuario en Sesión, no debe permitir ejecutar acciones sobre sus datos */}
                              {usuarioSesion.usuarioId !== usuario.UsuarioId && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Tooltip title="Eliminar">
                                    <IconButton
                                      aria-label="delete"
                                      disabled={!usuario.Activo}
                                      onClick={() => handleOpenDialogEliminarUsuario(usuario)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={usuario.Activo ? "Inactiva" : "Activar"}>
                                    <Checkbox
                                      checked={usuario.Activo || false}
                                      sx={{ cursor: "pointer" }}
                                      onChange={() => handleOpenDialogActivarInactivarUsuario(usuario)}
                                    />
                                  </Tooltip>
                                  {usuario.Activo && (
                                    <Tooltip
                                      title="Editar"
                                      onClick={(e) => handleEditarUsuario(e, usuario.UsuarioId)}
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
                              )}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })
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
            labelRowsPerPage="Usuarios por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          ></TablePagination>
        </>
      )}


      <DialogActivarInactivarUsuario
        open={openDialogActivarInactivarUsuario}
        handleClose={handleCloseDialogActivarInactivarUsuario}
        handleActivarInactivar={(e) =>
          handleActivarInactivarUsuario(
            e,
            usuarioToActiveInactive,
            handleCloseDialogActivarInactivarUsuario,
            setPaginadorRequest,
            sesionUsuario
          )
        }
        usuarioToActiveInactive={usuarioToActiveInactive}
        Transition={Transition}
      />

      <DialogEliminarUsuario
        open={openDialogEliminarUsuario}
        handleClose={handleCloseDialogEliminarUsuario}
        usuarioSeleccionado={usuarioToDelete}
        Transition={Transition}
        handleEliminarUsuario={(e) =>
          handleEliminarUsuario(
            e,
            usuarioToDelete,
            handleCloseDialogEliminarUsuario,
            setPaginadorRequest,
            sesionUsuario
          )
        }
      />

    </div>
  )
}

export default UsuariosListado;