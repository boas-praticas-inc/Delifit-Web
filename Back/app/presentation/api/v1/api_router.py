from fastapi import APIRouter

from app.presentation.api.v1.routes import (
    admin_routes,
    auth_routes,
    cartao_routes,
    categoria_cardapio_admin_routes,
    categoria_cardapio_routes,
    cliente_routes,
    endereco_routes,
    gestor_routes,
    item_cardapio_routes,
    restaurante_routes,
    solicitacao_adesao_restaurante_routes,
    upload_routes,
    usuario_routes,
)

api_router = APIRouter()
api_router.include_router(auth_routes.router)
api_router.include_router(cartao_routes.router)
api_router.include_router(usuario_routes.router)
api_router.include_router(admin_routes.router)
api_router.include_router(categoria_cardapio_admin_routes.router)
api_router.include_router(categoria_cardapio_routes.router)
api_router.include_router(cliente_routes.router)
api_router.include_router(gestor_routes.router)
api_router.include_router(restaurante_routes.router)
api_router.include_router(item_cardapio_routes.router)
api_router.include_router(solicitacao_adesao_restaurante_routes.router)
api_router.include_router(endereco_routes.router)
api_router.include_router(upload_routes.router)

