from dataclasses import dataclass

from app.domain.enums.pasta_arquivo_enum import PastaArquivoEnum


@dataclass(slots=True)
class UploadArquivoDTO:
    nome_arquivo: str
    content_type: str
    conteudo: bytes
    usuario_id: int
    pasta: PastaArquivoEnum = PastaArquivoEnum.RESTAURANTES
