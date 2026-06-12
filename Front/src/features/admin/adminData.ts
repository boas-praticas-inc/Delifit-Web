export type StatusCadastro = 'ATIVO' | 'INATIVO';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  status: StatusCadastro;
  criadoEm: string;
}

export interface Restaurante {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  status: StatusCadastro;
  criadoEm: string;
}

export type ClientePayload = Omit<Cliente, 'id' | 'criadoEm'>;
export type RestaurantePayload = Omit<Restaurante, 'id' | 'criadoEm'>;

const clientesKey = 'delifit.admin.clientes';
const restaurantesKey = 'delifit.admin.restaurantes';

const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: 'Ana Beatriz Lima',
    email: 'ana@exemplo.com',
    telefone: '(79) 99999-1000',
    cpf: '12345678901',
    status: 'ATIVO',
    criadoEm: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 2,
    nome: 'Carlos Menezes',
    email: 'carlos@exemplo.com',
    telefone: '(79) 98888-2000',
    cpf: '98765432100',
    status: 'ATIVO',
    criadoEm: '2026-06-02T10:00:00.000Z',
  },
];

const restaurantesIniciais: Restaurante[] = [
  {
    id: 1,
    nomeFantasia: 'Fit Bowl Aracaju',
    razaoSocial: 'Fit Bowl Alimentos LTDA',
    cnpj: '12345678000190',
    telefone: '(79) 3333-1000',
    email: 'contato@fitbowl.com',
    status: 'ATIVO',
    criadoEm: '2026-06-01T12:00:00.000Z',
  },
  {
    id: 2,
    nomeFantasia: 'Verde Pronto',
    razaoSocial: 'Verde Pronto Restaurante LTDA',
    cnpj: '98765432000110',
    telefone: '(79) 3333-2000',
    email: 'adm@verdepronto.com',
    status: 'INATIVO',
    criadoEm: '2026-06-03T12:00:00.000Z',
  },
];

export const adminData = {
  listarClientes() {
    return readCollection(clientesKey, clientesIniciais);
  },

  buscarCliente(id: number) {
    return this.listarClientes().find((cliente) => cliente.id === id) ?? null;
  },

  salvarCliente(payload: ClientePayload, id?: number) {
    const clientes = this.listarClientes();

    if (id) {
      const atualizados = clientes.map((cliente) =>
        cliente.id === id ? { ...cliente, ...payload } : cliente,
      );
      writeCollection(clientesKey, atualizados);
      return atualizados.find((cliente) => cliente.id === id) ?? null;
    }

    const cliente: Cliente = {
      ...payload,
      id: nextId(clientes),
      criadoEm: new Date().toISOString(),
    };
    writeCollection(clientesKey, [...clientes, cliente]);
    return cliente;
  },

  removerCliente(id: number) {
    writeCollection(
      clientesKey,
      this.listarClientes().filter((cliente) => cliente.id !== id),
    );
  },

  listarRestaurantes() {
    return readCollection(restaurantesKey, restaurantesIniciais);
  },

  buscarRestaurante(id: number) {
    return (
      this.listarRestaurantes().find((restaurante) => restaurante.id === id) ??
      null
    );
  },

  salvarRestaurante(payload: RestaurantePayload, id?: number) {
    const restaurantes = this.listarRestaurantes();

    if (id) {
      const atualizados = restaurantes.map((restaurante) =>
        restaurante.id === id ? { ...restaurante, ...payload } : restaurante,
      );
      writeCollection(restaurantesKey, atualizados);
      return (
        atualizados.find((restaurante) => restaurante.id === id) ?? null
      );
    }

    const restaurante: Restaurante = {
      ...payload,
      id: nextId(restaurantes),
      criadoEm: new Date().toISOString(),
    };
    writeCollection(restaurantesKey, [...restaurantes, restaurante]);
    return restaurante;
  },

  removerRestaurante(id: number) {
    writeCollection(
      restaurantesKey,
      this.listarRestaurantes().filter((restaurante) => restaurante.id !== id),
    );
  },
};

function readCollection<T>(key: string, fallback: T[]) {
  const stored = window.localStorage.getItem(key);

  if (!stored) {
    writeCollection(key, fallback);
    return fallback;
  }

  try {
    return JSON.parse(stored) as T[];
  } catch {
    writeCollection(key, fallback);
    return fallback;
  }
}

function writeCollection<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function nextId(items: Array<{ id: number }>) {
  return items.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
}
