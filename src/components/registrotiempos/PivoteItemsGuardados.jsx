import {
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Typography,
} from "@mui/material";


const PivoteItemGuardados = ({ data }) => {
    console.log("PivoteItemGuardados data:", data);
    return (
        <Card sx={{ maxWidth: "100%" }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={`/static/images/clientes/${data.cliente?.clienteId || "default"}.png`}
                    //image='https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1791/7829a9074a720b15d4eae9e8172e22e5/photo-1518897316719-ca8cefb87965.webp'
                    alt="logo cliente"
                />
                <CardContent>
                    <Typography gutterBottom variant="subtitle1">
                        Horas: {data.horas || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Solución: <b>{data?.solucion?.nombre || ""}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Cliente: <b>{data?.cliente?.nombre || ""}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Actividad: <b>{data?.actividad?.nombre || ""}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Proyecto: <b>{data.proyecto || ""}</b>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PivoteItemGuardados;