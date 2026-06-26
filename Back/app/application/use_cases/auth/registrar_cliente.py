from collections.abc import Callable
from datetime import date

from app.domain.entities.cliente import Cliente
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.domain.repositories.cliente_repository import ClienteRepository
from app.domain.repositories.usuario_repository import UsuarioRepository


class RegistrarClienteUseCase:
    def __init__(
        self,
        usuario_repository: UsuarioRepository,
        cliente_repository: ClienteRepository,
        gerar_hash: Callable[[str], str],
    ) -> None:
        self.usuario_repository = usuario_repository
        self.cliente_repository = cliente_repository
        self.gerar_hash = gerar_hash

    def executar(
        self,
        *,
        telefone: str,
        senha: str,
        nome_completo: str,
        cpf: str,
        data_nascimento: date | None,
    ) -> tuple[Usuario, Cliente]:
        usuario = self.usuario_repository.criar(
            Usuario(
                id=None,
                email=None,
                telefone=telefone,
                senha_hash=self.gerar_hash(senha),
                tipo_usuario=TipoUsuarioEnum.CLIENTE,
            )
        )

        try:
            cliente = self.cliente_repository.criar(
                Cliente(
                    id=None,
                    usuario_id=usuario.id,
                    nome_completo=nome_completo,
                    cpf=cpf,
                    data_nascimento=data_nascimento,
                )
            )
        except Exception:
            if usuario.id is not None:
                self.usuario_repository.excluir(usuario.id)
            raise

        return usuario, cliente
