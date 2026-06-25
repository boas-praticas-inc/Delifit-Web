from app.core.exceptions import AppError


class CategoriaCardapioNaoEncontradaError(AppError):
    status_code = 404
    detail = "Categoria do cardapio nao encontrada."


class CategoriaCardapioJaExisteError(AppError):
    status_code = 409
    detail = "Categoria do cardapio ja cadastrada."


class CategoriaCardapioEmUsoError(AppError):
    status_code = 409
    detail = "Categoria do cardapio possui itens vinculados."
