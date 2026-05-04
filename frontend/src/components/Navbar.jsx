import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'

export default function Navbar() {
    const location = useLocation()

    const links = [
        { label: 'Inicio', to: '/', icon: <HomeIcon fontSize="small" /> },
        { label: 'Productos', to: '/productos' },
        { label: 'Clientes', to: '/clientes' },
        { label: 'Ventas', to: '/ventas' },
        { label: 'Reportes', to: '/reportes' },
    ]

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box
                    component={Link}
                    to="/"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
                >
                    <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 700 }}>
                        Tienda Musical
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {links.map(link => (
                        <Button
                            key={link.to}
                            component={Link}
                            to={link.to}
                            startIcon={link.icon || null}
                            sx={{
                                color: 'common.white',
                                fontWeight: location.pathname === link.to ? 700 : 400,
                                borderBottom: location.pathname === link.to ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                                borderRadius: 0,
                                opacity: location.pathname === link.to ? 1 : 0.75,
                                '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.12)' },
                            }}
                        >
                            {link.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
