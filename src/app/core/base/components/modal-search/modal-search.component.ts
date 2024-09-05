import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseFilter } from '../../models/base-filter.model';
import { AlertService } from '../../services/alert.service';
import { CrudService } from '../../services/crud.service';
import { DadosOrigemTabela } from '../apres-table/model/dados-origem-tabela.model';
import { FormField } from '../filtro-form/model/form-field.model';
import { modalButton } from '../modal-form/modal-form.component';
import * as moment from 'moment';
import { formatarLabel } from '../../CrudComponent';
import { ModalSearch } from '../../models/modal-search';
import { handleError } from '../../functions/util';

export type ModalSearchService = {
  getFormFiltro: () => Observable<FormField<any>[]>;
  getByFilter: (filtro: BaseFilter) => Promise<any>;
  fillFilterFormExternally?:  BehaviorSubject<any>;
};

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss']
})
export class ModalSearchComponent implements OnInit {

  @Input() enterButtonText: modalButton = {label: "Confirmar", hide: false};
  @Input() exitButtonText: modalButton = {label: "Cancelar", hide: false};
  @Input() multi: boolean = false;
  @Input() isCleanBtnHidden: boolean = false;
  dadosOrigem: DadosOrigemTabela[] = [];
  totalRegistros: number = 0;
  itemSelecionado: any;
  formFilters: FormField<any>[] = [];
  ultimoFiltro: BaseFilter; 
  fillExternally: any = null;
  formObjectResult: any = null;
  constructor( 
    public alertService: AlertService,
    public dialogRef: MatDialogRef<ModalSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      // service: CrudService<any,BaseFilter,any>,
      service: ModalSearchService ,
      children: ModalSearch[]
    } ) {}

  ngOnInit(): void {
    this.data.service.getFormFiltro().subscribe(
      data => {
        this.formFilters = data
        if (this.fillExternally) {
          let value = this.fillExternally;
          this.formFilters = this.formFilters.map(ff => {
            if (value[ff.key]) {
              ff.value = value[ff.key];
            }
    
            return ff;
          });
          this.fillExternally = null;
        }

      }
    );
    this.data.service.fillFilterFormExternally?.subscribe(value => {
      this.fillExternally = value;
      

    })
    this.atualizarTabela();
  }

  pesquisar(event: BaseFilter) {

    if (!event.itensPorPagina) {
        event = Object.assign(event, new BaseFilter());
    }
    this.ultimoFiltro = event;
    this.data.service.getByFilter(event).then((result: any) => {
        this.dadosOrigem = result.selecionados.map((item: any) => {
            return {
                objeto: item,
                formatarExibicao: formatarLabel
            };
        });
        this.totalRegistros = result.total;
    }).catch((erro: any) => {
        this.alertService.msgErro(handleError(erro))
    })
}

  aoMudarPagina(event: PageEvent) {
    let filtro = this.ultimoFiltro ? this.ultimoFiltro : new BaseFilter();

    filtro.pagina = event.pageIndex;
    filtro.itensPorPagina = event.pageSize
    if (this.totalRegistros > 0) {
      this.pesquisar(filtro);
    }
  }

  selecionar(event: any) {
      this.itemSelecionado = event;
  }

  salvar() {
    this.dialogRef.close(this.itemSelecionado);
  }

  private atualizarTabela() {
    this.pesquisar(new BaseFilter());
  }
}
