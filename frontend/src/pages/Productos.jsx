import { useEffect, useState } from 'react'
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Alert, Snackbar, IconButton, Chip
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../api/axios'

const empty = { nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', id_proveedor: '' }

export default function Productos() {
    const [productos, setProductos] = useState([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(empty)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchProductos = async () => {
        try {
            const res = await api.get('/productos')
            setProductos(res.data)
        } catch {
            setError('Error al cargar productos')
        }
    }

    useEffect(() => { fetchProductos() }, [])

    const handleOpen = (producto = null) => {
        if (producto) {
            setEditing(producto.id_producto)
            setForm({
                nombre: producto.nombre,
                descripcion: producto.descripcion || '',
                precio: producto.precio,
                stock: producto.stock,
                id_categoria: producto.id_categoria || '',
                id_proveedor: producto.id_proveedor || '',
            })
        } else {
            setEditing(null)
            setForm(empty)
        }
        setOpen(true)
    }

    const handleClose = () => { setOpen(false); setError('') }
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        if (!form.nombre || !form.precio || !form.stock || !form.id_categoria || !form.id_proveedor) {
            setError('Completa todos los campos obligatorios')
            return
        }
        try {
            const payload = {
                ...form,
                precio: parseFloat(form.precio),
                stock: parseInt(form.stock),
                id_categoria: parseInt(form.id_categoria),
                id_proveedor: parseInt(form.id_proveedor),
            }
            if (editing) {
                await api.put(`/productos/${editing}`, payload)
                setSuccess('Producto actualizado')
            } else {
                await api.post('/productos', payload)
                setSuccess('Producto creado')
            }
            handleClose()
            fetchProductos()
        } catch (e) {
            setError(e.response?.data?.detail || 'Error al guardar')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este producto?')) return
        try {
            await api.delete(`/productos/${id}`)
            setSuccess('Producto eliminado')
            fetchProductos()
        } catch {
            setError('Error al eliminar — puede tener ventas asociadas')
        }
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        Productos
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500, mt: 0.5 }}>
                        {productos.length} productos en inventario
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ borderRadius: 2 }}>
                    Nuevo producto
                </Button>
            </Box>

            {/* Tabla */}
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['#', 'Nombre', 'Categoría', 'Proveedor', 'Precio', 'Stock', ''].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 500, fontSize: 12 }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map(p => (
                            <TableRow key={p.id_producto} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                <TableCell sx={{ fontSize: 13 }}>
                                    {String(p.id_producto).padStart(3, '0')}
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ color: 'text.primary', fontSize: 13, fontWeight: 500 }}>
                                        {p.nombre}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>
                                        {p.descripcion?.substring(0, 40)}{p.descripcion?.length > 40 ? '...' : ''}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ fontSize: 13 }}>{p.categoria}</TableCell>
                                <TableCell sx={{ fontSize: 13 }}>{p.proveedor}</TableCell>
                                <TableCell sx={{ color: 'warning.main', fontWeight: 500, fontSize: 13 }}>
                                    Q{parseFloat(p.precio).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${p.stock} unid.`}
                                        size="small"
                                        sx={{
                                            bgcolor: p.stock > 5 ? alpha('#2e7d32', 0.1) : alpha('#F6AE2D', 0.15),
                                            color: p.stock > 5 ? 'success.main' : 'warning.main',
                                            border: `0.5px solid ${p.stock > 5 ? alpha('#2e7d32', 0.3) : alpha('#F6AE2D', 0.4)}`,
                                            fontSize: 11,
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(p)} size="small"
                                        sx={{ mr: 0.5, '&:hover': { color: 'primary.main' } }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(p.id_producto)} size="small"
                                        sx={{ '&:hover': { color: 'error.main' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal */}
            <Dialog open={open} onClose={handleClose}
                PaperProps={{ sx: { borderRadius: 3, minWidth: 420 } }}>
                <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
                    {editing ? 'Editar producto' : 'Nuevo producto'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
                    {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField name="nombre" label="Nombre *" value={form.nombre} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
                        <TextField name="descripcion" label="Descripción" value={form.descripcion} onChange={handleChange} size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }} />
                        <TextField name="precio" label="Precio *" type="number" value={form.precio} onChange={handleChange} size="small" />
                        <TextField name="stock" label="Stock *" type="number" value={form.stock} onChange={handleChange} size="small" />
                        <TextField name="id_categoria" label="ID Categoría *" type="number" value={form.id_categoria} onChange={handleChange} size="small" />
                        <TextField name="id_proveedor" label="ID Proveedor *" type="number" value={form.id_proveedor} onChange={handleChange} size="small" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary', borderRadius: 2 }}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
                        {editing ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
            </Snackbar>
        </Box>
    )
}
