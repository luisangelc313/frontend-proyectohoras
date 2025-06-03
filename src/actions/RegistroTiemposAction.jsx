import HttpCliente from "../services/HttpCliente";
//import axios from 'axios';


export const obtenerCapturaInicialAction = () => {
    return new Promise((resolve, reject) => {
        HttpCliente.get(`registro/capturainicio`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
};


export const guardarTiemposProyecto = data => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`registro`, data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
}