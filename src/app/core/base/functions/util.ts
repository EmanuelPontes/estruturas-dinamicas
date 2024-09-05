import { HttpErrorResponse } from "@angular/common/http";

export const isEmpty = (valor: any): boolean => {
  return (
    valor === null ||
    valor === undefined ||
    (valor.length !== undefined && valor.length === 0) ||
    (valor instanceof Object && Object.entries(valor).length === 0)
  );
};

/**
 * Retorna o valor do atributo @id do objeto recebido
 * @param valor
 * @returns
 */
export function getId<T>(valor: any): any {
  if (!isEmpty(valor)) {
    return !isEmpty(valor['id']) ? valor['id'] : null;
  }
}

/**
 * Retorna um array de acordo com parâmetro passado
 * @param parametro
 * @returns
 * @author Mauricio Linhares
 */
export function retornaEmArray<T>(parametro: T): T[] {
  if (!isEmpty(parametro)) {
    return Array.of(parametro);
  }
  return [];
}


export const isNumber = (valor: string | number): boolean => {
  return !isEmpty(valor) && !isNaN(Number(valor.toString()));
};

export const isArray = (valor: any): boolean => {
  return Object.prototype.toString.call(valor) === '[object Array]';
};

export const isObject = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export const mask = (valor: string | number, pattern: string): string => {
  let i: number = 0;
  const v: string = valor.toString();

  if (isEmpty(valor)) {
    return v;
  }

  return pattern.replace(/#/g, (): string => v[i++] || '');
};

export const hasLength = (str: string): boolean => {
  return str != null && !isEmpty(str);
};

export const deepCopy = (obj: any): any => {
  return (JSON.parse(JSON.stringify(obj)))
}


export const handleError = (errorResponse: any): string => {
  let msg: string;

  if (Object.prototype.toString.call(errorResponse.error) === '[object String]') {
    try {
      errorResponse.error = JSON.parse(errorResponse.error);
    } catch (e: any) {
      return errorResponse.error;
    }
    
  }

  if (typeof errorResponse == 'string') {

    msg = errorResponse;

  } else if (errorResponse.status == 0) {

    return 'Servidor da API não responde'

  } else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {

    msg = 'Ocorreu um erro ao processar sua solicitação';

    if (errorResponse.status === 403) {
      msg = 'Você não tem permissão para executar esta ação';
    }

    try {
      msg = errorResponse.error.message;
      errorResponse.error.forEach(function (value: any) {
        msg = value.mensagemUsuario + ", " + msg;
      });
      msg = msg.substr(0, msg.length - 2);
    } catch (e) { }
  } else {
    msg = errorResponse.error.message;
  }

  return msg
}
/**
 * Retorna um valor numérico do numero de ocorrências de acordo com os parametros recebidos do param2 dentro de param1
 * @param str
 * @param sub
 * @returns
 */
export const contagemOcorrencias = (str: string, sub: string): number => {
  if (hasLength(str) && hasLength(sub)) {
    let idx;
    let count = 0;

    for (
      let pos = 0;
      (idx = str.indexOf(sub, pos)) !== -1;
      pos = idx + sub.length
    ) {
      ++count;
    }

    return count;
  } else {
    return 0;
  }
};


/**
 * Dispara comando para copiar informação para area de transferencia
 * @param info
 * @returns
 */
export const copiarAreaTransferencia = (info: string): Promise<void> => {
  return navigator.clipboard.writeText(info)
}

/**
 * Retorna o preço formatado
 *
 * @param preco
 * @param currency
 */
export const retornaPrecoFormatado = (
  preco: number,
  currency: string
): string => {
  if (currency !== 'BRL') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(preco);
  } else {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }
};
