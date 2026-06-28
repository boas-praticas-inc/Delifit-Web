from dataclasses import dataclass


@dataclass(slots=True)
class UploadArquivoDTO:
    nome_arquivo: str
    content_type: str
    conteudo: bytes
    usuario_id: int
    pasta: str = "imagens"
