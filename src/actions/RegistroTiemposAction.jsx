import HttpCliente from "../services/HttpCliente";
import axios from "axios";

const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;


export const obtenerCapturaInicialAction = () => {
    return new Promise((resolve, reject) => {
        HttpCliente.get(`registro/capturainicio`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
};


export const guardarTiemposProyectoAction = data => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`registro`, data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
}


export const obtenerRegistrosPaginadoAction = data => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`registro/registrospaginado`, data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
}

