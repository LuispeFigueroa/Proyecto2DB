import { useEffect, useState } from 'react'
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Alert, Snackbar, IconButton, Chip
} from '@mui/material'
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
            setError('Todos los campos obligatorios deben completarse')
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
            setError('Error al eliminar')
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: '#FFFBDB', fontWeight: 700 }}>
                    🎸 Productos
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}
                    sx={{ bgcolor: '#09814A', '&:hover': { bgcolor: '#076e3e' } }}>
                    Nuevo Producto
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ bgcolor: '#1a1e22' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Proveedor', 'Acciones'].map(h => (
                                <TableCell key={h} sx={{ color: '#ABA9C3', fontWeight: 700, borderBottom: '1px solid #09814A' }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map(p => (
                            <TableRow key={p.id_producto} sx={{ '&:hover': { bgcolor: '#1f2428' } }}>
                                <TableCell sx={{ color: '#ABA9C3' }}>{p.id_producto}</TableCell>
                                <TableCell sx={{ color: '#FFFBDB' }}>{p.nombre}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3', maxWidth: 200 }}>{p.descripcion}</TableCell>
                                <TableCell sx={{ color: '#DA7422', fontWeight: 700 }}>Q{parseFloat(p.precio).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={p.stock}
                                        size="small"
                                        sx={{
                                            bgcolor: p.stock > 5 ? '#09814A22' : '#DA742222',
                                            color: p.stock > 5 ? '#09814A' : '#DA7422',
                                            border: `1px solid ${p.stock > 5 ? '#09814A' : '#DA7422'}`
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{p.categoria}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{p.proveedor}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(p)} sx={{ color: '#ABA9C3', '&:hover': { color: '#09814A' } }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(p.id_producto)} sx={{ color: '#ABA9C3', '&:hover': { color: '#DA7422' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal crear/editar */}
            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: '#1a1e22', minWidth: 400 } }}>
                <DialogTitle sx={{ color: '#FFFBDB' }}>
                    {editing ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {[
                        { name: 'nombre', label: 'Nombre *' },
                        { name: 'descripcion', label: 'Descripción' },
                        { name: 'precio', label: 'Precio *', type: 'number' },
                        { name: 'stock', label: 'Stock *', type: 'number' },
                        { name: 'id_categoria', label: 'ID Categoría *', type: 'number' },
                        { name: 'id_proveedor', label: 'ID Proveedor *', type: 'number' },
                    ].map(field => (
                        <TextField
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            type={field.type || 'text'}
                            value={form[field.name]}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': { color: '#FFFBDB', '& fieldset': { borderColor: '#ABA9C3' }, '&:hover fieldset': { borderColor: '#09814A' } },
                                '& .MuiInputLabel-root': { color: '#ABA9C3' },
                            }}
                        />
                    ))}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} sx={{ color: '#ABA9C3' }}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained"
                        sx={{ bgcolor: '#09814A', '&:hover': { bgcolor: '#076e3e' } }}>
                        {editing ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
                <Alert severity="success">{success}</Alert>
            </Snackbar>
        </Box>
    )
}