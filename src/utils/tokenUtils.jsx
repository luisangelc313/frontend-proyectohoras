import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    if (!token) return true; // Si no hay token, se considera expirado
    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        return decoded.exp < currentTime; // Retorna true si el token ha expirado
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return true; // Si hay un error al decodificar, se considera expirado
    }
};

export const hasPermission = (claveModulo, funcion = null) => {
    if (!claveModulo) return false; // Si no se proporciona un nombre de módulo, no se tiene permiso

    const token = localStorage.getItem("token_seguridad");
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken || !decodedToken.permisos) return false;

        const permisos = JSON.parse(decodedToken.permisos);
        if (!permisos || !Array.isArray(permisos)) return false;

        // Buscar el módulo en los permisos
        const modulo = permisos.find(x => x.ClaveModulo === claveModulo);

        if (!modulo) return false; // Si no se encuentra el módulo, no se tiene permiso

        // Si no se especifica una función, solo validar el módulo
        if (!funcion) return true;

        // Validar si la función está permitida dentro del módulo
        return modulo.Funciones && modulo.Funciones.some(x => x.ClaveFuncion === funcion);

    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};
