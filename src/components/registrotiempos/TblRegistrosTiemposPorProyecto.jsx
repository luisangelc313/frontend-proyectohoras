import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";


const headers = [
    { label: "MES" },
    { label: "CLIENTE" },
    { label: "SOLUCIÓN" },
    { label: "PROYECTO" },
    { label: "ACTIVIDAD" },
    { label: "HORAS", align: "right" }
];

const TblRegistrosTiemposPorProyecto = ({ registros = [] }) => (
    <TableContainer component={Paper}>
        <Table size="small" aria-label="registros de tiempos por proyecto">
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                        <TableCell
                            key={header.label}
                            align={header.align || "left"}
                            sx={{ backgroundColor: "#1F4E78", color: "#fff", py: 1.5 }}
                        >
                            <b>{header.label}</b>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {registros && registros.length > 0 ? (
                    registros.map(row => (
                        <TableRow key={row.registroId}>
                            <TableCell>{row.mes}</TableCell>
                            <TableCell>{row.cliente}</TableCell>
                            <TableCell>{row.solucion}</TableCell>
                            <TableCell>{row.proyecto}</TableCell>
                            <TableCell>{row.actividad}</TableCell>
                            <TableCell align="right">{row.horas}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={headers.length} align="center" sx={{ py: 3 }}>
                            <span
                                style={{
                                    fontSize: 17,
                                    fontWeight: "600",
                                    fontFamily: "Arial",
                                    captionSide: "bottom"
                                }}>
                                Sin Registros
                            </span>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

export default TblRegistrosTiemposPorProyecto;
