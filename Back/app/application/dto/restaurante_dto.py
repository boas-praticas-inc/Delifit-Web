from dataclasses import dataclass


@dataclass(slots=True)
class CriarRestauranteDTO:
    gestor_id: int
    endereco_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    solicitacao_adesao_id: int | None = None
    descricao: str | None = None
    foto_url: str | None = None


@dataclass(slots=True)
class AtualizarRestauranteDTO:
    gestor_id: int
    endereco_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    solicitacao_adesao_id: int | None = None
    descricao: str | None = None
    foto_url: str | None = None
