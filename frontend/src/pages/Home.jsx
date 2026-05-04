import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Typography, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import api from '../api/axios'

export default function Home() {
    const navigate = useNavigate()
    const [ventas, setVentas] = useState([])

    useEffect(() => {
        api.get('/ventas').then(r => setVentas(r.data.slice(0, 5))).catch(() => { })
    }, [])

    const actions = [
        {
            label: 'Nueva venta',
            color: '#F6AE2D',
            bg: '#F6AE2D18',
            border: '#F6AE2D',
            path: '/ventas',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#F6AE2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={36} height={36}>
                    <path d="M12 5v14M5 12h14" />
                </svg>
            )
        },
        {
            label: 'Inventario',
            color: '#CC8B86',
            bg: '#CC8B8618',
            border: 'transparent',
            path: '/productos',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#CC8B86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={36} height={36}>
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12l-2-4z" />
                </svg>
            )
        },
        {
            label: 'Reportes',
            color: '#6C8EAD',
            bg: '#6C8EAD18',
            border: 'transparent',
            path: '/reportes',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#6C8EAD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={36} height={36}>
                    <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
                </svg>
            )
        }
    ]

    return (
        <Box>
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.25 }}>
                Bienvenido
            </Typography>
            <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500, mb: 3 }}>
                Tienda Musical LP
            </Typography>

            {/* Botones de acción */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {actions.map(action => (
                    <Grid item xs={4} key={action.label}>
                        <Paper
                            onClick={() => navigate(action.path)}
                            elevation={0}
                            sx={{
                                border: `1px solid ${action.border}`,
                                borderRadius: 3,
                                p: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                cursor: 'pointer',
                                transition: 'all 0.18s',
                                '&:hover': {
                                    boxShadow: `0 4px 16px ${alpha(action.color, 0.18)}`,
                                    borderColor: action.color,
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            <Box sx={{
                                width: 72, height: 72,
                                borderRadius: 2,
                                bgcolor: action.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {action.icon}
                            </Box>
                            <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: 17 }}>
                                {action.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Tabla de actividad reciente */}
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                mb: 1.5, pl: 1.5, borderLeft: '3px solid', borderColor: 'secondary.main'
            }}>
                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: 14 }}>
                    Actividad reciente
                </Typography>
                <Typography
                    onClick={() => navigate('/ventas')}
                    sx={{ color: 'secondary.main', fontSize: 12, cursor: 'pointer', fontWeight: 500, '&:hover': { color: 'primary.main' } }}
                >
                    Ver todas →
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['#', 'Cliente', 'Empleado', 'Fecha', 'Total'].map(h => (
                                <TableCell key={h} sx={{ fontSize: 12 }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map(v => (
                            <TableRow key={v.id_venta} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{String(v.id_venta).padStart(3, '0')}</TableCell>
                                <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{v.cliente}</TableCell>
                                <TableCell>{v.empleado}</TableCell>
                                <TableCell>{v.fecha}</TableCell>
                                <TableCell sx={{ color: 'warning.main', fontWeight: 600, fontSize: 13 }}>
                                    Q{parseFloat(v.total).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
