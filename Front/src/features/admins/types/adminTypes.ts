export interface Admin {
  id: number;
  usuario_id: number;
  nome_completo: string;
  cargo: string | null;
}

export interface CriarAdminPayload {
  usuario_id: number;
  nome_completo: string;
  cargo: string | null;
}
