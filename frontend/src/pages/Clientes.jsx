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
                <Typography variant="h5" sx={{ color: '#FFFBDB', fontWeight: 700 }}>
                    Clientes
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}
                    sx={{ bgcolor: '#09814A', '&:hover': { bgcolor: '#076e3e' } }}>
                    Nuevo Cliente
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ bgcolor: '#1a1e22' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['ID', 'Nombre', 'Email', 'Teléfono', 'Dirección', 'Acciones'].map(h => (
                                <TableCell key={h} sx={{ color: '#ABA9C3', fontWeight: 700, borderBottom: '1px solid #09814A' }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map(c => (
                            <TableRow key={c.id_cliente} sx={{ '&:hover': { bgcolor: '#1f2428' } }}>
                                <TableCell sx={{ color: '#ABA9C3' }}>{c.id_cliente}</TableCell>
                                <TableCell sx={{ color: '#FFFBDB' }}>{c.nombre}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{c.email}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{c.telefono}</TableCell>
                                <TableCell sx={{ color: '#ABA9C3' }}>{c.direccion}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(c)} sx={{ color: '#ABA9C3', '&:hover': { color: '#09814A' } }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(c.id_cliente)} sx={{ color: '#ABA9C3', '&:hover': { color: '#DA7422' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: '#1a1e22', minWidth: 400 } }}>
                <DialogTitle sx={{ color: '#FFFBDB' }}>
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
