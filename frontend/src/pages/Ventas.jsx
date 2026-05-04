import { useEffect, useState } from 'react'
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Alert, Snackbar, IconButton, Divider
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import api from '../api/axios'

const emptyItem = { id_producto: '', cantidad: '', precio_unitario: '' }

export default function Ventas() {
    const [ventas, setVentas] = useState([])
    const [openCreate, setOpenCreate] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [detalle, setDetalle] = useState(null)
    const [form, setForm] = useState({ id_cliente: '', id_empleado: '', fecha: '' })
    const [items, setItems] = useState([{ ...emptyItem }])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchVentas = async () => {
        try {
            const res = await api.get('/ventas')
            setVentas(res.data)
        } catch {
            setError('Error al cargar ventas')
        }
    }

    useEffect(() => { fetchVentas() }, [])

    const handleVerDetalle = async (id) => {
        try {
            const res = await api.get(`/ventas/${id}`)
            setDetalle(res.data)
            setOpenDetail(true)
        } catch {
            setError('Error al cargar detalle')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta venta?')) return
        try {
            await api.delete(`/ventas/${id}`)
            setSuccess('Venta eliminada')
            fetchVentas()
        } catch {
            setError('Error al eliminar')
        }
    }

    const handleItemChange = (i, field, value) => {
        const updated = [...items]
        updated[i] = { ...updated[i], [field]: value }
        setItems(updated)
    }

    const addItem = () => setItems([...items, { ...emptyItem }])
    const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))

    const handleSubmit = async () => {
        if (!form.id_cliente || !form.id_empleado) {
            setError('ID Cliente e ID Empleado son obligatorios')
            return
        }
        if (items.some(it => !it.id_producto || !it.cantidad || !it.precio_unitario)) {
            setError('Completa todos los campos de los productos')
            return
        }
        try {
            const payload = {
                id_cliente: parseInt(form.id_cliente),
                id_empleado: parseInt(form.id_empleado),
                fecha: form.fecha || undefined,
                detalle: items.map(it => ({
                    id_producto: parseInt(it.id_producto),
                    cantidad: parseInt(it.cantidad),
                    precio_unitario: parseFloat(it.precio_unitario),
                })),
            }
            const res = await api.post('/ventas', payload)
            setSuccess(`Venta #${res.data.id_venta} creada — Total: Q${res.data.total.toFixed(2)}`)
            setOpenCreate(false)
            setForm({ id_cliente: '', id_empleado: '', fecha: '' })
            setItems([{ ...emptyItem }])
            fetchVentas()
        } catch (e) {
            setError(e.response?.data?.detail || 'Error al crear venta')
        }
    }

    const fieldSx = {
        '& .MuiOutlinedInput-root': { color: '#FFFBDB', '& fieldset': { borderColor: '#ABA9C3' }, '&:hover fieldset': { borderColor: '#09814A' } },
        '& .MuiInputLabel-root': { color: '#ABA9C3' },
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: '#FFFBDB', fontWeight: 700 }}>
                    Ventas
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}
                    sx={{ bgcolor: '#09814A', '&:hover': { bgcolor: '#076e3e' } }}>
                    Nueva Venta
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ bgcolor: '#1a1e22' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['ID', 'Fecha', 'Cliente', 'Empleado', 'Total', 'Acciones'].map(h => (
                                <TableCell key={h} sx={{ color: '#ABA9C3', fontWeight: 700, borderBottom: '1px solid #09814A' }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map(v => (
                            <TableRow key={v.id_venta} sx={{ '&:hover': { bgcolor: '#1f2428' } }}>
                                <TableCell sx={{ color: '#ABA9C3' }}>{v.id_venta}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{v.fecha}</TableCell>
                                <TableCell sx={{ color: '#FFFBDB' }}>{v.cliente}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{v.empleado}</TableCell>
                                <TableCell sx={{ color: '#DA7422', fontWeight: 700 }}>
                                    Q{parseFloat(v.total).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleVerDetalle(v.id_venta)} sx={{ color: '#ABA9C3', '&:hover': { color: '#09814A' } }}>
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(v.id_venta)} sx={{ color: '#ABA9C3', '&:hover': { color: '#DA7422' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog detalle */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth
                PaperProps={{ sx: { bgcolor: '#1a1e22' } }}>
                <DialogTitle sx={{ color: '#FFFBDB' }}>
                    Detalle de Venta #{detalle?.id_venta}
                </DialogTitle>
                <DialogContent>
                    {detalle && (
                        <Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                                {[
                                    ['Fecha', detalle.fecha],
                                    ['Cliente', detalle.cliente],
                                    ['Empleado', detalle.empleado],
                                    ['Total', `Q${parseFloat(detalle.total).toFixed(2)}`],
                                ].map(([label, val]) => (
                                    <Box key={label}>
                                        <Typography variant="caption" sx={{ color: '#ABA9C3' }}>{label}</Typography>
                                        <Typography sx={{ color: '#FFFBDB' }}>{val}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ borderColor: '#09814A', mb: 2 }} />
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal'].map(h => (
                                            <TableCell key={h} sx={{ color: '#ABA9C3', borderBottom: '1px solid #333' }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detalle.detalle?.map((d, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ color: '#FFFBDB' }}>{d.producto}</TableCell>
                                            <TableCell sx={{ color: '#ABA9C3' }}>{d.cantidad}</TableCell>
                                            <TableCell sx={{ color: '#ABA9C3' }}>Q{parseFloat(d.precio_unitario).toFixed(2)}</TableCell>
                                            <TableCell sx={{ color: '#DA7422' }}>Q{parseFloat(d.subtotal).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDetail(false)} sx={{ color: '#ABA9C3' }}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog crear venta */}
            <Dialog open={openCreate} onClose={() => { setOpenCreate(false); setError('') }}
                maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1a1e22' } }}>
                <DialogTitle sx={{ color: '#FFFBDB' }}>Nueva Venta</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField label="ID Cliente *" type="number" value={form.id_cliente}
                            onChange={e => setForm({ ...form, id_cliente: e.target.value })}
                            variant="outlined" size="small" sx={fieldSx} />
                        <TextField label="ID Empleado *" type="number" value={form.id_empleado}
                            onChange={e => setForm({ ...form, id_empleado: e.target.value })}
                            variant="outlined" size="small" sx={fieldSx} />
                    </Box>
                    <TextField label="Fecha (opcional)" type="date" value={form.fecha}
                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                        variant="outlined" size="small" InputLabelProps={{ shrink: true }} sx={fieldSx} />

                    <Divider sx={{ borderColor: '#09814A' }} />
                    <Typography sx={{ color: '#ABA9C3', fontSize: 14 }}>Productos</Typography>

                    {items.map((item, i) => (
                        <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 1, alignItems: 'center' }}>
                            <TextField label="ID Producto" type="number" value={item.id_producto}
                                onChange={e => handleItemChange(i, 'id_producto', e.target.value)}
                                variant="outlined" size="small" sx={fieldSx} />
                            <TextField label="Cantidad" type="number" value={item.cantidad}
                                onChange={e => handleItemChange(i, 'cantidad', e.target.value)}
                                variant="outlined" size="small" sx={fieldSx} />
                            <TextField label="Precio Unit." type="number" value={item.precio_unitario}
                                onChange={e => handleItemChange(i, 'precio_unitario', e.target.value)}
                                variant="outlined" size="small" sx={fieldSx} />
                            <IconButton onClick={() => removeItem(i)} disabled={items.length === 1}
                                sx={{ color: '#DA7422' }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={addItem} size="small" sx={{ color: '#09814A', alignSelf: 'flex-start' }}>
                        + Agregar producto
                    </Button>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => { setOpenCreate(false); setError('') }} sx={{ color: '#ABA9C3' }}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained"
                        sx={{ bgcolor: '#09814A', '&:hover': { bgcolor: '#076e3e' } }}>
                        Crear Venta
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
                <Alert severity="success">{success}</Alert>
            </Snackbar>
            <Snackbar open={!!error && !openCreate && !openDetail} autoHideDuration={3000} onClose={() => setError('')}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Box>
    )
}
