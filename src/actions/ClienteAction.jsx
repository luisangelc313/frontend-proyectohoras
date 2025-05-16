import HttpCliente from "../services/HttpCliente";

export const paginacionClienteAction = async paginador => {
  // return new Promise((resolve) => {
  //   HttpCliente.post("/cliente/clientespaginado", paginador).then(
  //     (response) => {
  //       resolve(response);
  //     }
  //   );
  // });

  const response = await HttpCliente.post("/cliente/clientespaginado", paginador);
  return response;
};

// Recibe por parámetro el objeto Cliente. Solo contiene el nombre { Nombre: "valor" }
export const guardarClienteAction = async (cliente) => {
  const epClientePost = "/cliente";
  const promesaCliente = HttpCliente.post(epClientePost, cliente);

  return await Promise.all([promesaCliente]);
};


// Recibe por parámetro el objeto Cliente, { "ClienteId": "uuid", "Nombre": "valor", "Activo": true|false }
export const actualizarClienteAction = async (cliente) => {
  const id = cliente.ClienteId;
  const epClientePut = `/cliente/${id}`;
  const promesaCliente = HttpCliente.put(epClientePut, cliente);

  return await Promise.all([promesaCliente]);
};


// Recibe por parámetro el objeto Cliente, pero se desestructura para obtener ClienteId
export const eliminarClienteAction = async (cliente) => {
  let id = cliente.ClienteId;
  const epClienteDelete = `/cliente/${id}`;
  return await HttpCliente.delete(epClienteDelete);
};

// Recibe por parámetro el objeto Cliente, pero se desestructura para obtener el id
export const inactivarActivarClienteAction = async (cliente) => {
  const data = {
    id: cliente.ClienteId,
    activo: !cliente.Activo, //Si esta activa se Deactiva, sino se Activa.
  };
  const epClientePut = "/cliente/eliminadologico";
  const promesaCliente = HttpCliente.put(epClientePut, data);

  return await Promise.all([promesaCliente]);
};
