from fastapi import APIRouter

from app.presentation.api.v1.routes import usuario_routes

api_router = APIRouter()
api_router.include_router(usuario_routes.router)
