from app.core.exceptions import AppError


class RestauranteNaoEncontradoError(AppError):
    status_code = 404
    detail = "Restaurante nao encontrado."


class CnpjJaCadastradoError(AppError):
    status_code = 409
    detail = "CNPJ ja cadastrado."
