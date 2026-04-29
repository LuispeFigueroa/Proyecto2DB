from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
from typing import List, Optional
from datetime import date

router = APIRouter()

class DetalleItem(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario: float

class VentaBase(BaseModel):
    id_cliente: int
    id_empleado: int
    fecha: Optional[date] = None
    detalle: List[DetalleItem]

@router.get("/")
def get_ventas():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT v.id_venta, v.fecha, v.total, c.nombre AS cliente, e.nombre AS empleado
            FROM ventas v
            JOIN clientes c ON c.id_cliente = v.id_cliente
            JOIN empleados e ON e.id_empleado = v.id_empleado
            ORDER BY v.id_venta
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

@router.get("/{id_venta}")
def get_venta(id_venta: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT v.id_venta, v.fecha, v.total, c.nombre AS cliente, e.nombre AS empleado
            FROM ventas v
            JOIN clientes c ON c.id_cliente = v.id_cliente
            JOIN empleados e ON e.id_empleado = v.id_empleado
            WHERE v.id_venta = %s
        """, (id_venta,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Venta no encontrada")
        cols = [d[0] for d in cur.description]
        venta = dict(zip(cols, row))

        cur.execute("""
            SELECT dv.id_detalle, p.nombre AS producto, dv.cantidad,
                   dv.precio_unitario, (dv.cantidad * dv.precio_unitario) AS subtotal
            FROM detalle_venta dv
            JOIN productos p ON p.id_producto = dv.id_producto
            WHERE dv.id_venta = %s
        """, (id_venta,))
        detail_rows = cur.fetchall()
        detail_cols = [d[0] for d in cur.description]
        venta["detalle"] = [dict(zip(detail_cols, r)) for r in detail_rows]
        return venta
    finally:
        cur.close()
        conn.close()

@router.post("/", status_code=201)
def crear_venta(v: VentaBase):
    if not v.detalle:
        raise HTTPException(status_code=400, detail="La venta debe tener al menos un producto")
    total = sum(item.cantidad * item.precio_unitario for item in v.detalle)
    conn = get_connection()
    cur = conn.cursor()
    try:
        if v.fecha:
            cur.execute(
                "INSERT INTO ventas(fecha, total, id_cliente, id_empleado) VALUES(%s,%s,%s,%s) RETURNING id_venta",
                (v.fecha, total, v.id_cliente, v.id_empleado)
            )
        else:
            cur.execute(
                "INSERT INTO ventas(total, id_cliente, id_empleado) VALUES(%s,%s,%s) RETURNING id_venta",
                (total, v.id_cliente, v.id_empleado)
            )
        id_venta = cur.fetchone()[0]
        for item in v.detalle:
            cur.execute(
                "INSERT INTO detalle_venta(cantidad, precio_unitario, id_venta, id_producto) VALUES(%s,%s,%s,%s)",
                (item.cantidad, item.precio_unitario, id_venta, item.id_producto)
            )
        conn.commit()
        return {"id_venta": id_venta, "total": total, "message": "Venta creada exitosamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.delete("/{id_venta}")
def eliminar_venta(id_venta: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM detalle_venta WHERE id_venta = %s", (id_venta,))
        cur.execute("DELETE FROM ventas WHERE id_venta = %s", (id_venta,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Venta no encontrada")
        return {"message": "Venta eliminada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()
