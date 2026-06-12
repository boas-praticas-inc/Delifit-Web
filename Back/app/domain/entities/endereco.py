from dataclasses import dataclass


@dataclass(slots=True)
class Endereco:
    id: int | None
    cep: str
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    complemento: str | None = None
    referencia: str | None = None
    label: str | None = None
    cliente_id: int | None = None
