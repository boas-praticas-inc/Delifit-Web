const DIGITOS_REGEX = /\D/g;

export function somenteDigitos(valor: string) {
  return valor.replace(DIGITOS_REGEX, '');
}

export function aplicarMascara(
  valor: string,
  padrao: Array<number | string>,
) {
  const digitos = somenteDigitos(valor);
  let indiceDigito = 0;
  let resultado = '';

  for (const item of padrao) {
    if (typeof item === 'number') {
      const trecho = digitos.slice(indiceDigito, indiceDigito + item);

      if (!trecho) {
        break;
      }

      resultado += trecho;
      indiceDigito += item;
      continue;
    }

    if (indiceDigito >= digitos.length) {
      break;
    }

    resultado += item;
  }

  return resultado;
}

export function formatarCpf(valor: string) {
  return aplicarMascara(valor, [3, '.', 3, '.', 3, '-', 2]);
}

export function formatarCnpj(valor: string) {
  return aplicarMascara(valor, [2, '.', 3, '.', 3, '/', 4, '-', 2]);
}

export function formatarTelefone(valor: string) {
  const digitos = somenteDigitos(valor).slice(0, 11);

  if (digitos.length <= 10) {
    return aplicarMascara(digitos, ['(', 2, ') ', 4, '-', 4]);
  }

  return aplicarMascara(digitos, ['(', 2, ') ', 5, '-', 4]);
}

export function formatarCep(valor: string) {
  return aplicarMascara(valor, [5, '-', 3]);
}

export function formatarData(valor: string | null | undefined) {
  if (!valor) {
    return 'Não informado';
  }

  return new Date(valor).toLocaleDateString('pt-BR');
}
