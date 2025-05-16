const initialState = {
    open: false,
    mensaje: "",
    severity: "",
    vertical: "bottom",
    horizontal: "center"
};

const openSnackbarReducer = (state = initialState, action) => {
    //console.log("action", action);

    switch (action.type) {
        case "OPEN_SNACKBAR":
            return {
                ...state,
                open: action.openMensaje.open,
                mensaje: action.openMensaje.mensaje,
                severity: action.openMensaje.severity || "success",  // default severity is success if not provided by the action.type
                vertical: action.openMensaje.vertical || "bottom",
                horizontal: action.openMensaje.horizontal || "center",
            };
        default:
            return state;
    }
}

export default openSnackbarReducer;