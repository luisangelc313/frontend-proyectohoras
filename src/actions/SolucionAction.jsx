import HttpCliente from "../services/HttpCliente";


//Consulta inicial, carga el catálogo de Soluciones paginando.
export const paginacionSolucionAction = async paginador => {
    // return new Promise((resolve) => {
    //     HttpCliente.post("/solucion/solucionespaginado", paginador).then(
    //         (response) => {
    //             resolve(response);
    //         }
    //     );
    // });
    const response = await HttpCliente.post("/solucion/solucionespaginado", paginador);
    return response;
};


// Recibe por parámetro el objeto Solucion. Solo contiene el nombre { Nombre: "valor" }
export const guardarSolucionAction = async (cliente) => {
    const epSolucionPost = "/solucion";
    const promesaSolucion = HttpCliente.post(epSolucionPost, cliente);

    return await Promise.all([promesaSolucion]);
};


// Recibe por parámetro el objeto Solucion, { "SolucionId": "uuid", "Nombre": "valor", "Activo": true|false }
export const actualizarSolucionAction = async (solucion) => {
    const id = solucion.SolucionId;
    const epSolucionPut = `/solucion/${id}`;
    const promesaSolucion = HttpCliente.put(epSolucionPut, solucion);

    return await Promise.all([promesaSolucion]);
};


// Recibe por parámetro el objeto Solucion, pero se desestructura para obtener ClienteId
export const eliminarSolucionAction = async (solucion) => {
    let id = solucion.SolucionId;
    const epSolucionDelete = `/solucion/${id}`;
    return await HttpCliente.delete(epSolucionDelete);
};


// Recibe por parámetro el objeto Solucion, pero se desestructura para obtener el id
export const inactivarActivarSolucionAction = async (solucion) => {
    const data = {
        id: solucion.SolucionId,
        activo: !solucion.Activo, //Si esta activa se Deactiva, sino se Activa.
    };
    const epSolucionPut = "/solucion/eliminadologico";
    const promesaSolucion = HttpCliente.put(epSolucionPut, data);

    return await Promise.all([promesaSolucion]);
};
