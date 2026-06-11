import axios from 'axios';

import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return 'Nao foi possivel concluir a operacao. Tente novamente.';
  }

  if (!error.response) {
    return 'Nao foi possivel conectar com a API. Verifique se o backend esta em execucao.';
  }

  const detail = getResponseDetail(error.response.data);

  switch (error.response.status) {
    case 400:
      return (
        detail ?? 'Dados invalidos. Revise as informacoes e tente novamente.'
      );
    case 401:
      return 'Acesso nao autorizado. Faca login novamente.';
    case 404:
      return 'Recurso nao encontrado na API.';
    case 409:
      return detail ?? 'Ja existe um registro com essas informacoes.';
    case 422:
      return (
        detail ?? 'Os dados informados nao passaram na validacao da API.'
      );
    case 500:
      return 'Erro interno no servidor. Tente novamente em alguns instantes.';
    default:
      return detail ?? 'A API retornou um erro inesperado.';
  }
}

function getResponseDetail(data: unknown) {
  if (typeof data === 'object' && data !== null && 'detail' in data) {
    const detail = data.detail;

    if (typeof detail === 'string') {
      return detail;
    }

    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => getValidationMessage(item))
        .filter((message): message is string => Boolean(message));

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }
  }

  return null;
}

function getValidationMessage(item: unknown) {
  if (typeof item !== 'object' || item === null) {
    return null;
  }

  if (
    'type' in item &&
    item.type === 'string_too_short' &&
    'loc' in item &&
    Array.isArray(item.loc) &&
    item.loc.includes('senha') &&
    'ctx' in item &&
    typeof item.ctx === 'object' &&
    item.ctx !== null &&
    'min_length' in item.ctx
  ) {
    return `A senha deve ter pelo menos ${item.ctx.min_length} caracteres.`;
  }

  if ('msg' in item && typeof item.msg === 'string') {
    return item.msg;
  }

  return null;
}
