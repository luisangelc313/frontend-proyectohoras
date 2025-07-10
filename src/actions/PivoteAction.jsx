import HttpCliente from "../services/HttpCliente";
import axios from "axios";

const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;


export const guardarPivoteAction = (data) => {
    return new Promise((resolve, reject) => {
        HttpCliente.post(`registrospivote`, data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error.response));
    });
}