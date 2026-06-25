from app.core.exceptions import AppError


class ItemCardapioNaoEncontradoError(AppError):
    status_code = 404
    detail = "Item do cardapio nao encontrado."
