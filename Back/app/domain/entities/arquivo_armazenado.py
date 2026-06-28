from dataclasses import dataclass


@dataclass(slots=True)
class ArquivoArmazenado:
    bucket: str
    chave: str
    url: str
    content_type: str
