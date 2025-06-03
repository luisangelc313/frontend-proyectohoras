import { useEffect, useState } from "react";
import { Link/*, useLocation*/ } from "react-router-dom";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import ArrowRight from '@mui/icons-material/ArrowRight';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddAlarm from '@mui/icons-material/AddAlarm';
import Timeline from '@mui/icons-material/Timeline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
//import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { PathsUrl } from '../../../utils/Paths';
import { hasPermission } from "../../../utils/tokenUtils"; // Importa la función de validación

const useStyles = makeStyles({
  listItemText: {
    cursor: "pointer",
    fontSize: "14px",
    paddingLeft: "5px",
  },
});

export const MenuIzquierda = ({ clases }) => {
  const [permissions, setPermissions] = useState({}); // Estado para almacenar los permisos
  //const location = useLocation(); // Hook para detectar cambios de ruta

  const [open, setOpen] = useState(false);
  const handleCatalogosClick = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const localClases = useStyles(); // Usa los estilos definidos

  useEffect(() => {
    const validatePermissions = () => {
      setPermissions({
        inicio: hasPermission("com.modulo.inicio"),
        miPerfil: hasPermission("com.modulo.miperfil"),
        catalogos: hasPermission("com.modulo.catalogos"),
        usuarios: hasPermission("com.modulo.usuarios"),
        registroTiempos: hasPermission("com.modulo.registrotiempos"),
      });
    };

    validatePermissions();

  }, [/*location*/]);

  return (
    <div className={clases.list}>
      <List>
        {permissions.inicio && (
          <ListItem component={Link} button="true" to="/">
            <i className="material-icons" style={{ marginRight: "10px" }}>
              home
            </i>
            <ListItemText
              clases={{ primary: clases.listItemText }}
              primary="Inicio"
            />
          </ListItem>
        )}
        <Divider />
        {permissions.miPerfil && (
          <ListItem component={Link} button="true" to={PathsUrl.PerfilUsuario}>
            {/* <i className="material-icons" style={{ marginRight: '10px' }}>account_box</i> */}
            <PersonIcon sx={{ mr: 1 }} />
            <ListItemText
              clases={{ primary: clases.listItemText }}
              primary="Mi Perfil"
            />
          </ListItem>
        )}
        <Divider />
        {permissions.catalogos && (
          <List>
            <ListItemButton onClick={handleCatalogosClick}>
              <ListItemIcon style={{ color: '#551A8B', minWidth: '35px' }}>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText
                primary="Catálogos"
                style={{ color: '#551A8B' }}
              />
              {open ? <ExpandLess style={{ color: '#551A8B' }} /> : <ExpandMore style={{ color: '#551A8B' }} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {hasPermission("com.modulo.catalogos", "com.funcion.actividades") && (
                  <ListItem component={Link} to={PathsUrl.ActividadListado}>
                    <ArrowRight style={{ marginLeft: '20px' }} />
                    <ListItemText
                      classes={{ primary: clases.listItemText }}
                      primary="Actividades"
                    />
                  </ListItem>
                )}
                {hasPermission("com.modulo.catalogos", "com.funcion.clientes") && (
                  <ListItem component={Link} to={PathsUrl.ClienteListado}>
                    <i className="material-icons" style={{ marginLeft: '20px' }}>arrow_right</i>
                    <ListItemText
                      classes={{ primary: clases.listItemText }}
                      primary="Clientes"
                    />
                  </ListItem>
                )}
                {hasPermission("com.modulo.catalogos", "com.funcion.soluciones") && (
                  <ListItem component={Link} to={PathsUrl.SolucionListado}>
                    <i className="material-icons" style={{ marginLeft: '20px' }}>arrow_right</i>
                    <ListItemText
                      classes={{ primary: clases.listItemText }}
                      primary="Soluciones"
                    />
                  </ListItem>
                )}
                {hasPermission("com.modulo.catalogos", "com.funcion.perfiles") && (
                  <ListItem component={Link} to={PathsUrl.PerfilListado}>
                    <i className="material-icons" style={{ marginLeft: '20px' }}>arrow_right</i>
                    <ListItemText
                      classes={{ primary: clases.listItemText }}
                      primary="Perfiles"
                    />
                  </ListItem>
                )}
              </List>
            </Collapse>
          </List>
        )}
        {permissions.usuarios && (
          <Divider />
        )}
        {permissions.usuarios && (
          <ListItem component={Link} button="true" to={PathsUrl.UsuarioListado}>
            <PeopleAltIcon sx={{ mr: 1 }} />
            <ListItemText
              //classes={{ primary: clases.listItemText }}
              classes={{ primary: localClases.listItemText }}
              primary="Usuarios"
            />
          </ListItem>
        )}
        {permissions.registroTiempos && (
          <Divider />
        )}
        {permissions.registroTiempos && (
          <ListItem component={Link} button="true" to={PathsUrl.RegistroTiempos}>
            {/* <i className="material-icons" style={{ marginRight: '10px' }}>account_box</i> */}
            <AddAlarm sx={{ mr: 1 }} />
            <ListItemText
              clases={{ primary: clases.listItemText }}
              primary="Registro Tiempos"
            />
          </ListItem>
        )}
        {permissions.registroTiempos && (
          <ListItem component={Link} button="true" to={PathsUrl.RegistroPivote}>
            <Timeline sx={{ mr: 1 }} />
            <ListItemText
              clases={{ primary: clases.listItemText }}
              primary="Pivote"
            />
          </ListItem>
        )}
      </List>
    </div>
  );
};
