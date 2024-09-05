import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatarLabel } from '../../CrudComponent';
import { isArray, isObject } from '../../functions/util';
import { ModalSearch } from '../../models/modal-search';
import { CrudService } from '../../services/crud.service';
import { ModalService } from '../../services/modal.service';
import { FormField } from '../filtro-form/model/form-field.model';
import { modalButton } from '../modal-form/modal-form.component';
import { ModalSearchComponent } from '../modal-search/modal-search.component';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, OnChanges {


  @Input() field!: FormField<any>;
  @Input()form!: FormGroup;
  @Input() modalSearchConfig: ModalSearch[];
  @Output() onSearchSet: EventEmitter<any> = new EventEmitter<any>();

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  keywords: any[] = [];

  public websiteFilterCtrl: FormControl = new FormControl();
  public filteredOptions: ReplaySubject<any> = new ReplaySubject(1);
  protected _onDestroy = new Subject();
  constructor(public modalService: ModalService, ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.fieldTypeHandler();
  }

  ngOnInit(): void {

    this.fieldTypeHandler();
    
  }

  private fieldTypeHandler() {
    if (this.field.controlType === 'table') {
      this.dataSource = new MatTableDataSource((this.form.get(this.field.key) as FormArray).controls);
      console.log((this.form.get(this.field.key) as FormArray).controls[0]);
      console.log((this.form.get(this.field.key) as FormArray));
      this.displayedColumns = Object.keys((this.form.get(this.field.key) as FormArray).controls[0].value).filter(k => k !== 'isEditable' && k !== 'id');


    }

    if (this.field.controlType === 'search') {

      if (this.field.value && isArray(this.field.value)) {
        this.keywords = this.field.value.map((r: any) => this.searchValueFromObj(r));
      }

    }

    if (this.field.controlType === 'dropdown') {
      this.filteredOptions.next(this.field.options);
      this.websiteFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe((value: any) => {
          console.log(value);

          if (value?.length === 0) {
            this.filteredOptions.next(
              this.field.options
            );
          }
          if (!value || !this.field.options) {
            return;
          }

          this.filteredOptions.next(
            this.field.options.filter(op => op.value && op.value.toLowerCase().indexOf(value.toLowerCase()) > -1)
          );
        });
    }
  }

  get isValid(): boolean {
    if (Object.keys(this.form.controls).length === 0) {
      return true;
    }
    return this.form.controls[this.field.key]?.valid;
  }


  onSearchClick(key: string) {
    let found = this.modalSearchConfig.find(ms => ms.key === key);

    if(found) {
      this.modalService.openSearch(found,null,null).subscribe((result: any) => {

        if (isArray(result)) {
          if (result.length === 1) {
            this.form.controls[found.key].setValue(result[0]);
          } 
          
          if (result?.length > 1) {
            this.keywords = [];
            this.keywords = result.map((r: any) => this.searchValueFromObj(r));
            this.form.controls[found.key].setValue(result);
          } else {
            this.keywords = [];
          }
        } else {
          this.form.controls[found.key].setValue(result);
        }
        this.onSearchSet.emit(result);
       
      });
    }
  }

  //tornar um callback definido pelo usuario
  get formattedLabel () {
     let str =  !this.field.label.toLowerCase().startsWith("ca") ? this.field.label.replace("ca", "��") : this.field.label;
    
     return str.split(/(?=[A-Z])/).join(" ")
  }

  //remover tratamento ou internacionalizar item
  get isSenha() {
    return this.field.key === "senha" || this.field.key === "confirmaSenha";
  }


  get searchValue() {
    
    let value = this.form.controls[this.field.key].value;
    if (value == null || value == undefined) {
      return '';
    }
    if (value['id'] == null || value['id'] == undefined) {
      return '';
    }
    if (value && this.field.controlType === "search") {
      return formatarLabel(this.field.key, value);
    }
    
    return value;
  }
  //parametrizar para deixar generico
  searchValueFromObj(obj: any): any {
    
    let value = obj;
    
    if(!value) {
      return '';
    }
    
    if (value['id'] == null || value['id'] == undefined) {
      return '';
    }
    if (value && this.field.controlType === "search") {
      return value['descricao'] ? value['descricao'] : value['nome'] ? value['nome'] :
      
      this.field.key + '-' + (value['id'] < 10 ? '0' + value['id'] : value['id']) ;
    }
    
    return value;
  }
  

   // this function will enabled the select field for editd
   EditSVO(VOFormElement: FormGroup, i: number) {

    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    
    (VOFormElement.get(this.field.key) as FormArray).controls[i].get('isEditable').patchValue(false);
    // this.isEditableNew = true;

  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(VOFormElement: FormGroup, i: number) {
    // alert('SaveVO')
    (VOFormElement.get(this.field.key) as FormArray).controls[i].get('isEditable').patchValue(true);
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement: FormGroup, i: number) {
    (VOFormElement.get(this.field.key) as FormArray).controls[i].get('isEditable').patchValue(true);
  }
  
  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  labelTable(column: string) {
    let str = column.replace("ca", "��")
    
    return str.split(/(?=[A-Z])/).join(" ")
  }

  isObject(key: string, i: number): boolean {

    let obj = (this.form.get(this.field.key) as FormArray).controls[i].get(key).value
    
    return isObject(obj);
  }

  getLabelFromObj(key: string, i: number) {
    let obj = (this.form.get(this.field.key) as FormArray).controls[i].get(key).value

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

  getLabelOfObj(obj: any) {
    if (obj.descricao) {
      return obj.descricao;
    }
    if (obj.nome) {
      return obj.nome;
    }

    if (obj.nomeFantasia) {
      return (obj.codigo ? obj.codigo : obj.id) + " - " + obj.nomeFantasia;
    }
  }

  get getMask() {
    if (this.field.key == 'cpf' || this.field.key == 'cnpj') {
      return '000.000.000-00||00.000.000/0000-00';
    }

    return ''
  }

}
