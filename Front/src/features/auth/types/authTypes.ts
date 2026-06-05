import type {
  CriarUsuarioPayload,
  Usuario,
} from '../../usuarios/types/usuarioTypes';

export interface LoginPayload {
  email: string;
  senha: string;
}

export type RegisterPayload = CriarUsuarioPayload;

export interface AuthUser {
  id: number;
  email: string;
  tipo_usuario: Usuario['tipo_usuario'];
}
