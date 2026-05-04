import { useEffect, useState } from 'react'
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Alert, Snackbar, IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../api/axios'

const empty = { nombre: '', email: '', telefono: '', direccion: '' }

export default function Clientes() {
    const [clientes, setClientes] = useState([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(empty)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchClientes = async () => {
        try {
            const res = await api.get('/clientes')
            setClientes(res.data)
        } catch {
            setError('Error al cargar clientes')
        }
    }

    useEffect(() => { fetchClientes() }, [])

    const handleOpen = (cliente = null) => {
        if (cliente) {
            setEditing(cliente.id_cliente)
            setForm({
                nombre: cliente.nombre,
                email: cliente.email || '',
                telefono: cliente.telefono || '',
                direccion: cliente.direccion || '',
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
        if (!form.nombre) { setError('El nombre es obligatorio'); return }
        try {
            if (editing) {
                await api.put(`/clientes/${editing}`, form)
                setSuccess('Cliente actualizado')
            } else {
                await api.post('/clientes', form)
                setSuccess('Cliente creado')
            }
            handleClose()
            fetchClientes()
        } catch (e) {
            setError(e.response?.data?.detail || 'Error al guardar')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este cliente?')) return
        try {
            await api.delete(`/clientes/${id}`)
            setSuccess('Cliente eliminado')
            fetchClientes()
        } catch {
            setError('Error al eliminar')
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                        Clientes
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500 }}>
                        {clientes.length} clientes registrados
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Nuevo Cliente
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['ID', 'Nombre', 'Email', 'Teléfono', 'Dirección', 'Acciones'].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700 }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map(c => (
                            <TableRow key={c.id_cliente} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                <TableCell>{c.id_cliente}</TableCell>
                                <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{c.nombre}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell>{c.telefono}</TableCell>
                                <TableCell>{c.direccion}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(c)} sx={{ '&:hover': { color: 'primary.main' } }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(c.id_cliente)} sx={{ '&:hover': { color: 'error.main' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: 400 } }}>
                <DialogTitle>
                    {editing ? 'Editar Cliente' : 'Nuevo Cliente'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {[
                        { name: 'nombre', label: 'Nombre *' },
                        { name: 'email', label: 'Email' },
                        { name: 'telefono', label: 'Teléfono' },
                        { name: 'direccion', label: 'Dirección' },
                    ].map(field => (
                        <TextField
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            value={form[field.name]}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    ))}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
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
