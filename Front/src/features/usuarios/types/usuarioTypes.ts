export type TipoUsuario = 'CLIENTE' | 'RESTAURANTE' | 'ENTREGADOR' | 'ADMIN';

export type StatusUsuario = 'ATIVO' | 'INATIVO' | 'BANIDO';

export interface Usuario {
  id: number;
  email: string;
  tipo_usuario: TipoUsuario;
  status: StatusUsuario;
  criado_em: string;
  atualizado_em: string | null;
}

export interface UsuarioDetalhado extends Usuario {}

export interface CriarUsuarioPayload {
  email: string;
  senha: string;
  tipo_usuario: TipoUsuario;
}
