import { Injectable } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: AlertService
  ) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse == 'string') {

      msg = errorResponse;

    } else if (errorResponse.status == 0) {

      this.messageService.msgErro('Servidor da API não responde','Erro');

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

    this.messageService.msgErro(msg,'Erro');
  }
}
