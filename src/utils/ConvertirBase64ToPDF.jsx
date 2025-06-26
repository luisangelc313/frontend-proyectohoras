export const ConvertirBase64PDF = (base64String, nombreArchivo = "registros.pdf", convertirPDF = true) => {
    // Decodifica el base64 a un array de bytes
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blobType = convertirPDF
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // Crea un blob y un enlace de descarga
    const blob = new Blob([byteArray], { type: blobType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

