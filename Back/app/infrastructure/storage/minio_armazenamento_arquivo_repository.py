from io import BytesIO
from typing import Any
from urllib.parse import quote

from app.core.armazenamento_arquivo_exceptions import FalhaArmazenamentoArquivoError
from app.domain.entities.arquivo_armazenado import ArquivoArmazenado
from app.domain.repositories.armazenamento_arquivo_repository import (
    ArmazenamentoArquivoRepository,
)


class MinioArmazenamentoArquivoRepository(ArmazenamentoArquivoRepository):
    def __init__(
        self,
        *,
        endpoint: str,
        access_key: str,
        secret_key: str,
        bucket: str,
        public_url: str,
        use_ssl: bool,
    ) -> None:
        self.endpoint = endpoint
        self.access_key = access_key
        self.secret_key = secret_key
        self.bucket = bucket
        self.public_url = public_url.rstrip("/")
        self.use_ssl = use_ssl
        self.client: Any | None = None
        self.minio_exception_class: type[Exception] = Exception

    def salvar_arquivo(
        self,
        *,
        chave: str,
        conteudo: bytes,
        content_type: str,
    ) -> ArquivoArmazenado:
        client = self._get_client()

        try:
            client.put_object(
                self.bucket,
                chave,
                BytesIO(conteudo),
                length=len(conteudo),
                content_type=content_type,
            )
        except self.minio_exception_class as exc:
            raise FalhaArmazenamentoArquivoError() from exc

        return ArquivoArmazenado(
            bucket=self.bucket,
            chave=chave,
            url=f"{self.public_url}/{self.bucket}/{quote(chave, safe='/')}",
            content_type=content_type,
        )

    def _get_client(self) -> Any:
        if self.client is None:
            try:
                from minio import Minio
                from minio.error import MinioException
            except ModuleNotFoundError as exc:
                raise FalhaArmazenamentoArquivoError(
                    "Cliente MinIO nao instalado no ambiente."
                ) from exc

            self.client = Minio(
                self.endpoint,
                access_key=self.access_key,
                secret_key=self.secret_key,
                secure=self.use_ssl,
            )
            self.minio_exception_class = MinioException

        return self.client
