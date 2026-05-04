import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Typography, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
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
            color: '#09814A',
            bg: '#09814A20',
            border: '#09814A',
            path: '/ventas',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#09814A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
                    <path d="M12 5v14M5 12h14" />
                </svg>
            )
        },
        {
            label: 'Inventario',
            color: '#DA7422',
            bg: '#DA742220',
            border: 'transparent',
            path: '/productos',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#DA7422" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12l-2-4z" />
                </svg>
            )
        },
        {
            label: 'Reportes',
            color: '#ABA9C3',
            bg: '#ABA9C320',
            border: 'transparent',
            path: '/reportes',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#ABA9C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
                    <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
                </svg>
            )
        }
    ]

    return (
        <Box>
            <Typography variant="h5" sx={{ color: '#FFFBDB', fontWeight: 500, mb: 0.5 }}>
                Bienvendio
            </Typography>
            <Typography variant="body2" sx={{ color: '#ABA9C3', mb: 3 }}>
                Tienda Musical  LP
            </Typography>

            {/* Botones de acción */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {actions.map(action => (
                    <Grid item xs={4} key={action.label}>
                        <Paper
                            onClick={() => navigate(action.path)}
                            sx={{
                                bgcolor: '#1a1e22',
                                border: `0.5px solid ${action.border}`,
                                borderRadius: 3,
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                '&:hover': {
                                    bgcolor: '#1f2428',
                                    borderColor: action.color,
                                }
                            }}
                        >
                            <Box sx={{
                                width: 56, height: 56,
                                borderRadius: 2,
                                bgcolor: action.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {action.icon}
                            </Box>
                            <Typography sx={{ color: '#FFFBDB', fontWeight: 500, fontSize: 15 }}>
                                {action.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Tabla de actividad reciente */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ color: '#FFFBDB', fontWeight: 500, fontSize: 14 }}>
                    Actividad reciente
                </Typography>
                <Typography
                    onClick={() => navigate('/ventas')}
                    sx={{ color: '#ABA9C3', fontSize: 12, cursor: 'pointer', '&:hover': { color: '#09814A' } }}
                >
                    Ver todas →
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ bgcolor: '#1a1e22' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['#', 'Cliente', 'Empleado', 'Fecha', 'Total'].map(h => (
                                <TableCell key={h} sx={{ color: '#ABA9C3', fontWeight: 500, fontSize: 12, borderBottom: '0.5px solid #09814A40' }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map(v => (
                            <TableRow key={v.id_venta} sx={{ '&:hover': { bgcolor: '#1f2428' } }}>
                                <TableCell sx={{ color: '#ABA9C3', fontSize: 13 }}>{String(v.id_venta).padStart(3, '0')}</TableCell>
                                <TableCell sx={{ color: '#FFFBDB', fontSize: 13 }}>{v.cliente}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3', fontSize: 13 }}>{v.empleado}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3', fontSize: 13 }}>{v.fecha}</TableCell>
                                <TableCell sx={{ color: '#09814A', fontWeight: 500, fontSize: 13 }}>
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