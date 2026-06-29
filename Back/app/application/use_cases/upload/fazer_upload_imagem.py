from pathlib import Path
from uuid import uuid4

from app.application.dto.upload_arquivo_dto import UploadArquivoDTO
from app.core.armazenamento_arquivo_exceptions import ArquivoInvalidoError
from app.domain.entities.arquivo_armazenado import ArquivoArmazenado
from app.domain.enums.pasta_arquivo_enum import PastaArquivoEnum
from app.domain.repositories.armazenamento_arquivo_repository import (
    ArmazenamentoArquivoRepository,
)

TIPOS_IMAGEM_PERMITIDOS = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
PASTAS_UPLOAD_PERMITIDAS = {pasta.value for pasta in PastaArquivoEnum}
TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024


class FazerUploadImagemUseCase:
    def __init__(self, repository: ArmazenamentoArquivoRepository) -> None:
        self.repository = repository

    def executar(self, dto: UploadArquivoDTO) -> ArquivoArmazenado:
        if not dto.conteudo:
            raise ArquivoInvalidoError("Arquivo vazio.")

        if len(dto.conteudo) > TAMANHO_MAXIMO_IMAGEM_BYTES:
            raise ArquivoInvalidoError("Imagem excede o limite de 5 MB.")

        extensao = TIPOS_IMAGEM_PERMITIDOS.get(dto.content_type.lower())
        if extensao is None:
            raise ArquivoInvalidoError("Tipo de arquivo nao suportado. Envie JPG, PNG ou WEBP.")

        pasta = _normalizar_pasta(dto.pasta)
        nome_base = _normalizar_nome_arquivo(dto.nome_arquivo)
        chave = f"{pasta}/{dto.usuario_id}/{uuid4().hex}-{nome_base}{extensao}"

        return self.repository.salvar_arquivo(
            chave=chave,
            conteudo=dto.conteudo,
            content_type=dto.content_type,
        )


def _normalizar_pasta(pasta: PastaArquivoEnum | str) -> str:
    valor_pasta = pasta.value if isinstance(pasta, PastaArquivoEnum) else pasta
    pasta_normalizada = "-".join(valor_pasta.strip().lower().replace("\\", "/").split("/"))
    pasta_normalizada = "".join(
        caractere
        for caractere in pasta_normalizada
        if caractere.isalnum() or caractere in {"-", "_"}
    )
    if pasta_normalizada not in PASTAS_UPLOAD_PERMITIDAS:
        raise ArquivoInvalidoError(
            "Pasta invalida. Utilize: restaurantes, itens-cardapio, clientes ou gestores."
        )
    return pasta_normalizada


def _normalizar_nome_arquivo(nome_arquivo: str) -> str:
    stem = Path(nome_arquivo).stem.strip().lower()
    stem = "".join(
        caractere
        for caractere in stem
        if caractere.isalnum() or caractere in {"-", "_"}
    )
    if not stem:
        return "arquivo"
    return stem
