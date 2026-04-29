import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121619',
            paper: '#1a1e22',
        },
        primary: {
            main: '#09814A',
        },
        secondary: {
            main: '#DA7422',
        },
        info: {
            main: '#ABA9C3',
        },
        text: {
            primary: '#FFFBDB',
            secondary: '#ABA9C3',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8 },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
            },
        },
    },
})

export default theme