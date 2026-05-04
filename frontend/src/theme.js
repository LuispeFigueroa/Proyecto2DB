import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#DEE5E5',
            paper: '#ffffff',
        },
        primary: {
            main: '#53131E',
            dark: '#3d0e16',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#CC8B86',
        },
        warning: {
            main: '#F6AE2D',
            contrastText: '#53131E',
        },
        error: {
            main: '#C62828',
        },
        success: {
            main: '#2e7d32',
        },
        text: {
            primary: '#53131E',
            secondary: '#5B616A',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                }),
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8 },
                containedPrimary: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.dark },
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderColor: theme.palette.background.default,
                }),
                head: ({ theme }) => ({
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                    },
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-focused': { color: theme.palette.primary.main },
                }),
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                }),
            },
        },
        MuiTab: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.secondary,
                    '&.Mui-selected': { color: theme.palette.primary.main },
                }),
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.primary.main,
                }),
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderColor: theme.palette.secondary.main,
                }),
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.secondary,
                }),
            },
        },
    },
})

export default theme
