from pydantic import BaseModel, ConfigDict, Field


class EnderecoCreate(BaseModel):
    cep: str = Field(pattern=r"^[0-9]{8}$")
    logradouro: str = Field(min_length=1, max_length=150)
    numero: str = Field(min_length=1, max_length=20)
    bairro: str = Field(min_length=1, max_length=100)
    cidade: str = Field(min_length=1, max_length=100)
    estado: str = Field(pattern=r"^[A-Z]{2}$")
    complemento: str | None = Field(default=None, max_length=100)
    referencia: str | None = Field(default=None, max_length=150)
    label: str | None = Field(default=None, max_length=50)
    cliente_id: int | None = Field(default=None, gt=0)


class MeuEnderecoCreate(BaseModel):
    cep: str = Field(pattern=r"^[0-9]{8}$")
    logradouro: str = Field(min_length=1, max_length=150)
    numero: str = Field(min_length=1, max_length=20)
    bairro: str = Field(min_length=1, max_length=100)
    cidade: str = Field(min_length=1, max_length=100)
    estado: str = Field(pattern=r"^[A-Z]{2}$")
    complemento: str | None = Field(default=None, max_length=100)
    referencia: str | None = Field(default=None, max_length=150)
    label: str | None = Field(default=None, max_length=50)


class MeuEnderecoUpdate(BaseModel):
    cep: str = Field(pattern=r"^[0-9]{8}$")
    logradouro: str = Field(min_length=1, max_length=150)
    numero: str = Field(min_length=1, max_length=20)
    bairro: str = Field(min_length=1, max_length=100)
    cidade: str = Field(min_length=1, max_length=100)
    estado: str = Field(pattern=r"^[A-Z]{2}$")
    complemento: str | None = Field(default=None, max_length=100)
    referencia: str | None = Field(default=None, max_length=150)
    label: str | None = Field(default=None, max_length=50)


class EnderecoResponse(BaseModel):
    id: int
    cep: str
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    complemento: str | None
    referencia: str | None
    label: str | None
    cliente_id: int | None

    model_config = ConfigDict(from_attributes=True)

