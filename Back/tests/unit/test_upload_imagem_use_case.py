import pytest

from app.application.dto.upload_arquivo_dto import UploadArquivoDTO
from app.application.use_cases.upload.fazer_upload_imagem import FazerUploadImagemUseCase
from app.core.armazenamento_arquivo_exceptions import ArquivoInvalidoError
from app.domain.entities.arquivo_armazenado import ArquivoArmazenado
from app.domain.repositories.armazenamento_arquivo_repository import (
    ArmazenamentoArquivoRepository,
)


class FakeArmazenamentoArquivoRepository(ArmazenamentoArquivoRepository):
    def __init__(self) -> None:
        self.chave_recebida: str | None = None
        self.content_type_recebido: str | None = None
        self.conteudo_recebido: bytes | None = None

    def salvar_arquivo(
        self,
        *,
        chave: str,
        conteudo: bytes,
        content_type: str,
    ) -> ArquivoArmazenado:
        self.chave_recebida = chave
        self.content_type_recebido = content_type
        self.conteudo_recebido = conteudo
        return ArquivoArmazenado(
            bucket="delifit",
            chave=chave,
            url=f"http://localhost:9000/delifit/{chave}",
            content_type=content_type,
        )



def test_fazer_upload_imagem_salva_arquivo_com_pasta_e_usuario() -> None:
    repository = FakeArmazenamentoArquivoRepository()
    use_case = FazerUploadImagemUseCase(repository=repository)

    arquivo = use_case.executar(
        UploadArquivoDTO(
            nome_arquivo="Foto Principal.png",
            content_type="image/png",
            conteudo=b"imagem-valida",
            usuario_id=7,
            pasta="restaurantes",
        )
    )

    assert arquivo.bucket == "delifit"
    assert arquivo.content_type == "image/png"
    assert repository.chave_recebida is not None
    assert repository.chave_recebida.startswith("restaurantes/7/")
    assert repository.chave_recebida.endswith("-fotoprincipal.png")



def test_fazer_upload_imagem_rejeita_tipo_nao_suportado() -> None:
    repository = FakeArmazenamentoArquivoRepository()
    use_case = FazerUploadImagemUseCase(repository=repository)

    with pytest.raises(ArquivoInvalidoError, match="Tipo de arquivo nao suportado"):
        use_case.executar(
            UploadArquivoDTO(
                nome_arquivo="documento.pdf",
                content_type="application/pdf",
                conteudo=b"pdf",
                usuario_id=4,
            )
        )
