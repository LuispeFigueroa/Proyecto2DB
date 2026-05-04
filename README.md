# Tienda Musical — Proyecto 2

Aplicación web para gestionar el inventario y ventas de una tienda de instrumentos musicales.

Desarrollada con React, FastAPI y PostgreSQL. Desplegada mediante Docker.

**README y parte de la documentacion fueron asistidas por IA**

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker + Docker Compose |

---

## Requisitos

- Docker Desktop instalado y corriendo
- Git

No se requiere instalar Python, Node.js ni ninguna otra dependencia de forma local. Docker se encarga de todo.

---

## Instrucciones para correr el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/LuispeFigueroa/Proyecto2DB.git
cd Proyecto2DB
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` ya viene con las credenciales correctas. No es necesario modificarlo.

### 3. Levantar el proyecto

```bash
docker compose up --build
```

Este comando levanta los tres servicios automáticamente:

- Base de datos PostgreSQL, inicializada con el esquema y datos de prueba
- Backend FastAPI
- Frontend React

La primera vez puede tardar unos minutos mientras Docker descarga las imágenes y construye los contenedores.

### 4. Acceder a la aplicación

Una vez que los tres servicios estén corriendo, abrir en el navegador:

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:5173 |
| API | http://localhost:8000 |
| Documentación API | http://localhost:8000/docs |

### 5. Detener el proyecto

```bash
docker compose down
```

Para eliminar también los datos almacenados:

```bash
docker compose down -v
```

---

## Credenciales de base de datos

| Variable | Valor |
|---|---|
| Usuario | proy2 |
| Contrasena | secret |
| Base de datos | tienda_db |
| Host | db |

---

## Estructura del proyecto

```
Proyecto2DB/
├── docker-compose.yml
├── .env.example
├── README.md
├── db/
│   └── init.sql
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── database.py
│   └── routers/
│       ├── productos.py
│       ├── clientes.py
│       ├── ventas.py
│       └── reportes.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
```

---

## Base de datos

El esquema incluye las siguientes tablas:

- `categorias` — categorias de productos
- `proveedores` — empresas que surten los productos
- `productos` — instrumentos y accesorios con precio y stock
- `clientes` — personas que realizan compras
- `empleados` — personal que atiende las ventas
- `ventas` — registro de cada transaccion
- `detalle_venta` — productos incluidos en cada venta
- `usuarios` — cuentas de acceso para empleados

Todas las tablas incluyen al menos 25 registros de prueba. El esquema se inicializa automaticamente al levantar el contenedor de base de datos.

---

## Normalizacion

**1FN** — Todas las tablas tienen atributos atomicos. Se creo `detalle_venta` para evitar listas de productos dentro de `ventas`. Categorias y proveedores tienen su propia tabla en lugar de guardarse como texto dentro de `productos`.

**2FN** — No hay dependencias parciales. `detalle_venta` usa PK simple (`id_detalle`) y todos sus atributos dependen completamente de ella. El `precio_unitario` depende del detalle especifico y no solo del producto, porque el precio puede cambiar con el tiempo.

**3FN** — No hay dependencias transitivas. El nombre de la categoria vive en `categorias`, no en `productos`. Lo mismo aplica para proveedor, cliente y empleado. Ningun atributo no-clave depende de otro atributo no-clave.

---

## Endpoints

### Productos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /productos | Lista todos los productos |
| GET | /productos/{id} | Obtiene un producto |
| POST | /productos | Crea un producto |
| PUT | /productos/{id} | Actualiza un producto |
| DELETE | /productos/{id} | Elimina un producto |

### Clientes

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /clientes | Lista todos los clientes |
| GET | /clientes/{id} | Obtiene un cliente |
| POST | /clientes | Crea un cliente |
| PUT | /clientes/{id} | Actualiza un cliente |
| DELETE | /clientes/{id} | Elimina un cliente |

### Ventas

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /ventas | Lista todas las ventas |
| GET | /ventas/{id} | Obtiene una venta con su detalle |
| POST | /ventas | Registra una venta |
| DELETE | /ventas/{id} | Elimina una venta |

### Reportes

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /reportes/ventas-por-mes | Ventas agrupadas por mes con GROUP BY y HAVING |
| GET | /reportes/productos-mas-vendidos | Ranking con CTE |
| GET | /reportes/ventas-por-cliente | Total gastado por cliente |
| GET | /reportes/ventas-por-periodo | Ventas filtradas por rango de fechas |
| GET | /reportes/vista-ventas | Datos desde la vista vista_ventas_detalladas |
| GET | /reportes/clientes-guitarristas | Subquery con IN |
| GET | /reportes/productos-sin-ventas | Subquery con NOT EXISTS |

---



Luis Pedro Figueroa
Universidad del Valle de Guatemala
CC3088 - Bases de Datos 1, Ciclo 1 2026
