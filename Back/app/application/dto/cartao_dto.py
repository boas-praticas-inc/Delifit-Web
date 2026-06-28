from dataclasses import dataclass


@dataclass(slots=True)
class CriarCartaoDTO:
    nome_titular: str
    ultimos_quatro_digitos: str
    bandeira: str
    token_gateway: str | None = None
    padrao: bool = False


@dataclass(slots=True)
class AtualizarCartaoDTO:
    nome_titular: str
    ultimos_quatro_digitos: str
    bandeira: str
    token_gateway: str | None = None
    padrao: bool = False
