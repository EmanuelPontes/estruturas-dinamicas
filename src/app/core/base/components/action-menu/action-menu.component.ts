import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {

  @Input() rotaPadrao: string;
  @Input() selecionado: any = null;
  @Input() isBtNovoEmit: boolean = false;
  @Input() permissaoNovo: boolean = true;
  @Input() permissaoEditar: boolean = true;
  @Input() permissaoConsultar: boolean = true;
  @Input() permissaoExcluir: boolean = true;
  @Input() ignoreEmptySelecion: boolean = false;
  @Input() isRedirecionamentoAtivado: boolean = true;
  @Output() onNovoClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditarClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onConsultarClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onExcluirClick: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private router: Router,
    private messageService: AlertService,
  ) { }
  ngOnInit(): void {
  }

  novo() {
    this.isBtNovoEmit ? this.onNovoClick.emit() : this.router.navigate([this.rotaPadrao + '/novo']);
  }

  existeItemSelecionado(tipo: string) {
    if (!this.selecionado) {
      if (this.ignoreEmptySelecion) {
        if (tipo === 'consultar') {
          this.onConsultarClick.emit("click");
        }
      } else {
        this.messageService.msgErro('Selecione um item da lista', 'Aviso!');
      }

    } else {
      if (tipo === 'editar') {

        // if (this.isRedirecionamentoAtivado) {
        //   this.router.navigate([this.rotaPadrao + '/editar/' + this.idEntidade]);
        // }
        this.onEditarClick.emit("click");
      }
      if (tipo === 'consultar') {
        // if (this.isRedirecionamentoAtivado) {
        //   this.router.navigate([this.rotaPadrao + '/' + this.idEntidade + '/' + true + '/consultar']);
        // }

        this.onConsultarClick.emit("click");
      }
      if (tipo === 'excluir') {
        // if (this.isRedirecionamentoAtivado) {
        //   this.router.navigate([this.rotaPadrao + '/' + this.idEntidade + '/' + true + '/excluir']);
        // }

        this.onExcluirClick.emit("click");
      }
    }
  }

}
