import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    Avatar
} from '@mui/material';

const BirthdayList = ({ birthdays }) => {
    return (
        <Card >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                        Hoy es cumpleaños de:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span role="img" aria-label="party">🥳</span>
                        <span role="img" aria-label="cake">🎂</span>
                        <span role="img" aria-label="celebration">🎉</span>
                        <span role="img" aria-label="balloon">🎈</span>
                        <span role="img" aria-label="heart">❤️</span>
                        <span role="img" aria-label="thumbs up">👍</span>
                    </Box>
                </Box>
                <List sx={{ maxHeight: 200, overflowY: 'auto', width: '100%' }}>
                    {birthdays.map((user, index) => (
                        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Avatar alt={user.name} src={user?.profilePhoto || ""} sx={{ marginRight: 2 }} style={{ backgroundColor: "#1976d2" }} />
                            <ListItemText primary={user.name} secondary={user.birthday} />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="body1" gutterBottom>
                    MUCHAS FELICIDADES
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BirthdayList;