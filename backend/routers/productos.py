from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection

router = APIRouter()

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int
    id_categoria: int
    id_proveedor: int

#Get de todos los productos 
@router.get("/")
def get_productos():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT  p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, c.nombre AS categoria, pr.nombre AS proveedor
            FROM productos p 
            JOIN categorias c ON c.id_categoria = p.id_categoria
            JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
            ORDER BY p.id_producto
            """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()
#Get de un producto especifico por id
@router.get("/{id_producto}")
def get_producto(id_producto: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock,
            c.nombre AS categoria, pr.nombre AS proveedor
            FROM productos p
            JOIN categorias c ON c.id_categoria = p.id_categoria
            JOIN proveedores pr on pr.id_proveedor = p.id_proveedor
            WHERE p.id_producto = %s
            """,(id_producto,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        cols = [d[0] for d in cur.description]
        return dict(zip(cols, row))
    finally:
        cur.close()
        conn.close() 

#post para crear un producto
@router.post("/", status_code = 201)
def crear_producto(p: ProductoBase):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO productos(nombre,descripcion,precio,stock,id_categoria,id_proveedor)
            VALUES(%s,%s,%s,%s,%s,%s)
            RETURNING id_producto
            """, (p.nombre,p.descripcion,p.precio,p.stock,p.id_categoria,p.id_proveedor))
        conn.commit()
        return {"id_producto": cur.fetchone()[0], "message": "Producto creado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

#post para actualizar un producto
@router.put("/{id_producto}")
def actualizar_producto(id_producto: int, p: ProductoBase):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE productos
            SET nombre = %s, descripcion = %s, precio = %s, stock = %s, id_categoria = %s, id_proveedor = %s
            WHERE id_producto = %s
            """, (p.nombre,p.descripcion,p.precio,p.stock,p.id_categoria,p.id_proveedor,id_producto))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"message":"Producto actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

#delete para eliminar un producto
@router.delete("/{id_producto}")
def eliminar_producto(id_producto: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            DELETE FROM productos
            WHERE id_producto = %s
            """, (id_producto,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"message" : "Producto eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()