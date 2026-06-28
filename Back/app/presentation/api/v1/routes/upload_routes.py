from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.application.dto.upload_arquivo_dto import UploadArquivoDTO
from app.application.use_cases.upload.fazer_upload_imagem import FazerUploadImagemUseCase
from app.domain.entities.usuario import Usuario
from app.presentation.schemas.upload_schema import ArquivoUploadResponse
from app.shared.dependencies import get_current_user, get_fazer_upload_imagem_use_case

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/imagens", response_model=ArquivoUploadResponse, status_code=status.HTTP_201_CREATED)
async def fazer_upload_imagem(
    arquivo: Annotated[UploadFile, File(...)],
    usuario: Annotated[Usuario, Depends(get_current_user)],
    use_case: Annotated[FazerUploadImagemUseCase, Depends(get_fazer_upload_imagem_use_case)],
    pasta: Annotated[str, Form()] = "imagens",
) -> ArquivoUploadResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    conteudo = await arquivo.read()
    arquivo_armazenado = use_case.executar(
        UploadArquivoDTO(
            nome_arquivo=arquivo.filename or "arquivo",
            content_type=arquivo.content_type or "",
            conteudo=conteudo,
            usuario_id=usuario.id,
            pasta=pasta,
        )
    )
    return ArquivoUploadResponse.model_validate(arquivo_armazenado)
