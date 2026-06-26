export type TipoUsuario = 'CLIENTE' | 'GESTOR' | 'ADMIN';

export type StatusUsuario = 'ATIVO' | 'INATIVO' | 'BLOQUEADO';

export interface Usuario {
  id: number;
  email: string | null;
  telefone: string | null;
  tipo_usuario: TipoUsuario;
  status: StatusUsuario;
  criado_em: string;
  atualizado_em: string | null;
}

export type UsuarioDetalhado = Usuario;

export interface CriarUsuarioPayload {
  email?: string | null;
  telefone?: string | null;
  senha: string;
  tipo_usuario: TipoUsuario;
}
