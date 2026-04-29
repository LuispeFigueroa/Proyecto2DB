from fastapi import APIRouter, Query
from database import get_connection

router = APIRouter()

# Usa la vista vista_ventas_detalladas 
@router.get("/vista-ventas")
def vista_ventas():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT * FROM vista_ventas_detalladas
            ORDER BY id_venta DESC
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()



# Ventas por mes con HAVING para filtrar meses con más de 1 venta
@router.get("/ventas-por-mes")
def ventas_por_mes():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes,
                   COUNT(*) AS total_ventas,
                   SUM(total) AS ingresos
            FROM ventas
            GROUP BY mes
            HAVING COUNT(*) >= 1
            ORDER BY mes
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

# Ranking de productos más vendidos 
@router.get("/productos-mas-vendidos")
def productos_mas_vendidos(limite: int = Query(10, ge=1, le=100)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            WITH ranking_productos AS (
                SELECT p.id_producto,
                       p.nombre AS producto,
                       c.nombre AS categoria,
                       SUM(dv.cantidad) AS unidades_vendidas,
                       SUM(dv.cantidad * dv.precio_unitario) AS ingresos_totales
                FROM detalle_venta dv
                JOIN productos p ON p.id_producto = dv.id_producto
                JOIN categorias c ON c.id_categoria = p.id_categoria
                GROUP BY p.id_producto, p.nombre, c.nombre
            )
            SELECT *, RANK() OVER (ORDER BY unidades_vendidas DESC) AS ranking
            FROM ranking_productos
            ORDER BY ranking
            LIMIT %s
        """, (limite,))
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

# Clientes que han comprado instrumentos de la categoría Guitarras 
@router.get("/clientes-guitarristas")
def clientes_guitarristas():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT id_cliente, nombre, email, telefono
            FROM clientes
            WHERE id_cliente IN (
                SELECT DISTINCT v.id_cliente
                FROM ventas v
                JOIN detalle_venta dv ON dv.id_venta = v.id_venta
                JOIN productos p ON p.id_producto = dv.id_producto
                WHERE p.id_categoria = (
                    SELECT id_categoria FROM categorias WHERE nombre = 'Guitarras'
                )
            )
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

# Productos que nunca han sido vendidos
@router.get("/productos-sin-ventas")
def productos_sin_ventas():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT p.id_producto, p.nombre, p.precio, p.stock
            FROM productos p
            WHERE NOT EXISTS (
                SELECT 1
                FROM detalle_venta dv
                WHERE dv.id_producto = p.id_producto
            )
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

# Ventas por cliente y el total del precio
@router.get("/ventas-por-cliente")
def ventas_por_cliente():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT c.nombre AS cliente,
                   COUNT(v.id_venta) AS cantidad_compras,
                   COALESCE(SUM(v.total), 0) AS total_gastado
            FROM clientes c
            LEFT JOIN ventas v ON v.id_cliente = c.id_cliente
            GROUP BY c.id_cliente, c.nombre
            ORDER BY total_gastado DESC
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

@router.get("/ventas-por-periodo")
#definir un periodo de tiempo para poder hacer un reporte de ventas en esas fechar 
def ventas_por_periodo(
    desde: str = Query(..., description="Fecha inicio YYYY-MM-DD"),
    hasta: str = Query(..., description="Fecha fin YYYY-MM-DD")
):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT v.id_venta, v.fecha, v.total,
                   c.nombre AS cliente, e.nombre AS empleado
            FROM ventas v
            JOIN clientes c ON c.id_cliente = v.id_cliente
            JOIN empleados e ON e.id_empleado = v.id_empleado
            WHERE v.fecha BETWEEN %s AND %s
            ORDER BY v.fecha
        """, (desde, hasta))
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()