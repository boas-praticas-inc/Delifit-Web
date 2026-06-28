from abc import ABC, abstractmethod

from app.domain.entities.arquivo_armazenado import ArquivoArmazenado


class ArmazenamentoArquivoRepository(ABC):
    @abstractmethod
    def salvar_arquivo(
        self,
        *,
        chave: str,
        conteudo: bytes,
        content_type: str,
    ) -> ArquivoArmazenado:
        raise NotImplementedError
