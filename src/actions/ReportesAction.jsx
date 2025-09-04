import HttpCliente from "../services/HttpCliente";
import axios from "axios";

const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;


export const obtenerDatosFiltrosAction = () => {
    return new Promise((resolve, reject) => {
        HttpCliente.get(`reportes/getdatosfiltros`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
};


export const obtenerReporteRegistroAction = data => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`reportes/reporteregistros`, data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
};

