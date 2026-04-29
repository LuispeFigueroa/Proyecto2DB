from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
from typing import Optional

router = APIRouter()

class ClienteBase(BaseModel):
    nombre: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None

@router.get("/")
def get_clientes():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id_cliente, nombre, email, telefono, direccion FROM clientes ORDER BY id_cliente")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()

@router.get("/{id_cliente}")
def get_cliente(id_cliente: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id_cliente, nombre, email, telefono, direccion FROM clientes WHERE id_cliente = %s",
            (id_cliente,)
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        cols = [d[0] for d in cur.description]
        return dict(zip(cols, row))
    finally:
        cur.close()
        conn.close()

@router.post("/", status_code=201)
def crear_cliente(c: ClienteBase):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO clientes(nombre, email, telefono, direccion) VALUES(%s,%s,%s,%s) RETURNING id_cliente",
            (c.nombre, c.email, c.telefono, c.direccion)
        )
        conn.commit()
        return {"id_cliente": cur.fetchone()[0], "message": "Cliente creado exitosamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.put("/{id_cliente}")
def actualizar_cliente(id_cliente: int, c: ClienteBase):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE clientes SET nombre=%s, email=%s, telefono=%s, direccion=%s WHERE id_cliente=%s",
            (c.nombre, c.email, c.telefono, c.direccion, id_cliente)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        return {"message": "Cliente actualizado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.delete("/{id_cliente}")
def eliminar_cliente(id_cliente: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM clientes WHERE id_cliente = %s", (id_cliente,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        return {"message": "Cliente eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()
