import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { CrudActions } from '../../../components/common/CrudActions';
import { DataTable } from '../../../components/common/DataTable';
import { LinkButton } from '../../../components/common/LinkButton';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCpf, formatarData, formatarTelefone } from '../../../utils/masks';
import { clienteService } from '../services/clienteService';
import type { Cliente } from '../types/clienteTypes';

export function ClientesListPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const data = await clienteService.listarClientes();
        setClientes(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregarClientes();
  }, []);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Clientes
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Listagem de clientes
          </h1>
        </div>
        <LinkButton to="/clientes/novo">Adicionar cliente</LinkButton>
      </div>

      {isLoading ? <Loading /> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {!isLoading && !error ? (
        <DataTable
          items={clientes}
          emptyMessage="Nenhum cliente encontrado."
          searchPlaceholder="Buscar cliente por nome, CPF ou telefone"
          filters={[
            {
              id: 'nascimento',
              label: 'Nascimento',
              options: [
                { label: 'Com data', value: 'com_data' },
                { label: 'Sem data', value: 'sem_data' },
              ],
              predicate: (cliente, value) =>
                value === 'com_data'
                  ? Boolean(cliente.data_nascimento)
                  : !cliente.data_nascimento,
            },
          ]}
          columns={[
            {
              id: 'cliente',
              header: 'Cliente',
              searchValue: (cliente) =>
                `${cliente.nome_completo} ${cliente.cpf} ${cliente.telefone}`,
              sortValue: (cliente) => cliente.nome_completo,
              render: (cliente) => (
                <div>
                  <div className="font-medium text-slate-950">
                    {cliente.nome_completo}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatarCpf(cliente.cpf)}
                  </div>
                </div>
              ),
            },
            {
              id: 'telefone',
              header: 'Telefone',
              searchValue: (cliente) => cliente.telefone,
              sortValue: (cliente) => cliente.telefone,
              render: (cliente) => formatarTelefone(cliente.telefone),
            },
            {
              id: 'data_nascimento',
              header: 'Nascimento',
              searchValue: (cliente) => cliente.data_nascimento ?? '',
              sortValue: (cliente) => cliente.data_nascimento ?? '',
              render: (cliente) => formatarData(cliente.data_nascimento),
            },
            {
              header: 'Ações',
              render: (cliente) => (
                <CrudActions viewTo={`/clientes/${cliente.id}`} />
              ),
              className: 'w-28',
            },
          ]}
        />
      ) : null}
    </section>
  );
}
