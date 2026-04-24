from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import productos, clientes, ventas, reportes

app = FastAPI(title="Tienda LP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos.router, prefix="/productos",tags=["Productos"])
app.include_router(clientes.router, prefix="/clientes",tags=["Clientes"])
app.include_router(ventas.router, prefix="/ventas",tags=["Ventas"])
app.include_router(reportes.router, prefix="/reportes",tags=["Reportes"])

@app.get("/")
def root():
    return {"message": "Tienda LP en linea"}