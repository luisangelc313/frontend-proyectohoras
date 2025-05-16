export const obtenerDataImagen = (imagen) => {
  return new Promise((resolve, reject) => {
    const nombre = imagen.name;
    const extension = imagen.name.split(".").pop();

    const lector = new FileReader();
    lector.readAsDataURL(imagen);

    lector.onload = () =>
      resolve({
        data: lector.result.split(",")[1],
        nombre: nombre,
        extension: extension,
      });
    lector.onerror = (error) => {
      console.warn("Error loading", reject(error));
      return PromiseRejectionEvent(error);
    };
  });
};
