import HttpCliente from "../services/HttpCliente";
import axios from "axios";

const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;


export const guardarActividadAction = async (actividad) => {
  const epActividadPost = "/actividad";
  const promesaActividad = HttpCliente.post(epActividadPost, actividad);

  return await Promise.all([promesaActividad]);
};


export const actualizarActividadAction = async (actividad) => {
  const id = actividad.ActividadId;
  const epActividadPut = `/actividad/${id}`;
  const promesaActividad = HttpCliente.put(epActividadPut, actividad);

  return await Promise.all([promesaActividad]);
};


export const paginacionActividad = async paginador => {
  // return new Promise((resolve) => {
  //   HttpCliente.post("/actividad/actividadespaginado", paginador).then(
  //     (response) => {
  //       resolve(response);
  //     }
  //   );
  // });
  const response = await HttpCliente.post("/actividad/actividadespaginado", paginador);
  return response;
};


// recibe por parámetro el objeto Actividad, pero se desestructura para obtener el id
export const eliminarActividadAction = async (actividad) => {
  let id = actividad.ActividadId;
  const epActividadDelete = `/actividad/${id}`;
  return await HttpCliente.delete(epActividadDelete);
};


// recibe por parámetro el objeto Actividad, pero se desestructura para obtener el id
export const inactivarActividadAction = async (actividad) => {
  const data = {
    "id": actividad.ActividadId,
    "activo": !actividad.Activa//Si esta activa se Deactiva, sino se Activa.
  }
  const epActividadPut = "/actividad/eliminadologico";
  const promesaActividad = HttpCliente.put(epActividadPut, data);

  return await Promise.all([promesaActividad]);
};
