#  Tienda Musical — Proyecto 2

Aplicación web para gestionar el inventario y ventas de una tienda de instrumentos musicales.  
Desarrollada con **React + FastAPI + PostgreSQL**, desplegada con **Docker**.

---

##  Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker + Docker Compose |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

---

##  Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/LuispeFigueroa/Proyecto2DB.git
cd Proyecto2DB
```

### 2. Crear el archivo de variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` ya viene configurado con las credenciales requeridas. No es necesario modificarlo.

### 3. Levantar el proyecto

```bash
docker compose up --build
```

Esto levanta automáticamente los tres servicios:
- Base de datos PostgreSQL (inicializada con el esquema y datos de prueba)
- Backend FastAPI
- Frontend React

### 4. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Documentación API | http://localhost:8000/docs |

---

##  Credenciales

### Base de datos
| Variable | Valor |
|---|---|
| Usuario | `proy2` |
| Contraseña | `secret` |
| Base de datos | `tienda_db` |
| Host | `db` (dentro de Docker) |

### Aplicación (usuarios de prueba)
| Usuario | Contraseña |
|---|---|
| `rene.p` | `password123` |
| `pedro.j` | `password123` |

---

##  Estructura del proyecto
---

## Diseño de base de datos

### Entidades

| Tabla | Descripción |
|---|---|
| `categorias` | Categorías de productos (Guitarras, Teclados, etc.) |
| `proveedores` | Empresas que surten los productos |
| `productos` | Instrumentos y accesorios con precio y stock |
| `clientes` | Personas que compran en la tienda |
| `empleados` | Personal que atiende las ventas |
| `ventas` | Registro de cada venta realizada |
| `detalle_venta` | Productos específicos de cada venta |
| `usuarios` | Cuentas de acceso para empleados |

### Normalización

**1FN** — Todas las tablas tienen atributos atómicos. Se creó `detalle_venta` para evitar listas de productos dentro de `ventas`. Categorías y proveedores tienen su propia tabla en lugar de guardarse como texto dentro de `productos`.

**2FN** — No hay dependencias parciales. `detalle_venta` usa PK simple (`id_detalle`) y todos sus atributos dependen completamente de ella. El `precio_unitario` depende del detalle específico y no solo del producto.

**3FN** — No hay dependencias transitivas. Ningún atributo no-clave depende de otro atributo no-clave. El nombre de la categoría vive en `categorias`, no en `productos`. Lo mismo aplica para proveedor, cliente y empleado.

### Índices

```sql
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_ventas_fecha     ON ventas(fecha);
CREATE INDEX idx_detalle_id_venta ON detalle_venta(id_venta);
```

---

## Endpoints principales

### Productos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/productos` | Lista todos los productos |
| GET | `/productos/{id}` | Obtiene un producto |
| POST | `/productos` | Crea un producto |
| PUT | `/productos/{id}` | Actualiza un producto |
| DELETE | `/productos/{id}` | Elimina un producto |

### Clientes
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/clientes` | Lista todos los clientes |
| GET | `/clientes/{id}` | Obtiene un cliente |
| POST | `/clientes` | Crea un cliente |
| PUT | `/clientes/{id}` | Actualiza un cliente |
| DELETE | `/clientes/{id}` | Elimina un cliente |

### Ventas
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/ventas` | Lista todas las ventas |
| POST | `/ventas` | Registra una venta (transacción explícita) |

### Reportes
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/reportes/ventas-por-categoria` | Ventas agrupadas por categoría |
| GET | `/reportes/productos-mas-vendidos` | Ranking de productos (CTE) |
| GET | `/reportes/clientes-activos` | Clientes con compras recientes |

---
##  Probar la API

La documentación interactiva está disponible en **http://localhost:8000/docs**.

---

##  Detener el proyecto

```bash
docker compose down
```

Para eliminar también los datos de la base de datos:

```bash
docker compose down -v
```

---

##  Autor

Luis Pedro Figueroa  
Universidad del Valle de Guatemala  
CC3088 - Bases de Datos 1 — Ciclo 1, 2026
