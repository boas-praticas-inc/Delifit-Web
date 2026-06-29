from app.core.exceptions import AppError


class ArquivoInvalidoError(AppError):
    status_code = 400
    detail = "Arquivo invalido."


class FalhaArmazenamentoArquivoError(AppError):
    status_code = 502
    detail = "Falha ao armazenar arquivo."
