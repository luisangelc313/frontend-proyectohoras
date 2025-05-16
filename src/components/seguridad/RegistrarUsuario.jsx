import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importa useNavigate
import MaskedInput from "react-text-mask";
//import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography
} from "@mui/material";
import Cancel from '@mui/icons-material/Cancel';
import Key from '@mui/icons-material/Key';
import SaveIcon from '@mui/icons-material/Save';
import ClearAll from '@mui/icons-material/ClearAll';
import Edit from '@mui/icons-material/Edit';

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';

import style from "../Tool/style";
import { PathsUrl } from '../../utils/Paths';
import { useStateValue } from "../../context/store";
import {
  obtenerUsuarioPorID,
} from '../../actions/UsuarioAction';
import {
  useHandleGuardarUsuario,
  useValidarModificacionesModeloCaptura,
} from "./hooks/HandleUsuario";
import {
  DialogGuardarUsuario,
  DialogCancelarGuardarUsuario,
} from "./Dialogs";

dayjs.locale('es'); // Configurar el idioma español

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RegistrarUsuario = () => {
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación
  const { id } = useParams(); // Obtiene el parámetro "UsuarioId" de la URL

  const [loading, setLoading] = useState(false);
  const [ocultarSeccionSeguridad, setOcultarSeccionSeguridad] = useState(false);
  const [ocultarBtnLimpiar, setOcultarBtnLimpiar] = useState(false);
  const [usuarioNoEncontrado, setUsuarioNoEncontrado] = useState(false);
  const [habilitarChckActivo, setHabilitarChckActivo] = useState(false);

  const [modoEdicionDeshabilitada, setModoEdicionDeshabilitada] = useState(true);
  const [esEdicion, setEsEditar] = useState(false);

  const { handleGuardarUsuario } = useHandleGuardarUsuario();
  const handleValidarModificacionesModelo = useValidarModificacionesModeloCaptura();

  const [{ sesionUsuario }, dispatch] = useStateValue();
  const originalUsuario = useRef(null); // Variable para guardar el estado original de usuario
  const [usuario, setUsuario] = useState({
    NombreCompleto: "",
    Email: "",
    Username: "",
    NumeroTelefono: "",
    Password: "",
    ConfirmarPassword: "",
    PerfilId: "",
    Perfiles: [],
    PasswordDefault: "",
    Activo: true,
    RangoHoraPorDia: [],
    RangoCapturaPorDiaInicio: [],
    RangoCapturaPorDiaFin: [],
    Config: null
  });

  const [errors, setErrors] = useState({
    NombreCompleto: false,
    Email: false,
    Username: false,
    PerfilId: false,
    Password: false,
    ConfirmarPassword: false,
  });

  const validarFormulario = esEditar => {
    const nuevosErrores = {
      NombreCompleto: usuario.NombreCompleto.trim() === "",
      Email: usuario.Email.trim() === "",
      Username: usuario.Username.trim() === "",
      Password: !esEditar && usuario.Password.trim() === "",
      PerfilId: usuario.PerfilId.trim() === "" || usuario.PerfilId.trim() === "00000000-0000-0000-0000-000000000000",
      ConfirmarPassword: !esEditar && (usuario.ConfirmarPassword.trim() === "" || usuario.Password !== usuario.ConfirmarPassword),
    };
    setErrors(nuevosErrores);
    return !Object.values(nuevosErrores).some((error) => error);
  };


  const capitalizeWords = str => str.replace(/\b\w/g, (char) => char.toUpperCase());

  //Eventos de los Controles INPUT (textbox, select, checkbox).
  const ingresarValoresMemoria = e => {
    const { name, value } = e.target;

    setUsuario((anterior) => ({
      ...anterior,
      [name]: value,
      //NombreCompleto : 'Luis Angel CR'//Solo fue prueba
    }));

    if (name === "NombreCompleto") {
      const capitalizedValue = capitalizeWords(value);
      setUsuario({ ...usuario, [name]: capitalizedValue });
    }

    // Validar errores dinámicamente
    setErrors((prevErrors) => {
      const nuevosErrores = { ...prevErrors };

      // Si el campo está vacío, no marcar error
      if (value.trim() === "") {
        nuevosErrores[name] = false;
        if (name === "Password" || name === "ConfirmarPassword") {
          nuevosErrores["Password"] = false;
          nuevosErrores["ConfirmarPassword"] = false;
        }
      } else if (name === "ConfirmarPassword") {
        // Validar si la confirmación de contraseña coincide con la contraseña
        nuevosErrores[name] = value !== usuario.Password;
        if (value === usuario.Password) {
          nuevosErrores["Password"] = false;
        }
      } else if (name === "Password") {
        // Validar si la contraseña coincide con la confirmación de contraseña
        nuevosErrores["ConfirmarPassword"] = usuario.ConfirmarPassword !== value;
        nuevosErrores[name] = value === "";
      } else {
        // Para otros campos, no marcar error
        nuevosErrores[name] = false;
      }

      return nuevosErrores;
    });
  }

  const handleChangePerfil = e => {
    const { value } = e.target;
    setUsuario((anterior) => ({
      ...anterior,
      PerfilId: value
    }));

    if (usuario.PerfilId.trim() !== "" || usuario.PerfilId.trim() === "00000000-0000-0000-0000-000000000000") {
      setErrors((prevErrors) => {
        const nuevosErrores = { ...prevErrors };
        nuevosErrores["PerfilId"] = false;
        return nuevosErrores;
      });
    }
  }

  const handleChangeActivo = () => {
    setUsuario((anterior) => ({
      ...anterior,
      Activo: !anterior.Activo
    }));
  }

  const handleChangeExcederOchoHoras = e => {
    const { checked } = e.target;
    let horasPermitidasPorDiaOriginal = originalUsuario?.current?.config?.horasPermitidasPorDia || 8;

    setUsuario((anterior) => ({
      ...anterior,
      Config: {
        ...anterior.Config,
        excederOchoHoras: checked,
        horasPermitidasPorDia: checked ? horasPermitidasPorDiaOriginal : 8,
      }
    }));

    if (!checked && usuario.Config.horasPermitidasPorDia !== horasPermitidasPorDiaOriginal) {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Por default son 8 horas sino se excede de las 8 horas por día.",
          severity: "info",
          vertical: "bottom",
          horizontal: "left",
        },
      });
    }
  }

  const handleChangePermitirCapturaFinDeSemana = () => {
    setUsuario((anterior) => ({
      ...anterior,
      Config: {
        ...anterior.Config,
        permitirCapturaFinDeSemana: !anterior.Config?.permitirCapturaFinDeSemana
      }
    }));
  }

  const handleChangeMostrarCumpleanio = () => {
    setUsuario((anterior) => ({
      ...anterior,
      Config: {
        ...anterior.Config,
        mostrarCumpleanio: !anterior.Config?.mostrarCumpleanio
      }
    }));
  }

  const [, setFechaSeleccionada] = useState(null);
  const handleChangeCumpleanio = fechaSeleccionada => {
    setFechaSeleccionada(fechaSeleccionada);
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      Config: {
        ...prevUsuario.Config,
        fechaNacimiento: fechaSeleccionada,
      },
    }));
  }

  const handleChangeHorasPermitidasPorDia = e => {
    const { value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      Config: {
        ...prevUsuario.Config,
        horasPermitidasPorDia: value,
      },
    }));
  }


  //---->INICIO - Variables para funciones de los Dialogs <----
  const [openDialogGuardar, setOpenDialogGuardar] = useState(false);
  const handleOpenDialogGuardar = e => {
    e.preventDefault();

    //Validar si el modelo, es decir, los datos no tienenn modificaciones, no preguntar (abrir Dialog).
    const hasChanges = handleValidarModificacionesModelo(usuario, originalUsuario?.current);

    //Validar si el usuario es nuevo o se está editando.
    const esEditar = id && id === originalUsuario?.current?.id;

    if (!validarFormulario(esEditar)) {
      return false;
    }

    if (hasChanges) {
      setOpenDialogGuardar(true);

      if (esEditar) {
        usuario.usuarioId = id;
      }
    }
    else {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "No se detectaron cambios por guardar.",
          severity: "info",
          vertical: "bottom",
          horizontal: "left"
        },
      });
      setOpenDialogGuardar(false);
    }
  }
  const handleCloseDialogGuardar = () => setOpenDialogGuardar(false);

  const [openDialogCancelar, setOpenDialogCancelar] = useState(false);
  const handleCloseDialogCancelar = () => setOpenDialogCancelar(false);
  //Este evento lo ejecuta el botón Aceptar del Dialog Cancelar.
  const handleCancelarCapturaUsuario = e => {
    e.preventDefault();
    navigate(PathsUrl.UsuarioListado); //Redirecciona al Listado de Usuarios.
  }

  //---->FIN- Variables para funciones de los Dialogs <----


  //------>INICIO-Eventos de botones (CANCELAR, LIMPIAR, GUARDAR). <------
  const handleOpenDialogCancelar = e => {
    e.preventDefault();

    //Validar si el modelo, es decir, los datos no tienenn modificaciones, no preguntar (abrir Dialog).
    const hasChanges = handleValidarModificacionesModelo(usuario, originalUsuario?.current);

    if (hasChanges) {
      setOpenDialogCancelar(true);
    }
    else {
      navigate(PathsUrl.UsuarioListado); // Redirecciona al Listado de Usuarios.
    }
  }

  const handleGenerarContraseniaDefault = e => {
    e.preventDefault();
    setUsuario((anterior) => ({
      ...anterior,
      Password: usuario.PasswordDefault,
      ConfirmarPassword: usuario.PasswordDefault
    }));
  }
  const handleLimpiarFormulario = e => {
    e.preventDefault();
    const objUsuarioOriginalConfig = originalUsuario?.current?.config;
    setUsuario((anterior) => ({
      ...anterior,
      NombreCompleto: "",
      Email: "",
      Username: "",
      numeroTelefono: "",
      Password: "",
      ConfirmarPassword: "",
      PerfilId: "",
      Config: {
        excederOchoHoras: objUsuarioOriginalConfig?.excederOchoHoras || false,
        horasPermitidasPorDia: objUsuarioOriginalConfig?.horasPermitidasPorDia || 8,
        permitirCapturaFinDeSemana: objUsuarioOriginalConfig?.permitirCapturaFinDeSemana || false,
        mostrarCumpleanio: objUsuarioOriginalConfig?.mostrarCumpleanio || false,
        fechaNacimiento: null,
      }
    }));
  }

  const handleHabilitarModificacion = e => {
    e.preventDefault();
    setModoEdicionDeshabilitada(false);
  }

  //------> FIN-Eventos de botones (CANCELAR, LIMPIAR, GUARDAR) <------


  useEffect(() => {
    const obtenerUsuarioID = async usuarioId => {
      setLoading(false);

      try {
        const response = await obtenerUsuarioPorID(usuarioId);
        const usuarioData = response.data;

        //Nuevo Usuario
        if (usuarioData && !usuarioId) {
          setUsuario((anterior) => ({
            ...anterior,
            Perfiles: usuarioData.perfiles,
            RangoHoraPorDia: usuarioData.rangoHoraPorDia,
            PasswordDefault: usuarioData.passwordDefault,
            RangoCapturaPorDiaInicio: usuarioData.rangoCapturaPorDiaInicio,
            RangoCapturaPorDiaFin: usuarioData.rangoCapturaPorDiaFin,
            Config: usuarioData.config,
          }));

        } else if (usuarioData && usuarioData.id) { // Si el usuarioId existe, significa que estamos editando un usuario existente
          setOcultarSeccionSeguridad(true);
          setHabilitarChckActivo(true);
          setOcultarBtnLimpiar(true);
          setUsuario((anterior) => ({
            ...anterior,
            NombreCompleto: usuarioData.nombreCompleto,
            Email: usuarioData.email,
            Username: usuarioData.userName,
            numeroTelefono: usuarioData.phoneNumber,
            Activo: usuarioData.activo,
            PerfilId: usuarioData.perfilId,
            Perfiles: usuarioData.perfiles,
            RangoHoraPorDia: usuarioData.rangoHoraPorDia,
            PasswordDefault: usuarioData.passwordDefault,
            RangoCapturaPorDiaInicio: usuarioData.rangoCapturaPorDiaInicio,
            RangoCapturaPorDiaFin: usuarioData.rangoCapturaPorDiaFin,
            Config: {
              ...usuarioData.config
            }
          }));

          setEsEditar(true);

        } else {
          setUsuarioNoEncontrado(true);
        }

        originalUsuario.current = usuarioData;

      } catch /*(error)*/ {
        //console.error(error);
        setUsuarioNoEncontrado(true);

        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: 'Ocurrió un error al obtener la información.',
            severity: "error",
            vertical: "bottom",
            horizontal: "center"
          },
        });
      } finally {
        setLoading(false);
      }
    };

    //console.log("usuario en sesión:", sesionUsuario)
    const usuarioId = id ?? "";

    obtenerUsuarioID(usuarioId);
  }, [sesionUsuario, id, dispatch]);


  return (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Typography component="h1" variant="h5">
          Registro de Usuario
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : usuarioNoEncontrado ? (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="error" gutterBottom>
              Usuario no encontrado
            </Typography>
            <Typography variant="body1" color="textSecondary">
              No pudimos encontrar el usuario que estás buscando. Por favor, verifica la información o intenta nuevamente.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(PathsUrl.UsuarioListado)}
              sx={{ mt: 3 }}
            >
              Volver al listado de usuarios
            </Button>
          </Box>
        ) : (
          <form style={style.form}>
            <Grid2 container spacing={2}>
              {/* Nombre Completo */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  variant="outlined"
                  id="nombreCompleto"
                  label="Ingrese Nombre y Apellidos"
                  name="NombreCompleto"
                  required
                  fullWidth
                  autoFocus
                  onChange={ingresarValoresMemoria}
                  value={usuario.NombreCompleto}
                  error={errors.NombreCompleto}
                  disabled={esEdicion && modoEdicionDeshabilitada}
                  slotProps={{
                    htmlInput: { maxLength: 50 },
                  }}
                />
              </Grid2>
              {/* Correo Electrónico */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  variant="outlined"
                  type="email"
                  id="email"
                  label="Correo"
                  name="Email"
                  required
                  fullWidth
                  onChange={ingresarValoresMemoria}
                  value={usuario.Email}
                  error={errors.Email}
                  disabled={esEdicion && modoEdicionDeshabilitada}
                  slotProps={{
                    htmlInput: { maxLength: 50 },
                  }}
                />
              </Grid2>
              {/* Nombre de Usuario */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  variant="outlined"
                  id="username"
                  label="Nombre de Usuario"
                  name="Username"
                  required
                  fullWidth
                  onChange={ingresarValoresMemoria}
                  value={usuario.Username}
                  error={errors.Username}
                  disabled={esEdicion && modoEdicionDeshabilitada}
                  slotProps={{
                    htmlInput: { maxLength: 50 },
                  }}
                />
              </Grid2>
              {/* Número de Teléfono */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <MaskedInput
                  mask={[/*'+', '5', '2',*/' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                  className="form-control"
                  placeholder="Teléfono"
                  guide={false}
                  value={usuario.numeroTelefono || ""}
                  onChange={ingresarValoresMemoria}
                  render={(ref, props) => (
                    <TextField
                      variant="outlined"
                      type="text"
                      id="telefono"
                      label="Teléfono"
                      name="numeroTelefono"
                      fullWidth
                      disabled={esEdicion && modoEdicionDeshabilitada}
                      inputRef={ref}
                      {...props}
                      slotProps={{
                        htmlInput: { maxLength: 21 },
                        inputLabel: { shrink: Boolean(usuario.numeroTelefono) }, // Controla el comportamiento del label (para que no se encime el texto del label con el valor de la propiedad Teléfono)
                      }}
                    />
                  )}
                />
              </Grid2>
              {/* Perfiles */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl variant="outlined" fullWidth required>
                  <InputLabel id="perfil-label">Perfil</InputLabel>
                  <Select
                    labelId="perfil-label"
                    id="perfil"
                    name="PerfilId"
                    required
                    value={usuario.PerfilId}
                    onChange={handleChangePerfil}
                    disabled={esEdicion && modoEdicionDeshabilitada}
                    error={errors.PerfilId}
                    label="Perfil"
                  >
                    <MenuItem value="">
                      <em>Ninguno</em>
                    </MenuItem>
                    {usuario.Perfiles && usuario.Perfiles.length > 0 ? (
                      usuario.Perfiles.map((perfil) => (
                        <MenuItem key={perfil.perfilId} value={perfil.perfilId}>
                          {perfil.nombre}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No hay perfiles disponibles</em>
                      </MenuItem>
                    )}
                  </Select>
                  {errors.PerfilId && <FormHelperText sx={{ color: "red" }}>El perfil es obligatorio.</FormHelperText>}
                </FormControl>
              </Grid2>
              {/* Checkbox Activo */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!habilitarChckActivo || (esEdicion && modoEdicionDeshabilitada)}
                        checked={usuario.Activo}
                        name="Activo"
                        onChange={handleChangeActivo}
                      />
                    }
                    label="Activo"
                  />
                </Box>
              </Grid2>

              {/* Seguridad */}
              {!ocultarSeccionSeguridad && (
                <>
                  <Grid2 size={{ xs: 12, md: 12 }}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                        Seguridad
                      </Typography>
                      <Divider sx={{ flexGrow: 1 }} />
                    </Box>
                  </Grid2>
                  {/* Password */}
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      variant="outlined"
                      type="password"
                      id="password"
                      label="Contraseña"
                      name="Password"
                      onChange={ingresarValoresMemoria}
                      value={usuario.Password}
                      error={errors.Password}
                      helperText={errors.Password ? "La contraseña es obligatoria." : ""}
                      required
                      fullWidth
                      slotProps={{
                        htmlInput: { maxLength: 50 },
                      }}
                    />
                  </Grid2>
                  {/* Confirmar Password */}
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      variant="outlined"
                      type="password"
                      id="confirmacionpassword"
                      label="Confirmar Contraseña"
                      name="ConfirmarPassword"
                      onChange={ingresarValoresMemoria}
                      value={usuario.ConfirmarPassword}
                      error={errors.ConfirmarPassword}
                      helperText={
                        errors.ConfirmarPassword
                          ? "La confirmación de contraseña no coincide o está vacía."
                          : ""
                      }
                      required
                      fullWidth
                      slotProps={{
                        htmlInput: { maxLength: 50 },
                      }}
                    />
                  </Grid2>
                  {/* Botón para Generar Contraseña Defualt */}
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      size="medium"
                      fullWidth
                      style={style.submit}
                      onClick={handleGenerarContraseniaDefault}
                      startIcon={<Key />}
                    >
                      Generar Contraseña Default
                    </Button>
                  </Grid2>
                </>
              )}

              {/* Configuración Adicional */}
              <Grid2 size={{ xs: 12, md: 12 }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                    Configuración Adicional
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>
              </Grid2>
              {/* Exceder 8 horas por día */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={usuario.Config?.excederOchoHoras || false}
                        name="ExcederOchoHoras"
                        onChange={handleChangeExcederOchoHoras}
                        disabled={esEdicion && modoEdicionDeshabilitada}
                      />
                    }
                    label="Exceder ocho horas por día"
                  />
                </Box>
              </Grid2>
              {/* Selectbox Horas Permitidas por Día */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="horas-por-dia">Horas permitidas por día</InputLabel>
                  <Select
                    labelId="horas-por-dia"
                    id="horasPorDia"
                    name="horasPermitidasPorDia"
                    disabled={!usuario.Config?.excederOchoHoras || (esEdicion && modoEdicionDeshabilitada)}
                    value={usuario.Config?.horasPermitidasPorDia || 8}
                    onChange={handleChangeHorasPermitidasPorDia}
                    label="Horas Permitidas por Día"
                  >
                    <MenuItem value="">
                      <em>Ninguno</em>
                    </MenuItem>
                    {usuario.RangoHoraPorDia && usuario.RangoHoraPorDia.length > 0 ? (
                      usuario.RangoHoraPorDia.map((perfil) => (
                        <MenuItem key={perfil.value} value={perfil.value}>
                          {perfil.text}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No hay perfiles disponibles</em>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid2>
              {/* Permitir Captura de fin de semana */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={usuario.Config?.permitirCapturaFinDeSemana || false}
                        name="PermitirCapturaFinDeSemana"
                        onChange={handleChangePermitirCapturaFinDeSemana}
                        disabled={esEdicion && modoEdicionDeshabilitada}
                      />
                    }
                    label="Permitir captura de fin de semana"
                  />
                </Box>
              </Grid2>
              {/* selectbox's Rango de captura por día */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Grid2 container spacing={3}>
                  <Grid2 size="grow">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="lblHoraRangoInicio">De</InputLabel>
                      <Select
                        labelId="lblHoraRangoInicio"
                        id="lblHoraRangoInicioSelect"
                        name="horaRangoInicio"
                        label="De"
                        disabled
                        value={usuario.Config?.horaRangoInicio || 1}
                      //onChange={handleChangeHorasPermitidasPorDia}
                      >
                        {Array.isArray(usuario.RangoCapturaPorDiaInicio) &&
                          usuario.RangoCapturaPorDiaInicio.map((item, index) => (
                            <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
                          ))
                        }
                      </Select>
                      <FormHelperText>Rango de captura por día</FormHelperText>
                    </FormControl>
                  </Grid2>
                  <Grid2 size="grow">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="lblHoraRangoFin">A</InputLabel>
                      <Select
                        labelId="lblHoraRangoFin"
                        id="lblHoraRangoFinSelect"
                        name="horaRangoFin"
                        disabled
                        value={usuario.Config?.horaRangoFin || 8}
                        //onChange={handleChangeHorasPermitidasPorDia}
                        label="A"
                      >
                        <MenuItem value="">
                          <em>Ninguno</em>
                        </MenuItem>
                        {Array.isArray(usuario.RangoCapturaPorDiaFin) &&
                          usuario.RangoCapturaPorDiaFin.map((item, index) => (
                            <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
                          ))
                        }
                      </Select>
                      {/* <FormHelperText>Fin de rango por día</FormHelperText> */}
                    </FormControl>
                  </Grid2>
                </Grid2>
              </Grid2>
              {/* Checkbox mostrar cummpleaños */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={usuario.Config?.mostrarCumpleanio || false}
                      name="MostrarCumpleanio"
                      onChange={handleChangeMostrarCumpleanio}
                      disabled={esEdicion && modoEdicionDeshabilitada}
                    />
                  }
                  label="Mostrar Cumpleaños"
                />
              </Grid2>
              {/* Datetime Fecha Nacimineto para seleccionar o escribir */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    label="Fecha nacimiento (cumpleaños)"
                    value={usuario.Config?.fechaNacimiento ? dayjs(usuario.Config.fechaNacimiento) : null}
                    onChange={handleChangeCumpleanio}
                    disabled={esEdicion && modoEdicionDeshabilitada}
                    maxDate={dayjs()}
                    slotProps={{ textField: { fullWidth: true } }}
                    //disabled={!usuario.Config?.mostrarCumpleanio}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid2>
            </Grid2>
            <Divider sx={{ marginTop: 5 }} />
            {/* sección de botones (Limpiar, Cancelar, Guardar) */}
            <Grid2 container spacing={3} sx={{ marginTop: 3 }}>
              <Grid2 size="grow">
                {!ocultarBtnLimpiar && (<Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={handleLimpiarFormulario}
                  fullWidth
                  style={style.submit}
                  startIcon={<ClearAll />}
                >
                  Limpiar
                </Button>
                )}
                {esEdicion && modoEdicionDeshabilitada && (
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    onClick={handleHabilitarModificacion}
                    fullWidth
                    style={style.submit}
                    startIcon={<Edit />}
                  >
                    Habilitar Modificación
                  </Button>
                )}
              </Grid2>
              <Grid2 size={4}>
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  size="medium"
                  disabled={esEdicion && modoEdicionDeshabilitada}
                  onClick={handleOpenDialogCancelar}
                  fullWidth
                  style={style.submit}
                  startIcon={<Cancel />}
                >
                  Cancelar
                </Button>
              </Grid2>
              <Grid2 size="grow">
                <Grid2 size={12}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    size="medium"
                    disabled={esEdicion && modoEdicionDeshabilitada}
                    onClick={handleOpenDialogGuardar}
                    fullWidth
                    style={style.submit}
                    startIcon={<SaveIcon />}
                  >
                    Guardar
                  </Button>
                </Grid2>
              </Grid2>
            </Grid2>
          </form>
        )}

        <DialogGuardarUsuario
          open={openDialogGuardar}
          handleClose={handleCloseDialogGuardar}
          handleGuardar={() => (
            handleGuardarUsuario(
              usuario,
              originalUsuario?.current,
              dispatch,
              handleCloseDialogGuardar,
              sesionUsuario
            )
          )}
          Transition={Transition}
          loading={loading}
        />

        <DialogCancelarGuardarUsuario
          open={openDialogCancelar}
          handleClose={handleCloseDialogCancelar}
          handleCancelar={handleCancelarCapturaUsuario}
          Transition={Transition}
        />

      </div>
    </Container>
  );
};

export default RegistrarUsuario;
