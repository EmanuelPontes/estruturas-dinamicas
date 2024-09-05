import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DadosOrigemTabela } from './model/dados-origem-tabela.model';
import { Tabela } from './model/tabela.model';
import {SelectionModel} from '@angular/cdk/collections';

export function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Items por p�gina:';
  customPaginatorIntl.firstPageLabel = 'Primeira p�gina';
  customPaginatorIntl.lastPageLabel = '�ltima p�gina';
  customPaginatorIntl.nextPageLabel = 'Pr�xima p�gina';
  customPaginatorIntl.previousPageLabel = 'P�gina Anterior';
  customPaginatorIntl.getRangeLabel = (page, pageSize, length): string => {
    const labelOf = "de";
    if (length === 0 || pageSize === 0) {
      return `0 ${labelOf} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} � ${endIndex} ${labelOf} ${length}`;
  };
  return customPaginatorIntl;
}
@Component({
  selector: 'app-apres-table',
  templateUrl: './apres-table.component.html',
  styleUrls: ['./apres-table.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() } 
  ]
  
})
export class ApresTableComponent implements OnInit, OnChanges, AfterViewInit {



  @Input() dadosOrigem: DadosOrigemTabela[];
  @Input() color: string = 'primary';
  @Input() totalElementos: number = 0;
  @Input() multi: boolean = false;
  @Input() habilitarSelecao: boolean = true;
  @Input() selectMemory: boolean = false;
  @Input() filtroEnabled: boolean = false;
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>()
  @Output() onPageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
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
    this.selection = new SelectionModel<any>(this.multi, []);
    this.selection.isSelected = this.isChecked.bind(this);
    this.selection.changed.subscribe(
      s => {
        let selected = s.source.selected;
        let isAdd = s.added.length > 0;
        console.log("Selected values: " + JSON.stringify(selected));
        this.onSelected.emit(this.multi ? selected.length == 0 ? null  : selected : isAdd ? s.added[0] :  null);
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tabelaLocal = new Tabela(this.dadosOrigem);
    this.tabelaPagina = new Tabela([]);
    if (!this.selectMemory) {
      this.selection.clear();
    }
    
    this.tabelaPagina.cabecalho = this.tabelaLocal.cabecalho;
    this.tabelaPagina.linhas = this.tabelaLocal.linhas.slice();
    this.tabelaCarregada = this.tabelaPagina.linhas.length > 0;
    if (this.pageSizeOptions.length > 3) {
      this.pageSizeOptions.pop();
    }
    if (this.totalElementos > 20 && this.pageSizeOptions.indexOf(this.totalElementos) === -1) {

      this.pageSizeOptions.push(this.totalElementos > 1200 ? 1000 : this.totalElementos);
    }

    this.pageSizeOptions = [...this.pageSizeOptions];
  }

  counter(size: number) {
    return new Array(size).map((_, i) => i);
  }

  isChecked(row: any): boolean {
    const found = this.selection.selected.find(el => el.id === row.id);
    if (found) {
      return true;
    }
    return false;
 }

  onPageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    // let ini = pageEvent.pageIndex * this.pageSize ;
    // let end = Math.min(
    //   ini + this.pageSize,
    //   this.tabelaLocal.linhas.length
    // );
    // this.tabelaPagina.linhas = this.tabelaLocal.linhas.slice(ini, end);
    this.onPageChange.emit(pageEvent);
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
    this.tabelaPagina.linhas = data.sort(
      (a,b) => {
        const isAsc = sort.direction === 'asc';
        
        return compare(a.colunas[colId].value, b.colunas[colId].value, isAsc)
      }
    )
    
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    
    if(!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tabelaPagina.linhas.length;
    return numSelected === numRows;
  }


  toggleAllRows() {

    if (!this.multi) {
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
      this.onSelected.emit(null);
      return;
    }

    this.selection.select(...this.tabelaPagina.linhas.map(l => l.obj));
  
  }

  public filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.onFilter.emit(filterValue.trim().toLowerCase());
    
  }

}


