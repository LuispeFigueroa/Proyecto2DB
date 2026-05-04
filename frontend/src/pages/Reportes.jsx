import { useEffect, useState } from 'react'
import {
    Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TextField,
    Button, Alert, CircularProgress
} from '@mui/material'
import api from '../api/axios'

function TabPanel({ value, index, children }) {
    return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null
}

function ReportTable({ columns, rows, keyField }) {
    return (
        <TableContainer component={Paper} sx={{ bgcolor: '#1a1e22' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columns.map(col => (
                            <TableCell key={col.key} sx={{ color: '#ABA9C3', fontWeight: 700, borderBottom: '1px solid #09814A' }}>
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={row[keyField] ?? i} sx={{ '&:hover': { bgcolor: '#1f2428' } }}>
                            {columns.map(col => (
                                <TableCell key={col.key} sx={{ color: col.highlight ? '#DA7422' : '#ABA9C3' }}>
                                    {col.format ? col.format(row[col.key]) : row[col.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default function Reportes() {
    const [tab, setTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [ventasMes, setVentasMes] = useState([])
    const [topProductos, setTopProductos] = useState([])
    const [ventasCliente, setVentasCliente] = useState([])
    const [ventasPeriodo, setVentasPeriodo] = useState([])
    const [desde, setDesde] = useState('')
    const [hasta, setHasta] = useState('')

    // Nuevos estados
    const [vistaVentas, setVistaVentas] = useState([])
    const [clientesGuitarristas, setClientesGuitarristas] = useState([])
    const [productosSinVentas, setProductosSinVentas] = useState([])

    const load = async (fn) => {
        setLoading(true); setError('')
        try { await fn() } catch { setError('Error al cargar reporte') }
        finally { setLoading(false) }
    }

    useEffect(() => { load(() => api.get('/reportes/ventas-por-mes').then(r => setVentasMes(r.data))) }, [])
    useEffect(() => { load(() => api.get('/reportes/productos-mas-vendidos').then(r => setTopProductos(r.data))) }, [])
    useEffect(() => { load(() => api.get('/reportes/ventas-por-cliente').then(r => setVentasCliente(r.data))) }, [])
    useEffect(() => { load(() => api.get('/reportes/vista-ventas').then(r => setVistaVentas(r.data))) }, [])
    useEffect(() => { load(() => api.get('/reportes/clientes-guitarristas').then(r => setClientesGuitarristas(r.data))) }, [])
    useEffect(() => { load(() => api.get('/reportes/productos-sin-ventas').then(r => setProductosSinVentas(r.data))) }, [])

    const buscarPeriodo = () => {
        if (!desde || !hasta) { setError('Ingresa fecha inicio y fin'); return }
        load(() => api.get(`/reportes/ventas-por-periodo?desde=${desde}&hasta=${hasta}`).then(r => setVentasPeriodo(r.data)))
    }

    const q = val => `Q${parseFloat(val || 0).toFixed(2)}`

    const tabSx = { color: '#ABA9C3', '&.Mui-selected': { color: '#09814A' } }

    return (
        <Box>
            <Typography variant="h5" sx={{ color: '#FFFBDB', fontWeight: 700, mb: 3 }}>
                Reportes
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                TabIndicatorProps={{ style: { backgroundColor: '#09814A' } }}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Ventas por Mes" sx={tabSx} />
                <Tab label="Top Productos" sx={tabSx} />
                <Tab label="Por Cliente" sx={tabSx} />
                <Tab label="Por Período" sx={tabSx} />
                <Tab label="Vista Detallada" sx={tabSx} />
                <Tab label="Clientes Guitarristas" sx={tabSx} />
                <Tab label="Sin Ventas" sx={tabSx} />
            </Tabs>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress sx={{ color: '#09814A' }} /></Box>}

            {!loading && (
                <>
                    {/* Tab 0 - GROUP BY + HAVING */}
                    <TabPanel value={tab} index={0}>
                        <ReportTable
                            keyField="mes"
                            columns={[
                                { key: 'mes', label: 'Mes' },
                                { key: 'total_ventas', label: 'Ventas' },
                                { key: 'ingresos', label: 'Ingresos', highlight: true, format: q },
                            ]}
                            rows={ventasMes}
                        />
                    </TabPanel>

                    {/* Tab 1 - CTE */}
                    <TabPanel value={tab} index={1}>
                        <ReportTable
                            keyField="producto"
                            columns={[
                                { key: 'ranking', label: '#' },
                                { key: 'producto', label: 'Producto' },
                                { key: 'categoria', label: 'Categoría' },
                                { key: 'unidades_vendidas', label: 'Unidades' },
                                { key: 'ingresos_totales', label: 'Ingresos', highlight: true, format: q },
                            ]}
                            rows={topProductos}
                        />
                    </TabPanel>

                    {/* Tab 2 - JOIN múltiple */}
                    <TabPanel value={tab} index={2}>
                        <ReportTable
                            keyField="cliente"
                            columns={[
                                { key: 'cliente', label: 'Cliente' },
                                { key: 'cantidad_compras', label: 'Compras' },
                                { key: 'total_gastado', label: 'Total Gastado', highlight: true, format: q },
                            ]}
                            rows={ventasCliente}
                        />
                    </TabPanel>

                    {/* Tab 3 - JOIN con filtro por periodo */}
                    <TabPanel value={tab} index={3}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                            <TextField label="Desde" type="date" value={desde}
                                onChange={e => setDesde(e.target.value)}
                                InputLabelProps={{ shrink: true }} size="small"
                                sx={{ '& .MuiOutlinedInput-root': { color: '#FFFBDB', '& fieldset': { borderColor: '#ABA9C3' } }, '& .MuiInputLabel-root': { color: '#ABA9C3' } }} />
                            <TextField label="Hasta" type="date" value={hasta}
                                onChange={e => setHasta(e.target.value)}
                                InputLabelProps={{ shrink: true }} size="small"
                                sx={{ '& .MuiOutlinedInput-root': { color: '#FFFBDB', '& fieldset': { borderColor: '#ABA9C3' } }, '& .MuiInputLabel-root': { color: '#ABA9C3' } }} />
                            <Button variant="contained" onClick={buscarPeriodo}
                                sx={{ bgcolor: '#09814A', '&:hover': { bgcolor: '#076e3e' } }}>
                                Buscar
                            </Button>
                        </Box>
                        {ventasPeriodo.length > 0 && (
                            <ReportTable
                                keyField="id_venta"
                                columns={[
                                    { key: 'id_venta', label: 'ID' },
                                    { key: 'fecha', label: 'Fecha' },
                                    { key: 'cliente', label: 'Cliente' },
                                    { key: 'empleado', label: 'Empleado' },
                                    { key: 'total', label: 'Total', highlight: true, format: q },
                                ]}
                                rows={ventasPeriodo}
                            />
                        )}
                    </TabPanel>

                    {/* Tab 4 - VIEW */}
                    <TabPanel value={tab} index={4}>
                        <Typography variant="body2" sx={{ color: '#ABA9C3', mb: 2 }}>
                            Datos obtenidos desde la vista <code>vista_ventas_detalladas</code>
                        </Typography>
                        <ReportTable
                            keyField="id_venta"
                            columns={[
                                { key: 'id_venta', label: 'ID Venta' },
                                { key: 'fecha', label: 'Fecha' },
                                { key: 'cliente', label: 'Cliente' },
                                { key: 'empleado', label: 'Empleado' },
                                { key: 'producto', label: 'Producto' },
                                { key: 'cantidad', label: 'Cant.' },
                                { key: 'precio_unitario', label: 'Precio Unit.', format: q },
                                { key: 'subtotal', label: 'Subtotal', highlight: true, format: q },
                            ]}
                            rows={vistaVentas}
                        />
                    </TabPanel>

                    {/* Tab 5 - Subquery IN */}
                    <TabPanel value={tab} index={5}>
                        <Typography variant="body2" sx={{ color: '#ABA9C3', mb: 2 }}>
                            Clientes que han comprado guitarras — consulta con subquery <code>IN</code>
                        </Typography>
                        <ReportTable
                            keyField="id_cliente"
                            columns={[
                                { key: 'id_cliente', label: 'ID' },
                                { key: 'nombre', label: 'Cliente' },
                                { key: 'email', label: 'Email' },
                                { key: 'telefono', label: 'Teléfono' },
                            ]}
                            rows={clientesGuitarristas}
                        />
                    </TabPanel>

                    {/* Tab 6 - Subquery EXISTS */}
                    <TabPanel value={tab} index={6}>
                        <Typography variant="body2" sx={{ color: '#ABA9C3', mb: 2 }}>
                            Productos que nunca han sido vendidos — consulta con <code>NOT EXISTS</code>
                        </Typography>
                        <ReportTable
                            keyField="id_producto"
                            columns={[
                                { key: 'id_producto', label: 'ID' },
                                { key: 'nombre', label: 'Producto' },
                                { key: 'precio', label: 'Precio', highlight: true, format: q },
                                { key: 'stock', label: 'Stock' },
                            ]}
                            rows={productosSinVentas}
                        />
                    </TabPanel>
                </>
            )}
        </Box>
    )
}