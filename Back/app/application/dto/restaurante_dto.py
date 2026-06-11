from dataclasses import dataclass


@dataclass(slots=True)
class CriarRestauranteDTO:
    usuario_dono_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    validado: bool = False
    logo_url: str | None = None


@dataclass(slots=True)
class AtualizarRestauranteDTO:
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    validado: bool
    logo_url: str | None = None
