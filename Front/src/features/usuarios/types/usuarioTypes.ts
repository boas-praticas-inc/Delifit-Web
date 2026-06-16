export type TipoUsuario = 'GESTOR';

export type StatusUsuario = 'ATIVO' | 'INATIVO' | 'BLOQUEADO';

export interface Usuario {
  id: number;
  email: string;
  tipo_usuario: TipoUsuario;
  status: StatusUsuario;
  criado_em: string;
  atualizado_em: string | null;
}

export type UsuarioDetalhado = Usuario;

export interface CriarUsuarioPayload {
  email: string;
  senha: string;
  tipo_usuario: TipoUsuario;
}
