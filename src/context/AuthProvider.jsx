import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenUtils"; // Importa la función de validación
import { useStateValue } from "./store";

export const AuthProvider = ({ children }) => {
    const [{ sesionUsuario }, dispatch] = useStateValue();
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!isChecked) {
            //console.log("AuthProvider ejecutado");
            const token = sesionUsuario?.usuario?.token;

            if (token && isTokenExpired(token)) {
                dispatch({
                    type: "SALIR_SESION",
                    nuevoUsuario: null,
                    autenticado: false,
                });
                navigate("/auth/login");
            }

            setIsChecked(true); // Marcar como validado
        }
    }, [sesionUsuario, isChecked, dispatch, navigate]);

    return <>{children}</>;
};