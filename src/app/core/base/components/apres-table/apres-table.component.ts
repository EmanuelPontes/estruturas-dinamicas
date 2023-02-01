import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DadosOrigemTabela } from './model/dados-origem-tabela.model';
import { Tabela } from './model/tabela.model';
import {SelectionModel} from '@angular/cdk/collections';

export function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-apres-table',
  templateUrl: './apres-table.component.html',
  styleUrls: ['./apres-table.component.scss']
})
export class ApresTableComponent implements OnInit, OnChanges, AfterViewInit {



  @Input() dadosOrigem: DadosOrigemTabela[];
  @Input() color: string = 'primary';
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>()

  public selection = new SelectionModel<any>(false, []);
  public tabelaLocal: Tabela;
  public tabelaPagina: Tabela;
  public pageSize: number = 20;
  public minSizePage: number = 5;
  public pageSizeOptions: number[] = [5, 10, 20];
  tabelaCarregada: boolean;

  constructor() { 
    
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    // this.tabelaLocal = new Tabela(this.dadosOrigem);
    
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.tabelaLocal = new Tabela(this.dadosOrigem);
    this.tabelaPagina = new Tabela([]);
    if (this.tabelaLocal.linhas.length < 20 && this.tabelaLocal.linhas.length > 5) {
      this.pageSize = 10;
    }

    if (this.tabelaLocal.linhas.length < 10) {
      this.pageSize = 5;
    }


    let end = Math.min(
      this.pageSize,
      this.tabelaLocal.linhas.length
    );

    this.tabelaPagina.cabecalho = this.tabelaLocal.cabecalho;
    this.tabelaPagina.linhas = this.tabelaLocal.linhas.slice(0, end);
    this.tabelaCarregada = this.tabelaPagina.linhas.length > 0;
  }

  counter(size: number) {
    return new Array(size).map((_, i) => i);
  }

  onPageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    let ini = pageEvent.pageIndex * this.pageSize ;
    let end = Math.min(
      ini + this.pageSize,
      this.tabelaLocal.linhas.length
    );
    this.tabelaPagina.linhas = this.tabelaLocal.linhas.slice(ini, end);
  }

  sortData(sort: Sort) {
    const data = this.tabelaPagina.linhas.slice();
    if (sort.active === undefined) {
      this.tabelaPagina.linhas = data;
      return;
    }
    let colId = parseInt(sort.active.replace(/\D/g, ''));
    if (sort.direction === '') {
      this.tabelaPagina.linhas = data;
      return;
    }
    let linha = [0]
    this.tabelaPagina.linhas = data.sort(
      (a,b) => {
        const isAsc = sort.direction === 'asc';
        
        return compare(a.colunas[colId].value, b.colunas[colId].value, isAsc)
      }
    )
    
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }


  onSelect(row: any) {
    this.selection.toggle(row);

    if (!this.selection.isSelected(row)) {
      this.onSelected.emit(null);
    } else {
      this.onSelected.emit(row);
    }
    
  }

}
