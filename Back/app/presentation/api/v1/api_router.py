from fastapi import APIRouter

from app.presentation.api.v1.routes import admin_routes
from app.presentation.api.v1.routes import auth_routes
from app.presentation.api.v1.routes import cliente_routes
from app.presentation.api.v1.routes import endereco_routes
from app.presentation.api.v1.routes import gestor_routes
from app.presentation.api.v1.routes import restaurante_routes
from app.presentation.api.v1.routes import solicitacao_adesao_restaurante_routes
from app.presentation.api.v1.routes import usuario_routes

api_router = APIRouter()
api_router.include_router(auth_routes.router)
api_router.include_router(usuario_routes.router)
api_router.include_router(admin_routes.router)
api_router.include_router(cliente_routes.router)
api_router.include_router(gestor_routes.router)
api_router.include_router(restaurante_routes.router)
api_router.include_router(solicitacao_adesao_restaurante_routes.router)
api_router.include_router(endereco_routes.router)
