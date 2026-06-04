from app.presentation.api.v1.routes.health_routes import health_check


def test_health_check() -> None:
    assert health_check() == {"status": "ok", "app": "Delifit API"}
