from pydantic import BaseModel, ConfigDict


class ArquivoUploadResponse(BaseModel):
    bucket: str
    chave: str
    url: str
    content_type: str

    model_config = ConfigDict(from_attributes=True)
