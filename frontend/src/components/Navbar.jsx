import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
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
        <AppBar position="fixed" sx={{ bgcolor: '#1a1e22', borderBottom: '1px solid #09814A' }}>
            <Toolbar>
                <Box
                    component={Link}
                    to="/"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
                >

                    <Typography variant="h6" sx={{ color: '#FFFBDB', fontWeight: 700 }}>
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
                                color: location.pathname === link.to ? '#09814A' : '#ABA9C3',
                                '&:hover': { color: '#FFFBDB', bgcolor: '#09814A22' }
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