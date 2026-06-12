import { FormEvent, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { adminData, type RestaurantePayload } from '../../admin/adminData';

const emptyRestaurante: RestaurantePayload = {
  nomeFantasia: '',
  razaoSocial: '',
  cnpj: '',
  telefone: '',
  email: '',
  status: 'ATIVO',
};

export function RestauranteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const restauranteId = id ? Number(id) : undefined;
  const restaurante = useMemo(
    () => (restauranteId ? adminData.buscarRestaurante(restauranteId) : null),
    [restauranteId],
  );
  const [formData, setFormData] = useState<RestaurantePayload>(
    restaurante ?? emptyRestaurante,
  );

  if (id && !restauranteId) {
    return <Navigate to="/restaurantes" replace />;
  }

  if (restauranteId && !restaurante) {
    return <Navigate to="/restaurantes" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const salvo = adminData.salvarRestaurante(formData, restauranteId);
    navigate(`/restaurantes/${salvo?.id ?? restauranteId}`);
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link
          to="/restaurantes"
          className="text-sm font-semibold text-brand-700"
        >
          Voltar para restaurantes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          {restauranteId ? 'Editar restaurante' : 'Adicionar restaurante'}
        </h1>
      </div>

      <form
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleSubmit}
      >
        <Field
          label="Nome fantasia"
          value={formData.nomeFantasia}
          onChange={(nomeFantasia) =>
            setFormData((data) => ({ ...data, nomeFantasia }))
          }
          required
        />
        <Field
          label="Razao social"
          value={formData.razaoSocial}
          onChange={(razaoSocial) =>
            setFormData((data) => ({ ...data, razaoSocial }))
          }
          required
        />
        <Field
          label="CNPJ"
          value={formData.cnpj}
          onChange={(cnpj) => setFormData((data) => ({ ...data, cnpj }))}
          required
        />
        <Field
          label="Telefone"
          value={formData.telefone}
          onChange={(telefone) =>
            setFormData((data) => ({ ...data, telefone }))
          }
          required
        />
        <Field
          label="Email"
          type="email"
          value={formData.email}
          onChange={(email) => setFormData((data) => ({ ...data, email }))}
          required
        />

        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Status</span>
          <select
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            value={formData.status}
            onChange={(event) =>
              setFormData((data) => ({
                ...data,
                status: event.target.value as RestaurantePayload['status'],
              }))
            }
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Salvar restaurante
          </button>
          <Link
            to={
              restauranteId ? `/restaurantes/${restauranteId}` : '/restaurantes'
            }
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  onChange,
  required,
  type = 'text',
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
