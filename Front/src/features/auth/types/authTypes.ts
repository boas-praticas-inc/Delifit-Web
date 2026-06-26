import type { Usuario } from '../../usuarios/types/usuarioTypes';
import type { Cliente } from '../../clientes/types/clienteTypes';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  telefone: string;
  senha: string;
  nome_completo: string;
  cpf: string;
  data_nascimento?: string;
}

export interface AuthUser {
  id: number;
  email: string | null;
  tipo_usuario: Usuario['tipo_usuario'];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

export interface RegisterResponse extends LoginResponse {
  cliente: Cliente;
}
