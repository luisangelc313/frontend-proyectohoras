export const initialState = {
  usuario: {
    nombreCompleto: "",
    email: "",
    username: "",
    foto: "",
  },
  autenticado: false,
  menuVisible: true,
};

const sesionUsuarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      return {
        ...state,
        usuario: action.sesion,
        autenticado: action.autenticado,
      };
    case "SALIR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
      };
    case "ACTUALIZAR_USUARIO":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_MENU_VISIBILITY":
      return {
        ...state,
        menuVisible: action.payload,
      };
    default:
      return state;
  }
}

export default sesionUsuarioReducer;