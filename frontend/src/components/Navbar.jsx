import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

export default function Navbar() {
    const links = [
        { label: 'Productos', to: '/productos' },
        { label: 'Clientes', to: '/clientes' },
        { label: 'Ventas', to: '/ventas' },
        { label: 'Reportes', to: '/reportes' },
    ]

    return (
        <AppBar position="fixed" sx={{ bgcolor: '#1a1e22', borderBottom: '1px solid #09814A' }}>
            <Toolbar>
                <MusicNoteIcon sx={{ color: '#09814A', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#FFFBDB', fontWeight: 700, flexGrow: 1 }}>
                    Tienda Musical
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {links.map(link => (
                        <Button
                            key={link.to}
                            component={Link}
                            to={link.to}
                            sx={{ color: '#ABA9C3', '&:hover': { color: '#FFFBDB', bgcolor: '#09814A22' } }}
                        >
                            {link.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    )
}