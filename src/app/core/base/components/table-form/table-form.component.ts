import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { compare } from '../apres-table/apres-table.component';
import { DadosOrigemTabela } from '../apres-table/model/dados-origem-tabela.model';
import { TabelaForm } from './model/tabela-form';
import { isObject } from '../../functions/util';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent implements OnInit, OnDestroy {
  @Input() dadosOrigem: any[];
  @Input() color: string = 'primary';
  @Input() totalElementos: number = 0;
  @Input() multi: boolean = false;
  @Input() habilitarSelecao: boolean = true;
  @Input() readonlyKeys: string[] = [];
  @Input() stickyColumns: boolean = false;
  @Input() colStickyIni: number = 0;
  @Input() colStickyFim: number = 0;
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>()
  @Output() onPageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Output() onSalvar: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  public selection = new SelectionModel<any>(false, []);
  public tabelaLocal: TabelaForm = new TabelaForm([]);
  public pageSize: number = 5;
  public minSizePage: number = 5;
  public pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  tabelaCarregada: boolean;
  dataSource: MatTableDataSource<any>;
  lastPageEvent: PageEvent = new PageEvent();
  isAtualizacaoPorScrollDown: boolean = false;
  debounceFilter: any;

  constructor(private cdf: ChangeDetectorRef) { 
    
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    // this.tabelaLocal = new Tabela(this.dadosOrigem);
    this.selection = new SelectionModel<any>(this.multi, []);
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  private filter(data: AbstractControl, filter: string):  boolean {
    
    let str = Object.values(data.value).join("").toLowerCase();
    return str.indexOf(filter.toLowerCase()) != -1;
  }

  scrollEvent = (e: any): void => {
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;  
    let shouldGetMoreData =   (this.lastPageEvent.pageIndex * this.lastPageEvent.pageSize) < this.totalElementos;
    if (scrollLocation > limit && !this.isAtualizacaoPorScrollDown && shouldGetMoreData) {
      // console.log(tableViewHeight);
      // console.log(tableScrollHeight);
      // console.log(scrollLocation);
      // console.log("Next page by scroll")
      // if (isNaN(this.lastPageEvent.pageIndex)) {
      //   this.lastPageEvent.pageIndex = 0;
      //   this.lastPageEvent.length = this.totalElementos;
      //   this.lastPageEvent.pageSize =this.pageSize;
      //   this.lastPageEvent.previousPageIndex = 0;
      // }
      // this.isAtualizacaoPorScrollDown = true;
      // this.lastPageEvent.previousPageIndex = this.lastPageEvent.pageIndex;
      // this.lastPageEvent.pageIndex++;
      // this.onPageChange.emit(this.lastPageEvent)
      
    } 
  }

  isSticky(colIdx: number) {
    if (this.stickyColumns){
      return colIdx < (this.habilitarSelecao ? this.colStickyIni + 1 : this.colStickyIni);
    }

    return false;
  }

  isStickyEnd(colIdx: number) {
    if (this.stickyColumns){
      return colIdx > this.tabelaLocal.displayedColumns.length - 2;
    }

    return false;
  }

  ngOnChanges(changes: SimpleChanges): void {

    // if (!this.isAtualizacaoPorScrollDown || this.tabelaLocal == undefined || this.tabelaLocal == null || this.tabelaLocal.linhas.length == 0) {
    //   this.tabelaLocal = new TabelaForm(this.dadosOrigem, this.readonlyKeys, this.habilitarSelecao);
    // } else {
    //   this.tabelaLocal.adicionarMaisLinhas(this.dadosOrigem);
    // }
    this.tabelaLocal = new TabelaForm(this.dadosOrigem, this.readonlyKeys, this.habilitarSelecao);
    this.isAtualizacaoPorScrollDown = false;
    
    this.dataSource = new MatTableDataSource(this.tabelaLocal.linhas);
    this.dataSource.filterPredicate = this.filter;

    if (this.pageSizeOptions.length > 5) {
      this.pageSizeOptions.pop();
    }
    if (this.totalElementos > 20 && this.pageSizeOptions.indexOf(this.totalElementos) === -1) {

      this.pageSizeOptions.push(this.totalElementos > 300 ? 300 : this.totalElementos);
    }

    this.pageSizeOptions = [...this.pageSizeOptions];

    this.cdf.detectChanges();
  }

  counter(size: number) {
    return new Array(size).map((_, i) => i);
  }

  onPageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.lastPageEvent = pageEvent;
    // let ini = pageEvent.pageIndex * this.pageSize ;
    // let end = Math.min(
    //   ini + this.pageSize,
    //   this.tabelaLocal.linhas.length
    // );
    // this.tabelaPagina.linhas = this.tabelaLocal.linhas.slice(ini, end);
    this.onPageChange.emit(pageEvent);
  }

  sortData(sort: Sort) {
    const data = this.tabelaLocal.linhas.slice();
    if (sort.active === undefined) {
      this.tabelaLocal.linhas = data;
      return;
    }
    if (sort.direction === '') {
      this.tabelaLocal.linhas = data;
      return;
    }
    this.tabelaLocal.linhas = data.sort(
      (a,b) => {
        const isAsc = sort.direction === 'asc';
        
        return compare(a.get(sort.active).value, b.get(sort.active).value, isAsc)
      }
    )

    this.tabelaLocal.linhas.forEach(
      a => console.log(a)
    )
    
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    
    if(!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }


  onSelect(row: any) {
    this.selection.toggle(row);

    if (!this.selection.isSelected(row)) {
      this.onSelected.emit(null);
    } else {
      this.onSelected.emit(this.multi ? this.selection.selected : row);
    }
    
  }



  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tabelaLocal.linhas.length;
    return numSelected === numRows;
  }


  toggleAllRows() {

    if (!this.multi) {
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.tabelaLocal.linhas.map(c => c.value));
    this.onSelected.emit(this.selection.selected);
  
  }

  // this function will enabled the select field for editd
  EditSVO( i: number) {

    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    
    this.tabelaLocal.linhas[i].get('isEditable').patchValue(false);
    // this.isEditableNew = true;

  }

  labelTable(i: number) {
    return this.tabelaLocal.cabecalho[i - (this.habilitarSelecao ? 1 : 0)];
  }

  isObject(key: string, i: number) {
    let obj = this.tabelaLocal.linhas[i].get(key).value
    
    return isObject(obj);
  }

  isReadOnly(key: string, i: number): boolean {
   

    if(this.readonlyKeys.includes(key)){
      return true;
    }
    
    return false;
  }

  getLabelFromObj(key: string, i: number) {
    let obj = this.tabelaLocal.linhas[i].get(key).value

    if (obj.descricao) {
      return obj.descricao;
    }
    if (obj.nome) {
      return obj.nome;
    }

    if (obj.nomeFantasia) {
      return (obj.codigo ? obj.codigo : obj.id) + " - " + obj.nomeFantasia;
    }

    return key + (obj.id ? obj.id : obj.codigo);
  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(i: number) {
    // alert('SaveVO')
    this.tabelaLocal.linhas[i].get('isEditable').patchValue(true);
    this.onSalvar.emit(this.tabelaLocal.linhas[i].value);
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO( i: number) {
    this.tabelaLocal.linhas[i].get('isEditable').patchValue(true);
  }

  isEditable(i: number) {
    return this.tabelaLocal.linhas[i].get('isEditable').value
  }

  
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    clearTimeout(this.debounceFilter)
    this.debounceFilter = setTimeout(() => {

      if (this.dataSource.filter.length >= 4) {
        this.onFilter.emit(this.dataSource.filter);
      }

    }, 500)
    
    
  }

}
