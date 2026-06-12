from dataclasses import dataclass


@dataclass(slots=True)
class CriarSolicitacaoAdesaoRestauranteDTO:
    gestor_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    cep: str
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    complemento: str | None = None
    referencia: str | None = None
    descricao: str | None = None
    foto_url: str | None = None

