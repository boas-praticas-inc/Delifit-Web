import { useEffect, useState } from 'react';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { usuarioService } from '../../usuarios/services/usuarioService';
import type { Usuario } from '../../usuarios/types/usuarioTypes';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function UsuarioDonoSelect({ value, onChange, error }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const data = await usuarioService.listarUsuarios();
        setUsuarios(data);
      } catch (requestError) {
        setLoadError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregarUsuarios();
  }, []);

  useEffect(() => {
    async function carregarSelecionado() {
      if (!value) {
        setSelectedUser(null);
        return;
      }

      const existente = usuarios.find((usuario) => String(usuario.id) === value);
      if (existente) {
        setSelectedUser(existente);
        return;
      }

      try {
        const usuario = await usuarioService.buscarUsuarioPorId(Number(value));
        setSelectedUser(usuario);
      } catch {
        setSelectedUser(null);
      }
    }

    void carregarSelecionado();
  }, [usuarios, value]);

  return (
    <div className="grid gap-2">
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>Usuario dono</span>
        {isLoading ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <Loading />
          </div>
        ) : (
          <select
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Selecione um usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.id} - {usuario.email} - {usuario.tipo_usuario} - {usuario.status}
              </option>
            ))}
          </select>
        )}
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
        {loadError ? <span className="text-xs text-red-600">{loadError}</span> : null}
      </label>

      {selectedUser ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Detalhes do usuario dono</p>
          <p>ID: {selectedUser.id}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Tipo: {selectedUser.tipo_usuario}</p>
          <p>Status: {selectedUser.status}</p>
          <p className="text-xs text-slate-500">
            CPF e telefone nao estao disponiveis no contrato atual do backend.
          </p>
        </div>
      ) : null}
    </div>
  );
}
