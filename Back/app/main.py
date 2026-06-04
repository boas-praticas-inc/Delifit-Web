from fastapi import FastAPI

from app.core.config import settings
from app.core.exceptions import configure_exception_handlers
from app.presentation.api.v1.api_router import api_router
from app.presentation.api.v1.routes.health_routes import router as health_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, debug=settings.debug)
    configure_exception_handlers(app)
    app.include_router(health_router)
    app.include_router(api_router, prefix="/api/v1")
    return app


app = create_app()
