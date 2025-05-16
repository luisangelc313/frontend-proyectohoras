import { v4 as uuidv4 } from 'uuid';
import HttpCliente from "../services/HttpCliente";


export const perfilListadoAction = async filtro => {
    try {
        const response = await HttpCliente.get(`/perfiles/${filtro.nombre}`);
        return response;
    } catch (error) {
        console.error("Error fetching profiles:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};


// Recibe por parámetro el objeto Perfil. Solo contiene el nombre { Nombre: "valor" }
export const guardarPerfilAction = async (perfil) => {
    const perfilId = uuidv4();
    perfil.PerfilId = perfilId;
    const epPerfilPost = "/perfiles";
    const promesaPerfil = HttpCliente.post(epPerfilPost, perfil);

    return await Promise.all([promesaPerfil]);
};


// Recibe por parámetro el objeto Perfil, { "PerfilId": "uuid", "Nombre": "valor" }
export const actualizarPerfilAction = async (perfil) => {
    const id = perfil.PerfilId;
    const epPerfilPut = `/perfiles/${id}`;
    const promesaPerfil = HttpCliente.put(epPerfilPut, perfil);

    return await Promise.all([promesaPerfil]);
};


// Recibe por parámetro el objeto Perfil, pero se desestructura para obtener PerfilId
export const eliminarPerfilAction = async (perfil) => {
    let id = perfil.PerfilId;
    const epPerfilDelete = `/perfiles/${id}`;
    return await HttpCliente.delete(epPerfilDelete);
};
