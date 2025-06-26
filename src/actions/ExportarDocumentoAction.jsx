import HttpCliente from "../services/HttpCliente";
import axios from "axios";

const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;


export const exportarRegistrosPDFAction = requestData => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`exportardocumento/exportarpdf`, requestData, {
            responseType: 'blob', // <- esto es clave
            headers: {
                'Content-Type': 'application/json'
            }
        },)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
};


export const exportarRegistrosEXCELAction = requestData => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`exportardocumento/exportarexcel`, requestData, {
            responseType: 'blob', // <- esto es clave (almacenamiento de archivos binarios grander)
        })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
};

