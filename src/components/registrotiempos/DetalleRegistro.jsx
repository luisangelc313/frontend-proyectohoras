import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const DetalleRegistro = ({ fecha }) => {
  const [/*actividades*/, setActividades] = useState([]);

  // Cuando cambia la fecha seleccionada, simula una petición a la API
  useEffect(() => {
    if (fecha) {
      setActividades([`Sin registros`]);
    } else {
      setActividades([]);
    }
  }, [fecha]);

  return (
    <>
      <Box>
        <Typography variant="h6">
          Registro de Horas por Proyecto{" "}
        </Typography>
        {fecha && (
          <span
            style={{
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "Arial",
              captionSide: "bottom",
            }}
          >
            {
              // Capitaliza Día y Mes
              fecha.locale("es").format("dddd, DD [de] MMMM [de] YYYY")
                .replace(
                  /^([a-záéíóúñ]+), (\d{2} [a-z ]+ )([a-záéíóúñ]+)( de \d{4})$/i,
                  (match, dia, diaNum, mes, resto) =>
                    `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${diaNum}${mes.charAt(0).toUpperCase() + mes.slice(1)}${resto}`
                )
            }
          </span>
        )}

        {fecha && (
          <Typography variant="h6" gutterBottom>
            <span
              style={{
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "Arial",
                captionSide: "bottom",
                marginRight: 5,
              }}>Horas Capturas: </span>
            0
          </Typography>
        )}

        {fecha && console.log("Fecha Seleccionada:", fecha)}

      </Box>
    </>
  )
}

export default DetalleRegistro;