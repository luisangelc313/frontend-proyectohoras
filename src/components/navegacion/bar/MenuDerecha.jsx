import { Avatar, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

import FotoUsuarioTemp from "../../../assets/react.svg";

export const MenuDerecha = ({ clases, usuario, salirSesion }) => (
  <div className={clases.list}>
    <List>
      <ListItem button="true" component={Link}>
        <Avatar src={usuario.imagenPerfil || FotoUsuarioTemp} />
        <ListItemText
          classes={{ primary: clases.listItemText }}
          primary={usuario ? usuario.nombreCompleto : ""}
        />
      </ListItem>

      <ListItem button="true" onClick={salirSesion}>
        <ListItemText
          classes={{ primary: clases.listItemText }}
          primary="Salir"
        />
      </ListItem>
    </List>
  </div>
);