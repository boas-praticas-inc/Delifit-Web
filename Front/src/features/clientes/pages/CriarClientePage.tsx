import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api';
import { usuarioService } from '../../usuarios/services/usuarioService';
import { ClienteForm } from '../components/ClienteForm';
import type { CriarClienteFormData } from '../schemas/clienteSchemas';
import { clienteService } from '../services/clienteService';

export function CriarClientePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: CriarClienteFormData) {
    setError(null);

    try {
      const usuario = await usuarioService.criarUsuario({
        email: data.email,
        senha: data.senha,
        tipo_usuario: 'CLIENTE',
      });

      await clienteService.criarCliente({
        usuario_id: usuario.id,
        nome_completo: data.nome_completo,
        cpf: data.cpf,
        telefone: data.telefone,
        data_nascimento: data.data_nascimento || null,
      });

      navigate('/clientes');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to="/clientes" className="text-sm font-semibold text-brand-700">
          Voltar para Clientes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Adicionar Cliente
        </h1>
      </div>

      <ClienteForm mode="create" submitLabel="Salvar cliente" onSubmit={onSubmit} />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
