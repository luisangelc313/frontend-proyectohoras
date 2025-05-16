import { createTheme } from '@mui/material/styles'


const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: '#63a4ff',
            main: '#1976d2',
            dark: '#004ba0',
            contrastText: '#ecfad8'
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5',
        },
    }
});


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        // primary: {
        //     light: '#63a4ff',
        //     main: '#1976d2',
        //     dark: '#004ba0',
        //     contrastText: '#ecfad8',
        // },
        // background: {
        //     default: '#121212',
        //     paper: '#1e1e1e',
        // },
    },
});


const getTheme = () => {
    const themeMode = localStorage.getItem('theme') || 'light';
    return themeMode === 'dark' ? darkTheme : lightTheme;
};

export default getTheme;