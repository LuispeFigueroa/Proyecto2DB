import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F5F6F8',
            paper: '#ffffff',
        },
        primary: {
            main: '#42273B',
        },
        secondary: {
            main: '#6C8EAD',
        },
        error: {
            main: '#DE3C4B',
        },
        text: {
            primary: '#42273B',
            secondary: '#64748B',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#6C8EAD',
                    borderBottom: '1px solid #5a7a9a',
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8, textTransform: 'none' },
                containedPrimary: {
                    backgroundColor: '#42273B',
                    '&:hover': { backgroundColor: '#2e1a28' },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { borderColor: '#E2E8F0' },
                head: { color: '#64748B', fontWeight: 500, fontSize: 12 },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 6 },
            },
        },
    },
})

export default theme