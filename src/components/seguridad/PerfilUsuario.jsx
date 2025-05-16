import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import MaskedInput from 'react-text-mask';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import Cancel from '@mui/icons-material/Cancel';
import Key from '@mui/icons-material/Key';
import {
  Avatar,
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';
import dayjs from 'dayjs';

import style from "../Tool/style";
import StyleImg from "./../Tool/imageUtils/imageStyle";
import ImageUploadingButton from "./../Tool/imageUtils/ImageUploadingButton";
import ImageCropper from "./../Tool/imageUtils/ImageCropper";
import { useStateValue } from "../../context/store";
//import reactFoto from "../../assets/react.svg";
import {
  handleCropComplete,
  useHandleGuardarMiPerfil,
  useValidarModificacionesModelo,
} from "./hooks/HandleUsuario";
import {
  DialogCancelar,
  DialogGuardar,
  DialogEditarPwd,
} from "./Dialogs";

dayjs.locale('es'); // Configurar el idioma español

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const PerfilUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [mostrarBtnGuardar, setMostrarBtnGuardar] = useState(false);

  const handleValidarModificacionesModelo = useValidarModificacionesModelo();
  const { handleGuardarMiPerfil } = useHandleGuardarMiPerfil();
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación

  const originalUsuario = useRef(null); // Variable para guardar el estado original de usuario
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    nombreCompleto: "",
    email: "",
    username: "",
    numeroTelefono: "",
    imagenPerfil: null,
    fotoUrl: "",
    usuarioConfig: null
  });


  const handleChangeExcederOchoHoras = (e) => {
    //setExcederOchoHoras(e.target.checked);
    const { checked } = e.target;
    let horasPermitidasPorDiaOriginal = originalUsuario?.current?.usuarioConfig?.horasPermitidasPorDia || 8;

    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      usuarioConfig: {
        ...prevUsuario.usuarioConfig,
        excederOchoHoras: checked,
        horasPermitidasPorDia: checked ? horasPermitidasPorDiaOriginal : 8,
      },
    }));

    if (!checked) {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Por default son 8 horas sino se excede de las 8 horas por día.",
          severity: "info",
        },
      });
    }

  };

  const handleChangePermitirCapturaFinDeSemana = (e) => {
    const { checked } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      usuarioConfig: {
        ...prevUsuario.usuarioConfig,
        permitirCapturaFinDeSemana: checked,
      },
    }));
  };

  const handleChangeHoraRangoInicio = (event) => {
    const { value } = event.target;
    setUsuario((prevUsuario) => {
      const newUsuario = {
        ...prevUsuario,
        usuarioConfig: {
          ...prevUsuario.usuarioConfig,
          horaRangoInicio: value,
        },
      };

      // Validar que "Hora Rango INICIO" no sea mayor que "Hora Rango FIN"
      if (newUsuario.usuarioConfig.horaRangoInicio >= newUsuario.usuarioConfig.horaRangoFin) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Hora Rango Inicio no puede ser mayor o igual que la Hora Rango Fin.",
            severity: "warning",
          },
        });

        // Regresar el valor original
        return {
          ...prevUsuario,
          usuarioConfig: {
            ...prevUsuario.usuarioConfig,
            horaRangoInicio: prevUsuario.usuarioConfig.horaRangoInicio,
          },
        };
      }

      return newUsuario;
    });
  };

  const handleChangeHoraRangoFin = (event) => {
    const { value } = event.target;
    setUsuario((prevUsuario) => {
      const newUsuario = {
        ...prevUsuario,
        usuarioConfig: {
          ...prevUsuario.usuarioConfig,
          horaRangoFin: value,
        },
      };

      // Validar que "Hora Rango FIN" no sea menor que "Hora Rango INICIO"
      if (newUsuario.usuarioConfig.horaRangoFin <= newUsuario.usuarioConfig.horaRangoInicio) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Hora Rango Fin no puede ser menor o igual que la Hora Rango Inicio.",
            severity: "warning",
          },
        });

        // Regresar el valor original
        return {
          ...prevUsuario,
          usuarioConfig: {
            ...prevUsuario.usuarioConfig,
            horaRangoFin: prevUsuario.usuarioConfig.horaRangoFin,
          },
        };
      }

      return newUsuario;
    });
  };


  const handleChangeMostrarCumpleanio = (e) => {
    const { checked } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      usuarioConfig: {
        ...prevUsuario.usuarioConfig,
        mostrarCumpleanio: checked,
      },
    }));
  };

  const [/*fechaSeleccionada*/, setFechaSeleccionada] = useState(null);
  const handleChangeCumpleanio = (newDate) => {
    //setFechaSeleccionada(newDate); //Store the selected date in state
    ////console.log(setFechaSeleccionada(dayjs(newDate).format("DD-MM-YYYY"))); // Log or use the formatted date
    setFechaSeleccionada(newDate); // Store the selected date in state
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      usuarioConfig: {
        ...prevUsuario.usuarioConfig,
        fechaNacimiento: newDate,
      },
    }));
  };

  const handleChangeHorasPermitidasPorDia = (event) => {
    const { value } = event.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      usuarioConfig: {
        ...prevUsuario.usuarioConfig,
        horasPermitidasPorDia: value,
      },
    }));
  };


  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target;
    setUsuario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };


  const handleEditarMiPerfil = e => {
    e.preventDefault();
    setInputDisabled(false);
    setMostrarBtnGuardar(true);
  }


  //---->Variables para funciones del Dialog <----
  const [openDialogCancelar, setOpenDialogCancelar] = useState(false);

  const handleOpenDialogCancelar = () => {
    //usuario.password = usuario.password || "";
    //usuario.confirmarPassword = usuario.confirmarPassword || "";

    //Validar si el modelo, es decir, los datos no tienenn modificaciones, no preguntar (abrir Dialog).
    const hasChanges = handleValidarModificacionesModelo(usuario, originalUsuario?.current);
    if (hasChanges) {
      setOpenDialogCancelar(true);
    } else {
      navigate('/'); // Redirige al inicio si no hay cambios
    }
  };
  const handleCloseDialogCancelar = () => {
    setOpenDialogCancelar(false);
  };

  //Este evento lo ejecuta el botón Aceptar del Dialog Cancelar.
  const handleCancelarEditarMiPerfil = e => {
    e.preventDefault();
    navigate('/'); // Redirige al inicio
  }

  const [openDialogGuardar, setOpenDialogGuardar] = useState(false);
  const handleOpenDialogGuardar = () => {
    //Validar si el modelo, es decir, los datos no tienenn modificaciones, no preguntar (abrir Dialog).
    const hasChanges = handleValidarModificacionesModelo(usuario, originalUsuario?.current);

    if (hasChanges)
      setOpenDialogGuardar(true);
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
  };

  const handleCloseDialogGuardar = () => {
    setOpenDialogGuardar(false);
  };


  const [openDialogEditarPwd, setOpenDialogEditarPwd] = useState(false);
  const handleOpenDialogEditarPwd = () => {
    setOpenDialogEditarPwd(true);
  }
  const handleCloseDialogEditarPwd = () => {
    setOpenDialogEditarPwd(false);
  };
  //---->Variables para funciones del Dialog <----


  const [image, setImage] = useState([]);
  const [imageObjectFile, setImageObjectFile] = useState({});
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);


  useEffect(() => {
    setLoading(true);

    setUsuario(sesionUsuario.usuario);
    //Guardar el estado original de usuario
    originalUsuario.current = {
      ...sesionUsuario.usuario,
      fotoUrl: sesionUsuario.usuario.imagenPerfil,
    };

    setUsuario((anterior) => ({
      ...anterior,
      fotoUrl: sesionUsuario.usuario.imagenPerfil,
      imagenPerfil: null,
    }));

    setLoading(false);
  }, [sesionUsuario]);

  return (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Avatar style={style.avatar} src={usuario.fotoUrl || ""} />
        <Typography component="h1" variant="h5">
          Mis Datos de Perfil
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <form style={style.form}>
            <Grid2 container spacing={2}>
              {/* Nombre Completo */}
              <Grid2 size={{ xs: 12, md: 12 }}>
                <TextField
                  variant="outlined"
                  id="nombreCompleto"
                  label="Ingrese nombre y apellidos"
                  name="nombreCompleto"
                  required
                  fullWidth
                  autoFocus
                  disabled={inputDisabled}
                  onChange={ingresarValoresMemoria}
                  value={usuario.nombreCompleto}
                  slotProps={{
                    htmlInput: { maxLength: 50 },
                  }}
                />
              </Grid2>
              {/* Usuario */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  variant="outlined"
                  id="username"
                  label="Ingrese username"
                  name="username"
                  required
                  fullWidth
                  disabled={inputDisabled}
                  onChange={ingresarValoresMemoria}
                  value={usuario.username}
                  slotProps={{
                    htmlInput: { maxLength: 50 },
                  }}
                />
              </Grid2>
              {/* Correo Electrónico */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  variant="outlined"
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  fullWidth
                  disabled={inputDisabled}
                  onChange={ingresarValoresMemoria}
                  value={usuario.email}
                  slotProps={{
                    htmlInput: { maxLength: 80 },
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
                  disabled={inputDisabled}
                  render={(ref, props) => (
                    <TextField
                      variant="outlined"
                      type="text"
                      id="telefono"
                      label="Teléfono"
                      name="numeroTelefono"
                      fullWidth
                      inputRef={ref}
                      {...props}
                      slotProps={{
                        htmlInput: { maxLength: 21 },
                      }}
                    />
                  )}
                />
              </Grid2>

              {/* Componente para seleccionar "Foto de Perfil" */}
              <Grid2 size={{ xs: 12, md: 12 }}>
                <ImageUploadingButton
                  value={image}
                  disabled={inputDisabled}
                  onChange={(newImage) => {
                    if (newImage.length > 0) {
                      setImageObjectFile(newImage[0].file);
                    }
                    setDialogOpen(true);
                    setImage(newImage);
                  }}
                />
                <ImageCropper
                  texto="Aceptar"
                  open={dialogOpen}
                  image={image.length > 0 && image[0].dataURL}
                  //onComplete={handleCropComplete}
                  onComplete={(imagePromise) =>
                    handleCropComplete(
                      imagePromise,
                      imageObjectFile,
                      setUsuario,
                      setCroppedImage,
                      setDialogOpen,
                      croppedImage)
                  }
                  {...StyleImg.container}
                />
                {/* {croppedImage && <img src={croppedImage} alt="blab" />} */}
              </Grid2>

              {/* Seguridad */}
              <Grid2 size={{ xs: 12, md: 12 }} sx={{ mt: 4 }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                    Segurdad
                  </Typography>
                  <Divider sx={{ flexGrow: 1, ml: 2 }} />
                </Box>
              </Grid2>
              {/* Botón para Editar Contraseña (se abre una modal) */}
              <Grid2 container>
                <Grid2 size={{ xs: 12, md: 12 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="right"
                    justifyContent="right"
                  >
                    <Button
                      type="button"
                      variant="contained"
                      color="info"
                      disabled={inputDisabled}
                      onClick={handleOpenDialogEditarPwd}
                      style={style.submit}
                      startIcon={<Key />}
                    >
                      Editar Contraseña
                    </Button>
                  </Stack>
                </Grid2>
              </Grid2>

              {sesionUsuario.usuario.perfilEnumID !== 10 && (
                <>
                  {/* Información adicional */}
                  <Grid2 size={{ xs: 12, md: 12 }} sx={{ mt: 4 }}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                        Información adicional
                      </Typography>
                      <Divider sx={{ flexGrow: 1, ml: 2 }} />
                    </Box>
                  </Grid2>
                  {/* Exceder 8 horas por día */}
                  <Grid2 size={{ xs: 12, md: 5 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={inputDisabled}
                            checked={usuario.usuarioConfig?.excederOchoHoras || false}
                            name="ExcederOchoHoras"
                            onChange={handleChangeExcederOchoHoras}
                          />
                        }
                        label="Exceder ocho horas por día"
                      />
                    </Box>
                  </Grid2>
                  {/* selectbox Horas Permitidas Por Día. */}
                  <Grid2 size={{ xs: 12, md: 7 }}>
                    <FormControl sx={{ ml: 2, pr: 2 }} fullWidth>
                      <InputLabel id="lblHoraPermitidasPorDia">Horas permitidas por día</InputLabel>
                      <Select
                        labelId="lblHoraPermitidasPorDia"
                        id="lblHoraPermitidasPorDia"
                        sx={{ mr: 2 }}
                        disabled={!usuario.usuarioConfig?.excederOchoHoras || inputDisabled}
                        label="Horas permitidas por día"
                        name="horasPermitidasPorDia"
                        value={usuario.usuarioConfig?.horasPermitidasPorDia || 8}
                        onChange={handleChangeHorasPermitidasPorDia} //Manejador de eventos
                      >
                        {Array.isArray(sesionUsuario.usuario?.usuarioConfig?.rangoHoraPorDia) &&
                          sesionUsuario.usuario.usuarioConfig.rangoHoraPorDia.map((item, index) => (
                            <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
                          ))
                        }
                      </Select>
                      <FormHelperText>Cantidad de horas que puede capturar el usuario por día</FormHelperText>
                    </FormControl>
                  </Grid2>
                  {/* checkbox Permitir Captura Fin de Semana */}
                  <Grid2 size={{ xs: 12, md: 5 }} sx={{ mt: 2 }}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={inputDisabled}
                            checked={usuario.usuarioConfig?.permitirCapturaFinDeSemana || false}
                            name="PermitirCapturaFinDeSemana"
                            onChange={handleChangePermitirCapturaFinDeSemana}
                          />
                        }
                        label="Permitir captura de fin de semana"
                      />
                    </Box>
                  </Grid2>
                  {/* selectbox's Rango de captura por día */}
                  <Grid2 size={{ xs: 12, md: 7 }} sx={{ mt: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <FormControl fullWidth sx={{ ml: 2 }}>
                        <InputLabel id="lblHoraRangoInicio">De</InputLabel>
                        <Select
                          label="De"
                          labelId="lblHoraRangoInicio"
                          id="lblHoraRangoInicioSelect"
                          disabled={inputDisabled}
                          value={usuario.usuarioConfig?.horaRangoInicio || 0}
                          onChange={handleChangeHoraRangoInicio}
                        >
                          {Array.isArray(sesionUsuario.usuario?.usuarioConfig?.rangoCapturaPorDiaInicio) &&
                            sesionUsuario.usuario.usuarioConfig.rangoCapturaPorDiaInicio.map((item, index) => (
                              <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
                            ))
                          }
                        </Select>
                        <FormHelperText>Inicio de rango de captura por día</FormHelperText>
                      </FormControl>
                      <FormControl fullWidth sx={{ ml: 3 }}>
                        <InputLabel id="lblHoraRangoFin">A</InputLabel>
                        <Select
                          label="A"
                          labelId="lblHoraRangoFin"
                          id="lblHoraRangoFinSelect"
                          disabled={inputDisabled}
                          value={usuario.usuarioConfig?.horaRangoFin || 0}
                          onChange={handleChangeHoraRangoFin}
                        >
                          {Array.isArray(sesionUsuario.usuario?.usuarioConfig?.rangoCapturaPorDiaFin) &&
                            sesionUsuario.usuario.usuarioConfig.rangoCapturaPorDiaFin.map((item, index) => (
                              <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
                            ))
                          }
                        </Select>
                        <FormHelperText>Fin de rango de captura por día</FormHelperText>
                      </FormControl>
                    </Box>
                  </Grid2>
                  {/* mostrar cumpleaños */}
                  <Grid2 size={{ xs: 12, md: 5 }} sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={usuario.usuarioConfig?.mostrarCumpleanio || false}
                          disabled={inputDisabled}
                          name="MostrarCumpleanio"
                          onChange={handleChangeMostrarCumpleanio}
                        />
                      }
                      label="Mostrar Cumpleaños"
                    />
                  </Grid2>
                  {/* Fecha para seleccionar Fecha Nacimiento (cumpleaños) */}
                  <Grid2 size={{ xs: 12, md: 7 }} sx={{ pl: 2, mt: 2 }}>
                    {usuario.usuarioConfig?.mostrarCumpleanio &&
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="es"
                      >
                        <DatePicker
                          label="Fecha nacimiento (cumpleaños)"
                          disabled={inputDisabled}
                          value={usuario.usuarioConfig?.fechaNacimiento ? dayjs(usuario.usuarioConfig.fechaNacimiento) : null}
                          onChange={handleChangeCumpleanio}
                          maxDate={dayjs()}
                          slotProps={{ textField: { fullWidth: true } }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    }
                  </Grid2>
                </>
              )}

            </Grid2>
            <Divider sx={{ mt: 3 }} />
            {/* Botones para Editar Perfil, Guardar Cambios, Cancelar */}
            <Grid2 container sx={{ mt: 5, mb: 2 }}>
              <Grid2 size={{ xs: 12, md: 12 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="right"
                  justifyContent="right"
                >
                  {mostrarBtnGuardar && <Button
                    type="button"
                    //fullWidth
                    variant="contained"
                    color="primary"
                    //size="large"
                    onClick={handleOpenDialogGuardar}
                    style={style.submit}
                    startIcon={<SaveIcon />}
                  >
                    Guardar
                  </Button>}
                  {!mostrarBtnGuardar && <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={handleEditarMiPerfil}
                    style={style.submit}
                    startIcon={<EditIcon />}
                  >
                    Editar Mi Perfil
                  </Button>}
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={handleOpenDialogCancelar}
                    style={style.submit}
                    startIcon={<Cancel />}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </form>
        )}

        <DialogCancelar
          open={openDialogCancelar}
          handleClose={handleCloseDialogCancelar}
          handleCancelar={handleCancelarEditarMiPerfil}
          Transition={Transition}
        />

        <DialogGuardar
          open={openDialogGuardar} // Updated open prop
          handleClose={handleCloseDialogGuardar}
          handleGuardar={() => (
            handleGuardarMiPerfil(usuario, originalUsuario?.current, dispatch, handleCloseDialogGuardar)
          )}
          Transition={Transition}
          loading={loading}
        />

        <DialogEditarPwd
          handleOpen={openDialogEditarPwd}
          handleClose={handleCloseDialogEditarPwd}
          Transition={Transition}
          usuarioSesionActual={sesionUsuario.usuario}
        />

      </div>
    </Container>
  );
};

export default PerfilUsuario;
